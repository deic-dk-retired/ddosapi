select
id,
tcpflag->>'flag' as "flag",
tcpflag->>'description' as "desc"
from flow.tcpflags
order by id desc