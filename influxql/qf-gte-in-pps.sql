/**
 * show incoming pps values greater than 1mb
 */
select time, value from
(select value
 from graphite.autogen.hosts
 where resource='pps'
 and direction='incoming'
 and time > now() - 10d
 and time < now() - 9d
 order by time desc
 )
where value >= 1000