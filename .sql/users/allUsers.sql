 SELECT distinct
  administratorid "id",
  f.customerid "custid",
  c.companyname "customer",
  f.kind "accesstype",
  f.name,
  f.username,
  coalesce(f.email, f.username || '@deic.dk') "email",
  coalesce(f.lastlogin, now()) "lastloggedin",
  coalesce(f.lastpasswordchange, now()) "pwdlastchangedon"
FROM flow.administrators as f
RIGHT OUTER JOIN flow.customers as c
ON f.customerid = c.customerid
WHERE f.valid = 'TRUE'
ORDER BY lastloggedin DESC
