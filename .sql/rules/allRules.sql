select r.* from
(SELECT distinct
f.flowspecruleid "id",
f.uuid_flowspecruleid "ruleuuid",
f.uuid_customerid "couuid",
f.uuid_administratorid "useruuid",
f.uuid_fastnetmoninstanceid "fmnuuid",
rule_name "rname",
direction "direct",
validfrom,
validto,
age(validto, validfrom) "duration",
isactivated "isactive",
isexpired "isexpired",
destinationprefix "destprefix",
sourceprefix "srcprefix",
 CASE
WHEN ipprotocol NOT IN ('tcp','udp','icmp')
  THEN 'other'
  ELSE ipprotocol
END AS ipprotocol,
icmpcode,
icmptype,
tcpflags,
destinationport "destport",
sourceport "srcport",
packetlength "pktlen",
fragmentencoding "fragenc",
description,
action
FROM flow.flowspecrules AS f
where f.flowspecruleid in
(
  SELECT DISTINCT flowspecruleid
  FROM flow.flowspecrules AS x
  WHERE coalesce(srcordestport,'') = coalesce(destinationport,'')
  AND isactivated = TRUE
  AND isexpired = FALSE
)
order by validfrom desc
limit ${rows}) r

UNION

select s.* from
(SELECT distinct
f.flowspecruleid "id",
f.uuid_flowspecruleid "ruleuuid",
f.uuid_customerid "couuid",
f.uuid_administratorid "useruuid",
f.uuid_fastnetmoninstanceid "fmnuuid",
rule_name "rname",
direction "direct",
validfrom,
validto,
age(validto, validfrom) "duration",
isactivated "isactive",
isexpired "isexpired",
destinationprefix "destprefix",
sourceprefix "srcprefix",
 CASE
WHEN ipprotocol NOT IN ('tcp','udp','icmp')
  THEN 'other'
  ELSE ipprotocol
END AS ipprotocol,
icmpcode,
icmptype,
tcpflags,
destinationport "destport",
sourceport "srcportt",
packetlength "pktlen",
fragmentencoding "fragenc",
description,
action
FROM flow.flowspecrules AS f
where f.flowspecruleid in
(
  SELECT DISTINCT flowspecruleid
  FROM flow.flowspecrules AS x
  WHERE coalesce(srcordestport,'') = coalesce(destinationport,'')
  AND isactivated = FALSE
  AND isexpired = TRUE
)
order by validfrom desc
offset ${next}
limit ${rows}) s
order by validfrom desc


-- limit ${rows};
-- SELECT DISTINCT
--   row_number() over (ORDER BY fromdate DESC nulls last) as id,
--   admname,
--   rulename,
--   CASE
--     WHEN protocol NOT IN ('tcp','udp','icmp')
--       THEN 'other'
--       ELSE protocol
--     END AS protocol,
--   DATE (fromdate) fromdate,
--   min(fromtime) minfromtime,
--   DATE(todate) todate,
--   max(totime) maxtotime,
--   srcprefix,
--   destprefix,
--   action,
--   count(destport) portsaff,
--   max(pktlength) maxpktlength,
--   sum(duration) duration,
--   isactive,
--   isexpired
-- FROM(
--   SELECT
--     flowspecruleid "ruleid",
--     f.customerid "custid",
--     rule_name "rulename",
--     f.administratorid "adminid",
--     a.name "admname",
--     direction "direction",
--     validfrom,
--     validto,
--     trim(to_char(validfrom, 'YYYY-MM-DD')) "fromdate",
--     trim(to_char(validfrom, 'HH24:MI:SS')) "fromtime",
--     trim(to_char(validto, 'YYYY-MM-DD')) "todate",
--     trim(to_char(validto, 'HH24:MI:SS')) "totime",
--     age(validto, validfrom) "duration",
--     fastnetmoninstanceid "fnmid",
--     isactivated "isactive",
--     isexpired "isexpired",
--     destinationprefix "destprefix",
--     sourceprefix "srcprefix",
--     ipprotocol "protocol",
--     destinationport "destport",
--     sourceport "srcport",
--     packetlength "pktlength",
--     action
--   FROM flow.flowspecrules AS f
--   RIGHT OUTER JOIN flow.administrators AS a
--   ON f.administratorid = a.administratorid
--   WHERE f.flowspecruleid IN
--     ( SELECT
--         t.flowspecruleid
--       FROM flow.flowspecrules AS t
--       WHERE coalesce(srcordestport,'') = coalesce(destinationport,'')
--     )
--   ) AS ff
--   RIGHT OUTER JOIN flow.customers AS c
--   ON c.customerid = ff.custid
--   WHERE ruleid IS NOT NULL
--   GROUP BY
--     rulename,
--     admname,
--     protocol,
--     fromdate,
--     todate,
--     srcprefix,
--     destprefix,
--     pktlength,
--     isactive,
--     isexpired,
--     action
--   ORDER BY fromdate DESC;