SELECT distinct
  administratorid "id",
  f.customerid "custid",
  c.companyname "customer",
  f.kind "accesstype",
  f.name,
  f.username,
  f.lastlogin "lastloggedin",
  f.lastpasswordchange "pwdlastchangedon"
FROM flow.administrators as f
RIGHT OUTER JOIN flow.customers as c
ON f.customerid = c.customerid
WHERE f.valid = 'TRUE'
ORDER BY f.lastlogin DESC