SELECT
  f.administratorid
, f.uuid_administratorid "useruuid"
, f.uuid_customerid "couuid"
, f.customerid
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
FROM flow.administrators f
LEFT JOIN flow.customers c
ON f.customerid = c.customerid
WHERE f.administratorid = $(userid)
-- AND f.valid = 'active'