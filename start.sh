cd /home/ubuntu/my_site_api_express
source /etc/environment
[ -e forever.log ] && rm forever_out.log
[ -e forever_out.log ] && rm forever_out.log
[ -e forever_error.log ] && rm forever_error.log
sudo forever -a -l forever.log -o forever_out.log -e forever_error.log start app.js
