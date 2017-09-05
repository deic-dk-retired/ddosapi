select
  customernetworkid,
  customerid,
  name,
  kind,
  net,
  description
from flow.customernetworks
where customerid = $(customerid)
order by customernetworkid, customerid asc