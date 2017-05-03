select time, cidr, direction, value, resource
from graphite.autogen.hosts
where time > now() - 1d
group by resource
order by time desc