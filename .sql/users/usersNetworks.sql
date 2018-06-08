select distinct
  c.customernetworkid,
  c.uuid_customernetworkid "netuuid",
  c.customerid,
  c.uuid_customerid "couuid",
  c.name,
  c.kind,
  c.net,
  c.description
from flow.administrators a
join flow.customernetworks c
on c.customernetworkid = any(a.networks)
and c.customernetworkid = ANY($(networkids)::int[])
order by c.customernetworkid, c.customerid asc;