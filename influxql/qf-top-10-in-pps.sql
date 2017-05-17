/**
 * show top 10 ip address by incoming pps value
 */
select top(value,10) as y, time as x, cidr
from graphite.autogen.hosts
where resource='pps'
and time < now() - 30m
and time > now() - 1h
and direction='incoming'
order by time desc