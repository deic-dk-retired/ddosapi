/**
* show top hosts incoming bits/sec values
* in the last 30m
*/
SELECT
  mean as y,
  time as x
from
(SELECT mean(value)
FROM networks
WHERE direction = 'incoming'
AND resource = 'bps'
AND cidr = '130_226_136_240_28'
AND time > now() - 30m
GROUP BY time(5s)
fill(previous)
)