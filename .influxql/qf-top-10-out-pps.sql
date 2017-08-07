/**
 * show top 10 ip addresses by incoming pps value
 * in the last 30m
 */
select top(value,10) as y, time as x, cidr, resource
from graphite.autogen.hosts
where resource='pps'
and time < now() - 0m
and time > now() - 30m
and direction='outgoing'
order by time desc