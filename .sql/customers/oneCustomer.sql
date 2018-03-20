select
  customerid,
  uuid_customerid "couuid",
  companyname,
  companyadr1,
  companyadr2,
  companyadr3,
  companyadr4,
  accountantname,
  accountantemail,
  accountantphone,
  hourlyrate,
  subscriptionfee,
  deductionpct,
  mainmail,
  mainphone,
  mainurl,
  cvr,
  ean,
  valid,
  description,
  networks "conets"
from flow.customers
where valid = TRUE
and customerid = $(customerid)
order by customerid asc