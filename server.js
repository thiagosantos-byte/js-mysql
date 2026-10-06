const express  = require ('express');
const path = require ('path');
const pool = require ('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/usuarios', async (req, res) => {
  const { nome, email } = req.body;
  console.log('Dados recebidos:', { nome, email });

  try {
    const [resultado] = await pool.query(
      'INSERT INTO usuarios (nome, email) VALUES (?, ?)',
      [nome, email]
    );
    console.log('Inserido com sucesso! ID:', resultado.insertId);
    res.status(201).send('Cadastrado com sucesso!');
  } catch (error) {
    console.error('=== ERRO DO MYSQL ===\n', error);
    res.status(500).send(`Erro ao cadastrar: ${error.message}`);
  }
});
app.get('/usuarios', async (req, res) => {
    try{
        const [usuarios] = await pool.execute (
            'SELECT id, nome, email, criado_em FROM usuarios ORDER BY id DESC'
        );
        res.json(usuarios);
    } catch (erro) {
        res.status(500).json({ error: 'Erro ao buscar usuários.', detalhes: erro.message });
    }
});

 app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);  
 });