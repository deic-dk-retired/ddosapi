/**
 * incoming pps values >= 1mb (10^6 bytes)
 * in the last 30m
 */
select time as x, value as y, resource
from graphite.autogen.total
where resource='pps'
and value >= 1000000
and direction='incoming'
and time < now() - 30m
and time > now() - 1h
order by time desc