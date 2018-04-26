select count(*)
from flow.flowspecrules
where validfrom > (
select coalesce(lastlogin, now()) "lastlogin" from
flow.administrators
where uuid_administratorid = $(userid))
