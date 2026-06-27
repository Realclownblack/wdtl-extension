# Exemplo WDTL — pipeline de vendas
# Carrega os dados de vendas e clientes

LET vendas   = LOAD-CSV "data/vendas.csv"
LET clientes = LOAD-EXCEL "data/clientes.xlsx" sheet="Base"

# Filtra apenas vendas do ano atual
LET vendas_2024 = FILTER vendas WHERE ano == 2024

# Junta com clientes
LET completo = JOIN vendas_2024 WITH clientes ON cliente_id

# Agrupa por região
LET por_regiao = GROUPBY completo
  BY regiao
  AGGREGATE
    total_vendas = sum(valor),
    qtd          = count(pedido_id),
    ticket_medio = round(avg(valor), 2)

# Ordena por total decrescente
LET ranking = SORT por_regiao BY total_vendas DESC

# Exporta resultado
EXPORT-CSV ranking TO "output/ranking_regioes.csv"
EXPORT-EXCEL ranking TO "output/ranking_regioes.xlsx"
