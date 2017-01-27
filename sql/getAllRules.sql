SELECT
  ruleid,
  custid,
  c.companyname,
  custnetid,
  rname,
  adminid,
  admname,
  direct,
  fromdate,
  fromtime,
  todate,
  totime,
  duration,
  ago,
  fmonid,
  active,
  expired,
  destpre,
  sourcepre,
  CASE
    WHEN protocol NOT IN ('tcp', 'udp', 'icmp')
    THEN 'other'
    ELSE protocol
  END AS protocol,
  destpt,
  srcpt,
  pktlen
FROM
( SELECT
  flowspecruleid "ruleid",
  f.customerid "custid",
  customernetworkid "custnetid",
  rule_name "rname",
  f.administratorid "adminid",
  a.name "admname",
  direction "direct",
  to_char(validfrom,'FMMon FMDDth, YYYY') "fromdate",
  to_char(validfrom,'HH24:MI:SS') "fromtime",
  to_char(validto,'FMMon FMDDth, YYYY') "todate",
  to_char(validto,'HH24:MI:SS') "totime",
  age(validto, validfrom) "duration",
  age(validto) "ago",
  fastnetmoninstanceid "fmonid",
  isactivated "active",
  isexpired "expired",
  destinationprefix "destpre",
  sourceprefix "sourcepre",
  ipprotocol "protocol",
  destinationport "destpt",
  sourceport "srcpt",
  packetlength "pktlen"
  FROM flow.flowspecrules AS f
  RIGHT OUTER JOIN flow.administrators AS a
  ON f.administratorid = a.administratorid
  WHERE f.flowspecruleid
  NOT IN
  ( SELECT
    t.flowspecruleid
    FROM flow.flowspecrules AS t
    WHERE t.flowspecruleid
    NOT IN
    ( SELECT DISTINCT
      x.flowspecruleid
      FROM flow.flowspecrules AS x
      WHERE srcordestport = destinationport
    )
  ) AND f.customerid > 1
) AS ff
RIGHT OUTER JOIN flow.customers AS c
ON c.customerid = ff.custid
WHERE ruleid IS NOT NULL
ORDER BY fromdate DESC