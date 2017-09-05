select
  c.customernetworkid,
  c.customerid,
  n.administratorid,
  c.name,
  c.kind,
  c.net,
  c.description
from flow.customernetworks c
join flow.networkrights n
on c.customernetworkid = n.customernetworkid
where n.administratorid = $(userid)
order by customernetworkid, customerid asc;