#!/bin/bash

# Start MySQL service
service mysql start

# Run additional commands to configure MySQL using environment variables
mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};"
mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'localhost' IDENTIFIED BY '${MYSQL_PASSWORD}';"
mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'localhost';"
mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "FLUSH PRIVILEGES;"

# Keep the container running
tail -f /dev/null
