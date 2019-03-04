cd /home/ec2-user/api
source /etc/environment
[ -e forever.log ] && rm forever_out.log
[ -e forever_out.log ] && rm forever_out.log
[ -e forever_error.log ] && rm forever_error.log
sudo -u ec2-user forever -a -l forever.log -o forever_out.log -e forever_error.log start app.js