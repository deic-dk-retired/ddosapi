select distinct *
from flow.flowspecrules
where coalesce(srcordestport,'') = coalesce(destinationport,'')
and flowspecruleid = ${id}
order by validto desc
