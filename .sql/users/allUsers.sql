 SELECT DISTINCT
  -- f.administratorid
  f.uuid_administratorid "administratorid"
, f.customerid
, f.uuid_customerid "couuid"
, c.companyname
, f.kind
, f.name
, f.phone
, f.username
, f.valid
, coalesce(f.email, f.username || '@deic.dk') "email"
, coalesce(f.lastlogin, now() - interval '2 years') "lastlogin"
, coalesce(f.lastpasswordchange, now() - interval '2 years') "lastpasswordchange"
, f.networks "usrnets"
FROM flow.administrators as f
JOIN flow.customers c
ON f.customerid = c.customerid
ORDER BY lastlogin DESC

-- select f.*, c.companyname
-- from
-- ( SELECT DISTINCT
--   f.uuid_administratorid "administratorid"
-- , f.customerid
-- , f.uuid_customerid "couuid"
-- , f.kind
-- , f.name
-- , f.phone
-- , f.username
-- , f.valid
-- , coalesce(f.email, f.username || '@deic.dk') "email"
-- , coalesce(f.lastlogin, now() - interval '2 years') "lastlogin"
-- , coalesce(f.lastpasswordchange, now() - interval '2 years') "lastpasswordchange"
-- , f.networks "usrnets"
-- FROM flow.administrators as f
-- ) f
-- LEFT JOIN flow.customers c
-- ON f.couuid = c.uuid_customerid
-- ORDER BY lastlogin DESC