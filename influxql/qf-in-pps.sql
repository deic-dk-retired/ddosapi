/**
 * total incoming pps in last 30m
 */
select sum(value) as "t_pps_in"
from graphite.autogen.total
where resource='pps'
and direction='incoming'
and time > now() - 30m
order by time desc