UPDATE flow.flowspecrules
SET validto = now()
, isactivated = $(isactive)
, isexpired = $(isexpired)
WHERE flowspecruleid = $(ruleid);

COMMIT;