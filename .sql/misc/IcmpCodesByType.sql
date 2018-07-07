select  distinct
cast(coalesce(code->>'type', '0') as integer) "typeid",
cast(coalesce(code->>'codeno', '0') as integer) "codeid",
code->>'code' as value
from flow.icmp_codes
where cast(coalesce(code->>'type', '0') as integer) = $(icmpcode)
order by value, codeid