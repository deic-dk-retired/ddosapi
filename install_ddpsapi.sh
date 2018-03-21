#!/bin/sh
#

USERNAME=hansolo
INSTDIR='/opt/ddpsapi/'
ME=`basename $0`

case `whoami` in
    root)   :
        ;;
    *)      echo please run $0 as root
            exit 0
        ;;
esac

# create hansolo user
getent passwd ${USERNAME} > /dev/null 2>&1  >/dev/null || adduser --home /dev/null --no-create-home --shell /sbin/nologin --gecos "DDPS node admin" --ingroup staff --disabled-password ${USERNAME}

# create directory ${INSTDIR} and copy files etc.
test -d ${INSTDIR} || mkdir -p ${INSTDIR}
/bin/cp -r . ${INSTDIR}  && /bin/rm -f ${INSTDIR}/${ME}
chown -R hansolo:staff ${INSTDIR}

# install pre-requisite node.js using a PPA
curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh

md5sum -c nodesource_setup.sh.md5 >/dev/null 2>&1 || {
    echo "md5sum for nodesource_setup.sh changed, please review nodesource_setup.sh"
    echo "update check sum with"
    echo "md5sum nodesource_setup.sh  > nodesource_setup.sh.md5"
}

# see https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04
bash nodesource_setup.sh
apt-get -y install nodejs build-essential

# install dependencies
cd ${INSTDIR}
npm install
cd /

# run with service manager pm2
npm install pm2@latest -g
PM2_INST=`pm2 startup 2>&1 | tail -1`
${PM2_INST}
# run services
pm2 start ${INSTDIR}/bin/server.js -i max --name "ddosapi"
# save for resurrection
pm2 save

