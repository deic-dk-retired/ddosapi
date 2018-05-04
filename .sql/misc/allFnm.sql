select
  uuid_fastnetmoninstanceid "id",
  fastnetmon_instanceid "fnmid",
  customerid "coid",
  uuid_customerid "couuid",
  networks_list "netList",
  hostname,
  process_incoming_traffic "procInTraffic",
  process_outgoing_traffic "procOutTraffic",
  status
from flow.fastnetmoninstances;