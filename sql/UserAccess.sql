SELECT
  f.kind "accessType",
  f.name "fullName",
  to_char(f.lastlogin,'FMMon FMDDth, YYYY @ HH24:MI:SS') "lastLoggedOn",
  to_char(f.lastpasswordchange,'FMMon FMDDth, YYYY @ HH24:MI:SS') "pwdLastChangedOn",
  f.username,
  c.companyname "company",
  (f.password = crypt(${pwd}, f.password)) "hasAccess"
FROM flow.administrators f
LEFT JOIN flow.customers c
ON f.customerid = c.customerid
WHERE f.username = ${usr}