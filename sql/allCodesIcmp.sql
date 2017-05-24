select * from
(select
  code->>'codeno' as code,
  code->>'code' as value
  from flow.icmp_codes
  where cast(code->>'type' as int) = ${type}
) t