cd /home/ubuntu/my_site_api_express
source /etc/environment
echo CONFIG:
echo ENV: $NODE_ENV
echo HOST: $DBHOST
echo DATABASE: $DB
echo USER: $DBUSER
echo -------------------
sudo -u ubuntu ./node_modules/sequelize-cli/lib/sequelize db:migrate
