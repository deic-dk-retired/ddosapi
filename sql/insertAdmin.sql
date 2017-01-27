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
( ${custid},
  ${usrtype},
  ${usrname},
  ${usrphone},
  ${usr},
  crypt(${pwd}, gen_salt('bf', 10)),
  true,
  null,
  now()
)