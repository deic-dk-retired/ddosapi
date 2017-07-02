/**
 * show sum of incoming bps values
 * in the last 30m
 */
select value as y, time as x
from graphite.autogen.total
where resource='bps'
and direction='incoming'
and time < now() - 0m
and time > now() - 30m
order by time desc