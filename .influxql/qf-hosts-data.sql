/**
 * show values for incoming resources (bps, pps, flows)
 */
select time as x, value as y
from graphite.autogen.hosts
where direction = 'incoming'
group by resource
order by time desc