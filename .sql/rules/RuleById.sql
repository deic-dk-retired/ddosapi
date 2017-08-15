select distinct
flowspecruleid "id",
f.customerid "custid",
rule_name "rname",
f.administratorid "adminid",
direction "direct",
validfrom,
validto,
age(validto, validfrom) "duration",
fastnetmoninstanceid "fmnId",
isactivated "isActive",
isexpired "isExpired",
destinationprefix "destprefix",
sourceprefix "srcprefix",
 CASE
WHEN ipprotocol NOT IN ('tcp','udp','icmp')
  THEN 'other'
  ELSE ipprotocol
END AS ipprotocol,
destinationport "destport",
sourceport "srcportt",
packetlength "pktlen",
action
FROM flow.flowspecrules AS f
where f.flowspecruleid in
(
  SELECT DISTINCT flowspecruleid
  FROM flow.flowspecrules AS x
  WHERE coalesce(srcordestport,'') = coalesce(destinationport,'')
)
and flowspecruleid = ${id}
order by validfrom desc