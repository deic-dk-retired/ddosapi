/**
 * create network record in
 * customernetworks table
 * This is list of all networks
 * for every customer
 */
INSERT INTO flow.customernetworks
( uuid_customernetworkid,
  uuid_customerid,
  customerid,
  name,
  kind,
  net,
  description )
VALUES
(
  $(netuuid),
  $(couuid),
  $(coid),
  $(netname),
  $(netkind),
  $(netaddr),
  $(netdesc)
)
RETURNING *;

-- COMMIT;