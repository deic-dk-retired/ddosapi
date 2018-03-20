SELECT
  f.administratorid
, f.uuid_administratorid
, c.companyname
, f.kind
, f.name
, f.username
, f.valid
, (f.password = crypt($(password), f.password)) "hasAccess"
, coalesce(f.email, f.username || '@deic.dk') "email"
, coalesce(f.lastlogin, now()) "lastlogin"
, coalesce(f.lastpasswordchange, now()) "lastpasswordchange"
FROM flow.administrators f
LEFT JOIN flow.customers c
ON f.customerid = c.customerid
WHERE f.username = $(username)

