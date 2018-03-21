INSERT INTO flow.customers
( uuid_customerid,
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
  description
)
VALUES
( $(couuid),
  $(coname),
  $(coadd1),
  $(coadd2),
  $(coadd3),
  $(coadd4),
  $(coaccname),
  $(coaccemail),
  $(coaccphone),
  $(coaccrate),
  $(subfee),
  $(discount),
  $(coemail),
  $(cophopne),
  $(coweb),
  $(cocvr),
  $(coean),
  TRUE,
  $(codesc)
)
RETURNING *;

COMMIT;