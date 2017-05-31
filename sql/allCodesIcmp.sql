select
code->>'codeno' as id,
code->>'type' as typeid,
code->>'code' as value
from flow.icmp_codes