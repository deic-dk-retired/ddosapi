SELECT DISTINCT
  CAST(coalesce(icmp->>'type', '0') AS integer) as "id",
  icmp->>'name' "value"
FROM flow.icmp_types
order by icmp->>'name'

-- SELECT
--   CAST(coalesce(icmp->>'type', '0') AS integer) as "id",
--   icmp->>'name' "value",
--   CAST(coalesce(c.id, '0') AS integer) as "codeid",
--   c.value "codevalue"
-- FROM flow.icmp_types as t
-- RIGHT OUTER JOIN
-- (select
--   code->>'codeno' as id,
--   code->>'type' as typeid,
--   code->>'code' as value
--   from flow.icmp_codes
--  ) as c
-- ON t.icmp->>'type' = c.typeid
-- order by t.id;
