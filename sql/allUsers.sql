SELECT
  trim('users') as type,
  administratorid "id",
  customerid "custid",
  kind "accessType",
  name,
  username
FROM flow.administrators
WHERE valid = 'TRUE'
ORDER BY id ASC