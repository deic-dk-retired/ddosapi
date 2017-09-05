UPDATE flow.administrators
SET customerid=$(customerid)
, kind=$(kind)
, name=$(name)
, phone=$(phone)
, email=$(email)
, username=$(username)
, password=crypt($(password), gen_salt('bf', 10))
, lastpasswordchange = now()
WHERE administratorid = $(userid);

COMMIT;