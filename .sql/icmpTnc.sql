select distinct
  cast(coalesce(icmp->>'type', '0') as integer) as "typeid",
  icmp->>'name' "type",
  c.codeid,
  c.value as "code"
from flow.icmp_types as t
right outer join
(
select
cast(coalesce(code->>'type', '0') as integer) as typeid,
cast(coalesce(code->>'codeno', '0') as integer) as codeid,
code->>'code' as value
from flow.icmp_codes
) as c
on t.id = c.typeid
order by typeid, codeid