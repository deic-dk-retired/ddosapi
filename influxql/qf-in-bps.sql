/**
 * show sum of incoming bps values
 * in the last 30m
 */
select y, time as x
from
(
select sum(value) as y
from graphite.autogen.total
where resource='bps'
and direction='incoming'
and time < now() - 0m
and time > now() - 30m
order by time desc
)