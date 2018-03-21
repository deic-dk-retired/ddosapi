INSERT INTO flow.administrators
( customerid,
  kind,
  name,
  phone,
  email,
  username,
  password,
  valid,
  lastlogin,
  lastpasswordchange
)
VALUES
( $(customerid),
  $(kind),
  $(name),
  $(phone),
  $(email),
  $(username),
  crypt($(password), gen_salt('bf', 13)),
  'active',
  now(),
  now()
)
RETURNING *;

COMMIT;