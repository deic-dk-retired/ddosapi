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
where c.customernetworkid = ANY($(networkids)::int[])
order by c.customernetworkid, a.customerid asc