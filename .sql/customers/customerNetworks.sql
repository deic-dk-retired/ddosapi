select
  c.customernetworkid,
  c.uuid_customernetworkid "netuuid",
  a.customerid,
  a.uuid_customerid "couuid",
  c.name,
  c.kind,
  c.net,
  c.description
from flow.customers a
join flow.customernetworks c
on c.customernetworkid = any(a.networks)
where a.customerid = $(customerid)
and c.customernetworkid = ANY(a.networks::int[])
order by c.customernetworkid, a.customerid asc