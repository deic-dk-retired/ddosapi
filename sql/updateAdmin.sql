UPDATE flow.administrators
SET customerid=${custid},
kind=${usrtype},
name=${usrname},
phone=${usrphone},
username=${usr},
password=crypt(${pwd}, gen_salt('bf', 10))
WHERE username = ${usr};

commit;