var express = require('express');
const estadosService = require('../service/utilsServices');
var router = express.Router();
const pool = require('../config/db/index.js');
const path = require("path");
const fs = require("fs");

/* GET home page. */
router.get('/', (req, res) => {

  const estados = estadosService.getEstados();

  res.render('index', { estados, selecionado: null, erro: null, sucesso: null });
});

router.post('/enviar', async (req, res) => {
  console.log(req.body);
  try {
    const estados = Array.isArray(req.body['estados[]'])
      ? req.body['estados[]']
      : [req.body['estados[]']];

    const cidades = Array.isArray(req.body['cidades[]'])
      ? req.body['cidades[]'].map(c => parseInt(c))
      : [parseInt(req.body['cidades[]'])];

    const limit = parseInt(req.body.quant) || 100;

    const csv = await estadosService.exportCsv(cidades, estados, limit);

    if (!csv) {
      return res.status(404).send('Nenhum dado para exportar.');
    }

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const filename = `export-${timestamp}.csv`;

    // Envia o CSV direto como download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao exportar CSV');
  }
});



router.post('/cidades-por-estados', async (req, res) => {
  try {
    const sqlFile = path.join(__dirname, '../scriptsSql/getCidades.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    const { estados } = req.body;

    // var query1 = 'select m.siafi_id,m.nome from municipios m join estados e on m.codigo_uf = e.codigo_uf WHERE e.uf = ANY($1)'

    const result = await pool.query(sql,[estados]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar cidades:', err);
    res.status(500).json({ erro: 'Erro ao buscar cidades' });
  }
});

module.exports = router;
