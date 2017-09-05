 SELECT distinct
  administratorid,
  f.customerid,
  c.companyname,
  f.kind,
  f.name,
  f.phone,
  f.username,
  f.password,
  coalesce(f.email, f.username || '@deic.dk') "email",
  coalesce(f.lastlogin, now()) "lastlogin",
  coalesce(f.lastpasswordchange, now()) "lastpasswordchange"
FROM flow.administrators as f
LEFT JOIN flow.customers c
ON f.customerid = c.customerid
WHERE f.valid = 'active'
ORDER BY lastlogin DESC
