
# create mysql by docker
docker search mysql
docker pull mysql
docker network create my_master_slave_mysql
docker run -d --name mysql-master --network my_master_slave_mysql -p 8811:3306 -e MYSQL_ROOT_PASSWORD=ngoctruong mysql
docker run -d --name mysql-slave --network my_master_slave_mysql -p 8822:3306 -e MYSQL_ROOT_PASSWORD=ngoctruong mysql
docker ps -a


// Config mysql local
mkdir mysql
cd mysql
mkdir master
mkdir slave
docker cp b9ea766a3986:/etc/my.cnf ./mysql/slave/
docker cp b9ea766a3987:/etc/my.cnf ./mysql/master/

nano mysql/slave/my.cnf
log_bin=mysql-bin
server_id=1

nano mysql/master/my.cnf
log_bin=mysql-bin
server_id=2

docker cp ./mysql/master/my.cnf 29b177e969da:/etc
docker cp ./mysql/slave/my.cnf b9ea766a3986:/etc
docker start mysql-slave
docker start mysql-master

docker inspect c621608a6042 -> get ip in network

# config trong mysql
docker exec -it mysql-master bash
mysql -uroot -p
show master status; -> file, position

docker exec -it mysql-slave bash
mysql -uroot -p

CHANGE MASTER TO
MASTER_HOST='172.19.0.2', // get từ docker inspect c621608a6042
MASTER_PORT=3306,
MASTER_USER='root',
MASTER_PASSWORD='ngoctruong',
MASTER_LOG_FILE='binlog.000002',
MASTER_LOG_POS=157,
MASTER_CONNECT_RETRY=60,
GET_MASTER_PUBLIC_KEY=1;

start slave;
show slave status\G;
start replica;
show replica status\G;
