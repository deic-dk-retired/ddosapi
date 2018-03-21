select exists(
  select 1
  from flow.customers
  where customerid= $(customerid)
  and valid = TRUE
) "isCustomer",
companyname "coname"
from flow.customers
where customerid= $(customerid);
