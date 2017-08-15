UPDATE flow.administrators
SET customerid=$(customerid)
, kind=$(kind)
, name=$(name)
, phone=$(phone)
, email=$(email)
WHERE username = $(username);

COMMIT;