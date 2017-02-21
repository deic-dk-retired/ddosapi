select resource, value::float
from graphite.autogen.${msr}
where direction = 'incoming'
and resource = '\''+${tag}+'\''
group by resource
order by time desc