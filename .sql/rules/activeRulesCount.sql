select distinct count(*)
FROM flow.flowspecrules f
where f.flowspecruleid in
(
  SELECT DISTINCT flowspecruleid
  FROM flow.flowspecrules AS x
  WHERE coalesce(srcordestport,'') = coalesce(destinationport,'')
)
AND isactivated = TRUE
AND isexpired = FALSE