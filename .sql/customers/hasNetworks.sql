select exists(
  select 1
  from flow.customernetworks
  where customerid= $(customerid)
) "hasNetwork";