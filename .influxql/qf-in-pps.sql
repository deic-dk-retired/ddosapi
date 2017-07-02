/**
 * total incoming pps in last 30m
 */
select value as y, time as x
from graphite.autogen.total
where resource='pps'
and direction='incoming'
and time < now() - 0m
and time > now() - 30m
order by time desc