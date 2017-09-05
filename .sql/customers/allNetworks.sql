select
  customernetworkid,
  customerid,
  name,
  kind,
  net,
  description
from flow.customernetworks
order by customernetworkid, customerid asc