select max(value::float)
from graphite.autogen.hosts
where direction = 'incoming'
and time > now() - 1w
group by resource, time(1d)
order by time desc