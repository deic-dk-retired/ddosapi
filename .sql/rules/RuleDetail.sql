select distinct
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
where ipprotocol = ${prot}
and destinationprefix = ${dest}
and action = ${action}
and isexpired = ${isexp}
and isactivated = ${isact}
and trim(to_char(validfrom, 'YYYY-MM-DD')) = ${vfrom}
and trim(to_char(validto, 'YYYY-MM-DD')) = ${vto}