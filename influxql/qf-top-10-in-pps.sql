select top(value,10) as y, time as x, cidr
from graphite.autogen.hosts
where resource='pps'
and time > now() - 12h
and direction='incoming'
order by time desc