SELECT
  icmp->>'type' "value",
  icmp->>'name' "type"
FROM flow.icmp_types