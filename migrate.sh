cd /home/ec2-user/api
source /etc/environment
echo CONFIG:
echo ENV: $NODE_ENV
echo HOST: $DBHOST
echo DATABASE: $DB
echo USER: $DBUSER
echo -------------------
./node_modules/sequelize-cli/lib/sequelize db:migrate --env=production --url "User ID=$DBUSER;Password=$DBPASS;Host=$DBHOST;Port=$DBPORT;Database=$DB;"