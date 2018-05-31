UPDATE flow.customers
SET networks = array_remove(networks, $(netid))
WHERE customerid = $(coid)
RETURNING *;

COMMIT;