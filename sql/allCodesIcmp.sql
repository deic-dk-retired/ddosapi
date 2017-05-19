select row_to_json (t)
from
  (select
    code->>'codeno' as no,
    code->>'code' as code
    from flow.icmp_codes
    where cast(code->>'type' as int) = ${code}
  ) t