/**
 * show all pps, bps, incoming and outgoing values
 * grouped by pps, bps, flows
 */
select time, cidr, direction, value, resource
from graphite.autogen.hosts
where time < now() - 19d
and time > now() - 20d
group by resource
order by time desc