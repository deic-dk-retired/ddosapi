select max(value::float) as y, time as x
from graphite.autogen.hosts
where direction = 'incoming'
and time > now() - 12h
group by resource, time(1d)
order by time desc