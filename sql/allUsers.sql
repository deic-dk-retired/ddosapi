SELECT
  administratorid "id",
  f.customerid "custid",
  f.kind "accesstype",
  f.name,
  f.username,
  f.lastlogin "lastloggedin",
  f.lastpasswordchange "pwdlastchangedon"
FROM flow.administrators f
WHERE f.valid = 'TRUE'
ORDER BY id ASC