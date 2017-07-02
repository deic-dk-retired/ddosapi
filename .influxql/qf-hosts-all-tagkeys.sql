/**
 * show all pps, bps, incoming and outgoing values
 * in the last 30m
 * grouped by pps, bps, flows
 */
select time, cidr, direction, value, resource
from graphite.autogen.hosts
where time < now() - 30m
and time > now() - 1h
group by resource
order by time desc