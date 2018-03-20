select
  customernetworkid,
  uuid_customernetworkid "netuuid",
  customerid,
  uuid_customerid "couuid",
  name,
  kind,
  net,
  description
from flow.customernetworks
order by customernetworkid, customerid asc