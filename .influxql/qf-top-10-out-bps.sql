/**
 * show top 10 ip address by incoming bps value
 */
select top(value,10) as y, time as x, cidr, resource
from graphite.autogen.hosts
where resource='bps'
and time < now() - 0m
and time > now() - 30m
and direction='outgoing'
order by time desc