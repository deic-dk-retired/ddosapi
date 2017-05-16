/**
 * show max incoming values grouped by pps, bps or flows
 */
select max(value) as y, time as x
from graphite.autogen.hosts
where direction = 'incoming'
and time > now() - 1h
and time < now() - 30m
group by resource, time(20s)
order by time desc