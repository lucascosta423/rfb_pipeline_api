const fs = require('fs');
const { Parser } = require('json2csv');
const path = require('path');
const pool = require('../config/db/index.js');


let estados = [];
let situacao = [];
let cidades = [];

async function carregarEstados() {
  try {
    const result = await pool.query('SELECT uf, nome FROM estados ORDER BY nome');
    estados = result.rows;
    return estados;
  } catch (error) {
    console.error('Erro ao carregar estados:', error);
  }
}

function getEstados() {
  return estados;
}

async function carregarSituacao() {
  try {
    const result = await pool.query('select distinct situacao_cadastral  from estabelecimentos e ');
    situacao = result.rows;
    return estados;
  } catch (error) {
    console.error('Erro ao carregar situações:', error);
  }
}

function getSituacao() {
  return situacao;
}

// async function carregarCidades() {
//   try {
//     const sqlFile = path.join(__dirname, '../scriptsSql/getCidades.sql');
//     const sql = fs.readFileSync(sqlFile, 'utf8');
//     const result = await pool.query(sql);
//     console.log(result.rows);
//     cidades = result.rows;
//     return cidades;
//   } catch (error) {
//     console.error('Erro ao carregar cidades:', error);
//   }
// }

// function getCidades() {
//   return cidades;
// }

async function exportCsv(cidades, estados, limit) {
  try {
    const sqlFile = path.join(__dirname, '../scriptsSql/selectDefault.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    const results = await pool.query(sql, [estados, cidades, limit]);

    if (!results.rows.length) {
      console.log('Nenhum dado encontrado');
      return null;
    }

    const json2csv = new Parser();
    const csv = json2csv.parse(results.rows);

    return csv; // <-- retorna o CSV como string
  } catch (err) {
    console.error('Erro ao exportar CSV:', err);
    throw err;
  }
}


module.exports = {
  carregarEstados,
  getEstados,
  carregarSituacao,
  exportCsv
};
