select * from
(SELECT distinct count (*) as total
FROM flow.flowspecrules AS f
where f.flowspecruleid in
(
  SELECT DISTINCT flowspecruleid
  FROM flow.flowspecrules AS x
  WHERE coalesce(srcordestport,'') = coalesce(destinationport,'')
)
and uuid_administratorid = $(userid)) tot,

(SELECT distinct count (*) as active
FROM flow.flowspecrules AS f
where f.flowspecruleid in
(
  SELECT DISTINCT flowspecruleid
  FROM flow.flowspecrules AS x
  WHERE coalesce(srcordestport,'') = coalesce(destinationport,'')
  AND isactivated = TRUE
  AND isexpired = FALSE
)
and uuid_administratorid = $(userid)) a,

(SELECT distinct count (*) as expired
FROM flow.flowspecrules AS f
where f.flowspecruleid in
(
  SELECT DISTINCT flowspecruleid
  FROM flow.flowspecrules AS x
  WHERE coalesce(srcordestport,'') = coalesce(destinationport,'')
  AND isactivated = FALSE
  AND isexpired = TRUE
)
and uuid_administratorid = $(userid)
) e,

(SELECT distinct count (*) as tcp
FROM flow.flowspecrules AS f
where f.flowspecruleid in
(
  SELECT DISTINCT flowspecruleid
  FROM flow.flowspecrules AS x
  WHERE coalesce(srcordestport,'') = coalesce(destinationport,'')
  AND ipprotocol = 'tcp'
)
and uuid_administratorid = $(userid)
) t,

(SELECT distinct count (*) as icmp
FROM flow.flowspecrules AS f
where f.flowspecruleid in
(
  SELECT DISTINCT flowspecruleid
  FROM flow.flowspecrules AS x
  WHERE coalesce(srcordestport,'') = coalesce(destinationport,'')
  AND ipprotocol = 'icmp'
)
and uuid_administratorid = $(userid)
) i,

(SELECT distinct count (*) as udp
FROM flow.flowspecrules AS f
where f.flowspecruleid in
(
  SELECT DISTINCT flowspecruleid
  FROM flow.flowspecrules AS x
  WHERE coalesce(srcordestport,'') = coalesce(destinationport,'')
  AND ipprotocol = 'udp'
)
and uuid_administratorid = $(userid)
) u,

(SELECT distinct count (*) as other
FROM flow.flowspecrules AS f
where f.flowspecruleid in
(
  SELECT DISTINCT flowspecruleid
  FROM flow.flowspecrules AS x
  WHERE coalesce(srcordestport,'') = coalesce(destinationport,'')
  AND ipprotocol not in ('tcp', 'udp', 'icmp')
)
and uuid_administratorid = $(userid)
) o,

(SELECT count(distinct destinationprefix) as networks
FROM flow.flowspecrules AS f
where f.flowspecruleid in
(
  SELECT DISTINCT flowspecruleid
  FROM flow.flowspecrules AS x
  WHERE coalesce(srcordestport,'') = coalesce(destinationport,'')
)
and uuid_administratorid = $(userid)
) n,

(SELECT count(destinationprefix) as totnet
FROM flow.flowspecrules AS f
where f.flowspecruleid in
(
  SELECT DISTINCT flowspecruleid
  FROM flow.flowspecrules AS x
  WHERE coalesce(srcordestport,'') = coalesce(destinationport,'')
)
and uuid_administratorid = $(userid)
) tn;