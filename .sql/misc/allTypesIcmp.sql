SELECT DISTINCT
  CAST(coalesce(icmp->>'type', '0') AS integer) as "id",
  icmp->>'name' "name"
FROM flow.icmp_types
order by icmp->>'name';