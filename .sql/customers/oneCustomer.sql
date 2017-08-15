select *
from flow.customers
where valid = TRUE
and customerid = $(customerid)
order by customerid asc