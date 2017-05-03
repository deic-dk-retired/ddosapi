select time as x, value::float as y, resource as type
from graphite.autogen.hosts
where direction = 'incoming'
group by resource
order by time desc