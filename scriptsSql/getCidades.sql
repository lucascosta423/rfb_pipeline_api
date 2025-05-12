select
m.siafi_id,
concat(m.nome,' - ',e.uf) as nome
from
    municipios m
join
    estados e
on
    m.codigo_uf = e.codigo_uf
WHERE e.uf = ANY($1)
ORDER BY e.uf