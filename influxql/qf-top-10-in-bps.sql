select top(value,10) as y, time as x, cidr
from graphite.autogen.hosts
where resource='bps'
and time > now() - 5d
and time > now() - 4d
and direction='incoming'
order by time desc