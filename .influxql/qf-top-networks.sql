/**
 * show top networks incoming packets/sec values
 * in the last 30m
 */
SELECT
  mean as y,
  time as x
from
(SELECT mean(value)
FROM graphite.autogen.networks
WHERE resource = 'pps'
and direction = 'incoming'
AND time < now() - 0m
AND time > now() - 30m
GROUP BY time(5s),
cidr fill(previous)
)
