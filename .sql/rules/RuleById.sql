SELECT distinct
f.flowspecruleid "id",
f.uuid_flowspecruleid "ruleuuid",
f.uuid_customerid "couuid",
f.uuid_administratorid "userid",
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
)
and flowspecruleid = ${id}