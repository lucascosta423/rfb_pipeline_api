// routes/colunas.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '181.191.206.183',
  database: 'postgres',
  password: 'Ultrac0m',
  port: 5433,
});

router.get('/:tabela', async (req, res) => {
  const tabela = req.params.tabela;
  try {
    const result = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = $1
    `, [tabela]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao consultar colunas' });
  }
});



module.exports = router;
