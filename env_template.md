### Create a .env file in the cloned repo
## Should be created before running the client app

+ SU_SEC=secret phrase that would be encoded to the next field
+ SU_SEC_3SHA512=hashed SU_SEC
+ SU_ISSUER=name of token issuer. (DeiC)
+ RU_HOST=host ip that serves ddosapi (localhost)
+ RU_SERVER_PORT= default port to run on (9696 for dev, 9090 for prod, 9393 for staging)
+ RU_NAMESPACE=apis namespace (ddosapi)
+ RU_DBC=db name (postgres)
+ RU_DB_VER=db version (9.5)
+ RU_SCHEMA=db schema
+ RU_USER=schema user
+ RU_PWD=password
+ IF_HOST=influxdb host (should be removed since it depends on logged in user)
+ IF_HOST_PORT= influx db port that serves the webapi and json (usually 8086 in the new version)
+ IF_SCHEMA=influx db schema if all the influxdbs have the same schema (should be removed since it depends on logged in user)
+ NODE_ENV=development (or production or staging)


+ The file is in plain text and should be named .env and not checked into git. 
+ .gitignore should include all .files to be excluded from git commits.
