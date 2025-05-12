SELECT
  CONCAT(e.cnpj_basico, e.cnpj_ordem, e.cnpj_dv) AS cnpj,
  e2.razao_social_nome_empresarial AS razao,
  CASE
    WHEN LEFT(e.telefone_1, 1) IN ('7', '8', '9') AND LENGTH(e.telefone_1) = 8 THEN
      CONCAT(REGEXP_REPLACE(e.ddd_1, '^0', ''), '9', e.telefone_1)
    WHEN LEFT(e.telefone_1, 1) IN ('2','3','4','5','6') AND LENGTH(e.telefone_1) = 8 THEN
      CONCAT(REGEXP_REPLACE(e.ddd_1, '^0', ''), '9', e.telefone_1)
    ELSE '0'
  END AS telefone,
  CASE
    WHEN LEFT(e.telefone_2, 1) IN ('7', '8', '9') AND LENGTH(e.telefone_2) = 8 THEN
      CONCAT(REGEXP_REPLACE(e.ddd_2, '^0', ''), '9', e.telefone_2)
    WHEN LEFT(e.telefone_2, 1) IN ('2','3','4','5','6') AND LENGTH(e.telefone_2) = 8 THEN
      CONCAT(REGEXP_REPLACE(e.ddd_2, '^0', ''), '9', e.telefone_2)
    ELSE '0'
  END AS telefone2,
  m.nome
FROM estabelecimentos e
RIGHT JOIN empresas e2 ON e.cnpj_basico = e2.cnpj_basico
RIGHT join municipios m ON e.municipio = m.siafi_id
WHERE
  e.situacao_cadastral = '02'
  AND
      e.uf = ANY($1)
  AND
      m.siafi_id = ANY($2)
  AND (
    e.telefone_1 ~ '^(?!([0-9])\\1{7,10})[0-9]{8,11}$'
    OR
    e.telefone_2 ~ '^(?!([0-9])\\1{7,10})[0-9]{8,11}$'
  )
LIMIT $3;