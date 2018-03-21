 SELECT DISTINCT
  f.administratorid
, f.uuid_administratorid "useruuid"
, f.customerid
, f.uuid_customerid "couuid"
, c.companyname
, f.kind
, f.name
, f.phone
, f.username
, f.valid
, coalesce(f.email, f.username || '@deic.dk') "email"
, coalesce(f.lastlogin, now()) "lastlogin"
, coalesce(f.lastpasswordchange, now()) "lastpasswordchange"
, f.networks "usrnets"
FROM flow.administrators as f
LEFT JOIN flow.customers c
ON f.customerid = c.customerid
-- WHERE f.valid = 'active'
ORDER BY lastlogin DESC