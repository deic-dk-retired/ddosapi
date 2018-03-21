DELETE
FROM flow.customernetworks
where customernetworkid = $(netid)
RETURNING *;

COMMIT;