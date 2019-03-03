cd /home/ec2-user/api
source /etc/environment
sudo -u ec2-user forever -l forever.log -o forever_out.log -e forever_error.log start app.js