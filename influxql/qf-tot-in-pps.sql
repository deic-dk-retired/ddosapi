/**
 * incoming pps values >= 1mb in the last 30m
 */
select time as x, value as y from
(select value
  from graphite.autogen.total
  where resource='pps'
   and direction='incoming'
   and time < now() - 30m
   and time > now() - 1h
   order by time desc
) where value >= 1000