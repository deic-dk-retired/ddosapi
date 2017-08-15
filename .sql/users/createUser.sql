INSERT INTO flow.administrators
( customerid,
  kind,
  name,
  phone,
  username,
  password,
  valid,
  lastlogin,
  lastpasswordchange
)
VALUES
( $(custid),
  $(usertype),
  $(fullname),
  $(userphone),
  $(username),
  crypt($(password), gen_salt('bf', 10)),
  true,
  now(),
  now()
);

COMMIT;