UPDATE flow.customers
SET networks = $(netarr)
WHERE customerid = $(coid)
RETURNING *;