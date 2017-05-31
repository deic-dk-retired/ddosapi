SELECT
  icmp->>'type' "id",
  icmp->>'name' "value"
FROM flow.icmp_types