/**
 * show sum of incoming bps values in the last 30m
 */
select sum(value) as "t_bps_in"
from graphite.autogen.total
where resource='bps'
and direction='incoming'
and time > now() - 30m
order by time desc