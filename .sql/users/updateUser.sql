-- unused but here for reference of what a complete
-- update should look like
UPDATE flow.administrators
SET uuid_customerid = $(couuid),
customerid = $(coid),
kind = $(kind),
networks = $(netarr)
valid = $(valid)
WHERE uuid_administratorid = $(useruuid)
RETURNING *;

COMMIT;