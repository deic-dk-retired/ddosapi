select
  c.customernetworkid,
  c.uuid_customernetworkid "netuuid",
  c.customerid,
  c.uuid_customerid "couuid",
  -- a.administratorid,
  a.uuid_administratorid "administratorid",
  a.customerid,
  a.networks ,
  c.name,
  c.kind,
  c.net,
  c.description
from flow.administrators a
join flow.customernetworks c
on c.customernetworkid = any(a.networks)
and a.uuid_administratorid = $(userid)
order by c.customernetworkid, c.customerid asc;