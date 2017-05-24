SELECT
  f.administratorid "id",
  trim('users') as type,
  f.kind "accessType",
  f.name "fullName",
  f.lastlogin "lastLoggedOn",
  f.lastpasswordchange "pwdLastChangedOn",
  f.username,
  c.companyname "company",
  (f.password = crypt(${pwd}, f.password)) "hasAccess"
FROM flow.administrators f
LEFT JOIN flow.customers c
ON f.customerid = c.customerid
WHERE f.username = ${usr}