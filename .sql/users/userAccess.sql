SELECT
  f.uuid_administratorid "administratorid"
, c.companyname
, c.uuid_customerid "coid"
, f.kind
, f.name
, f.username
, f.valid
, (f.password = crypt($(password), f.password)) "hasAccess"
, coalesce(f.email, f.username || '@deic.dk') "email"
, coalesce(f.lastlogin, now()) "lastlogin"
, coalesce(f.lastpasswordchange, now()) "lastpasswordchange"
FROM flow.administrators f
JOIN flow.customers c
ON f.customerid = c.customerid
WHERE f.username = $(username)

