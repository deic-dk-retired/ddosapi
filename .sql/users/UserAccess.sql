SELECT
  trim('users') as type,
  f.administratorid "id",
  f.kind "accessType",
  f.name "fullName",
  f.lastlogin "lastLoggedOn",
  f.lastpasswordchange "pwdLastChangedOn",
  f.username,
  c.companyname "company",
  (f.password = crypt($(password), f.password)) "hasAccess"
FROM flow.administrators f
LEFT JOIN flow.customers c
ON f.customerid = c.customerid
WHERE f.username = $(username)