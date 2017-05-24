SELECT
  administratorid "id",
  trim('users') as type,
  customerid "custid",
  kind "accessType",
  name,
  username
FROM flow.administrators
WHERE valid = 'TRUE'
ORDER BY id ASC