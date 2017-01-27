SELECT
  administratorid "userid",
  customerid "custid",
  kind "accessType",
  name,
  username
FROM flow.administrators
WHERE valid = 'TRUE'
ORDER BY username ASC