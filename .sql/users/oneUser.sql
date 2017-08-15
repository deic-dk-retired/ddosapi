SELECT
  administratorid "id",
  f.customerid "custid",
  c.companyname "company",
  f.kind "accesstype",
  f.name,
  f.phone,
  f.username,
  coalesce(f.email, f.username || '@deic.dk') "email",
  coalesce(f.lastlogin, now()) "lastloggedin",
  coalesce(f.lastpasswordchange, now()) "pwdlastchangedon"
FROM flow.administrators f
LEFT JOIN flow.customers c
ON f.customerid = c.customerid
WHERE f.username = $(username)