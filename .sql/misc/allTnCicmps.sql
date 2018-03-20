select distinct
  cast(coalesce(icmp->>'type', '0') as integer) as "id",
  icmp->>'name' as "name",
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
where icmp->>'name' is not null
order by id, codeid