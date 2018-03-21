DELETE
FROM flow.customers
where customerid = $(coid);

COMMIT;