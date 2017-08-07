/**
 * total mean traffic in last 30m
 */
select value as y, time as x, direction
from graphite.autogen.total
where resource='bps'
and direction = 'incoming'
and time < now() - 0m
and time > now() - 30m
order by time desc