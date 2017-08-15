select top(value,${num}) as y, time as x, cidr
from graphite.autogen.hosts
where resource='bps'
and time < now() - 0
and time > now() - 30m
and direction='incoming'
order by time desc