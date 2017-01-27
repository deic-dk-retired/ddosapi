SELECT DISTINCT
  rname,
  admname,
  CASE
    WHEN protocol NOT IN ('tcp','udp','icmp')
      THEN 'other'
      ELSE protocol
    END AS protocol,
  fromdate,
  to_date(fromdate, 'FMMon FMDD, ''YY'),
  trim(max(fromtime)) maxfromtime,
  trim(todate) todate,
  sourcepre,
  destpre,
  count(destpt),
  max(pktlen) maxpktlen,
  active,
  sum(duration) totduration
FROM(
  SELECT
    flowspecruleid "ruleid",
    f.customerid "custid",
    customernetworkid "custnetid",
    rule_name "rname",
    f.administratorid "adminid",
    a.name "admname",
    direction "direct",
    validfrom,
    to_char(validfrom, 'FMMon FMDD, ''YY') "fromdate",
    to_char(validfrom, 'HH24:MI:SS') "fromtime",
    to_char(validto, 'FMMon FMDD, ''YY') "todate",
    to_char(validto, 'HH24:MI:SS') "totime",
    age(validto, validfrom) "duration",
    EXTRACT(HOUR FROM age(validto, validfrom)) "dhrs",
    EXTRACT(MINUTE FROM age(validto, validfrom)) "dmins",
    round(EXTRACT(SECOND FROM age(validto, validfrom))) "dsecs",
    age(validto) "ago",
    EXTRACT(HOUR FROM age(validto)) "ahrs",
    EXTRACT(MINUTE FROM age(validto)) "amins",
    round(EXTRACT(SECOND FROM age(validto))) "asecs",
    fastnetmoninstanceid "fmonid",isactivated "active",
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
  WHERE f.flowspecruleid NOT IN
    ( SELECT
        t.flowspecruleid
      FROM flow.flowspecrules AS t
      WHERE t.flowspecruleid NOT IN
      ( SELECT DISTINCT x.flowspecruleid
        FROM flow.flowspecrules AS x
        WHERE srcordestport = destinationport
      )
    )
    AND f.customerid > 1
  ) AS ff
  RIGHT OUTER JOIN flow.customers AS c
  ON c.customerid = ff.custid
  WHERE ruleid IS NOT NULL
  GROUP BY
    rname,
    admname,
    protocol,
    fromdate,
    to_date(fromdate, 'FMMon FMDD, ''YY'),
    todate,
    sourcepre,
    destpre,
    pktlen,
    active
  ORDER BY to_date(fromdate, 'FMMon FMDD, ''YY') DESC
