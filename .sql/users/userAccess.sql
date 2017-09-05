SELECT
  trim('users') as type,
  f.administratorid,
  f.kind,
  f.name,
  f.lastlogin,
  f.lastpasswordchange,
  f.username,
  c.companyname,
  (f.password = crypt($(password), f.password)) "hasAccess"
FROM flow.administrators f
LEFT JOIN flow.customers c
ON f.customerid = c.customerid
WHERE f.username = $(username)