-- select distinct *
-- from flow.flowspecrules
-- where coalesce(srcordestport,'') = coalesce(destinationport,'')
-- order by validto desc
SELECT DISTINCT
  admname,
  rulename,
  CASE
    WHEN protocol NOT IN ('tcp','udp','icmp')
      THEN 'other'
      ELSE protocol
    END AS protocol,
  fromdate,
  min(fromtime) minfromtime,
  todate,
  max(totime) maxtotime,
  srcprefix,
  destprefix,
  action,
  count(destport) portsaff,
  max(pktlength) maxpktlength,
  sum(duration) totduration,
  isactive,
  isexpired
FROM(
  SELECT
    flowspecruleid "ruleid",
    f.customerid "custid",
    rule_name "rulename",
    f.administratorid "adminid",
    a.name "admname",
    direction "direction",
    validfrom,
    validto,
    trim(to_char(validfrom, 'YYYY-MM-DD')) "fromdate",
    trim(to_char(validfrom, 'HH24:MI:SS')) "fromtime",
    trim(to_char(validto, 'YYYY-MM-DD')) "todate",
    trim(to_char(validto, 'HH24:MI:SS')) "totime",
    age(validto, validfrom) "duration",
    fastnetmoninstanceid "fnmid",
    isactivated "isactive",
    isexpired "isexpired",
    destinationprefix "destprefix",
    sourceprefix "srcprefix",
    ipprotocol "protocol",
    destinationport "destport",
    sourceport "srcport",
    packetlength "pktlength",
    action
  FROM flow.flowspecrules AS f
  RIGHT OUTER JOIN flow.administrators AS a
  ON f.administratorid = a.administratorid
  WHERE f.flowspecruleid IN
    ( SELECT
        t.flowspecruleid
      FROM flow.flowspecrules AS t
      WHERE coalesce(srcordestport,'') = coalesce(destinationport,'')
    )
  ) AS ff
  RIGHT OUTER JOIN flow.customers AS c
  ON c.customerid = ff.custid
  WHERE ruleid IS NOT NULL
  GROUP BY
    rulename,
    admname,
    protocol,
    fromdate,
    todate,
    srcprefix,
    destprefix,
    pktlength,
    isactive,
    isexpired,
    action
  ORDER BY fromdate DESC