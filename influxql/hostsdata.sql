select resource, value::float
from graphite.autogen.hosts
where direction = 'incoming'
group by resource
order by time desc