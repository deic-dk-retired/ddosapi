#!/bin/sh
#

# variables to use
USERNAME=hansolo
PM2DEPL='/opt/deploy-ddosapi'
DDOSAPI='/opt/ddosapi'
ME=`basename $0`

# log in as root for running this script
case `whoami` in
  root) :
        ;;
  *)  echo please run $0 as root
      exit 0
      ;;
esac

# create user hansolo without a home dir
getent passwd ${USERNAME} > /dev/null 2>&1  >/dev/null || adduser --home /dev/null --no-create-home --shell /sbin/nologin --gecos "DDPS node admin" --ingroup staff --disabled-password ${USERNAME}

# create dir to store deploy scripts "ecosystem.json"
test -d ${PM2DEPL} || mkdir -p ${PM2DEPL}
chown -R hansolo:staff ${PM2DEPL}

# create directory ${DDOSAPI} and copy files etc.
# this is where api will install and run into prod, dev or staging folders
test -d ${DDOSAPI} || mkdir -p ${DDOSAPI}
chown -R hansolo:staff ${DDOSAPI}

# install pre-requisite node.js using a PPA
curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh

# verify download
md5sum -c nodesource_setup.sh.md5 >/dev/null 2>&1 || {
    echo "md5sum for nodesource_setup.sh changed, please review nodesource_setup.sh"
    echo "update check sum with"
    echo "md5sum nodesource_setup.sh  > nodesource_setup.sh.md5"
}

# see https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04
bash nodesource_setup.sh
apt-get -y install nodejs build-essential

# clone pm2 deploy scripts in tmp
# from https://gist.github.com/ashokaditya/a2132e9f8103f8df1b4fb9dc55af6428
# move ecosystem.json to /opt/deploy-ddos
git clone https://gist.github.com/a2132e9f8103f8df1b4fb9dc55af6428.git
mv a2132e9f8103f8df1b4fb9dc55af6428 eco
rm -rf ${PM2DEPL}/*
mv eco/* ${PM2DEPL}
rm -rf eco
cd ${PM2DEPL}
# git init

# run with service manager pm2
npm install pm2@latest -g
# PM2_INST=`pm2 startup 2>&1 | tail -1 | sed 's/^\$//'`
# echo ${PM2_INST}
## sudo env PATH=$PATH:/usr/local/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u rnd --hp /dev/null/

# run services using pm2 deploy
# pwd
pm2 deploy ecosystem.json production setup
pm2 deploy ecosystem.json production
# generate startup script
PM2_INST=`pm2 startup 2>&1 | tail -1 | sed 's/^\$//'`
# execute startup script for os
${PM2_INST}
# save processes to resurrect
pm2 save