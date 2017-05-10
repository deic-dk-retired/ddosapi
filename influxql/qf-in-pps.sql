select sum(value)
from graphite.autogen.total
where resource='pps'
and direction='incoming'
and time > now() - 6h
order by time desc