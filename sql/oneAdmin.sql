SELECT
  administratorid "userid",
  f.customerid "custid",
  c.companyname "company",
  f.kind "accessType",
  f.name,
  f.username,
  to_char(f.lastlogin,'FMMon FMDDth, YYYY @ HH24:MI:SS') "lastLoggedOn",
  to_char(f.lastpasswordchange,'FMMon FMDDth, YYYY @ HH24:MI:SS') "pwdLastChangedOn"
FROM flow.administrators f
LEFT JOIN flow.customers c
ON f.customerid = c.customerid
WHERE f.username = ${usr}