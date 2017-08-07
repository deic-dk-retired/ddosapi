/**
 * show top hosts incoming bits/sec values
 * in the last 30m
 */
SELECT mean as y, time as x
from
(SELECT mean(value)
FROM graphite.autogen.hosts
WHERE direction = 'incoming'
AND resource = 'bps'
AND time < now() - 0m
AND time > now() - 30m
GROUP BY time(5s),
cidr fill(previous)
)