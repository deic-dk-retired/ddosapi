SELECT
  administratorid "id",
  f.customerid "custid",
  -- c.companyname "company",
  f.kind "accesstype",
  f.name,
  f.username,
  f.lastlogin "lastloggedin",
  f.lastpasswordchange "pwdlastchangedon"
FROM flow.administrators f
-- LEFT JOIN flow.customers c
-- ON f.customerid = c.customerid
WHERE f.username = ${usr}