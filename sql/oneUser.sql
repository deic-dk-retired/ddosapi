SELECT
  trim('users') as type,
  administratorid "id",
  f.customerid "custid",
  c.companyname "company",
  f.kind "accessType",
  f.name,
  f.username,
  f.lastlogin "lastLoggedOn",
  f.lastpasswordchange "pwdLastChangedOn"
FROM flow.administrators f
LEFT JOIN flow.customers c
ON f.customerid = c.customerid
WHERE f.username = ${usr}