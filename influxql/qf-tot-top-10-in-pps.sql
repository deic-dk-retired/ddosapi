select top(value,10) as y, time as x
from graphite.autogen.networks
where resource='pps'
and direction='incoming'
and time > now() - 5w
group by time(1d)
order by time desc