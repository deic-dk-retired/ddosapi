select top(value,${num}) as y, time as x, cidr
from graphite.autogen.hosts
where resource='bps'
and time > now() - ${tfrom}
and time < now() - ${tuntil}
and direction='incoming'
order by time desc