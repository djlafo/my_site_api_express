cd /home/ec2-user/api
echo CONFIG:
echo HOST: $DBHOST
echo DATABASE: $DB
echo USER: $DBUSER
echo -------------------
./node_modules/sequelize-cli/lib/sequelize db:migrate