/**
 * show incoming pps values greater than 1mb
 */
select value as y, time as x, resource
from graphite.autogen.hosts
where resource='pps'
and direction='incoming'
and value >= 1000000
and time < now() - 0m
and time > now() - 30m
order by time desc
