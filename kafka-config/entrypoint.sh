#!/bin/sh
/kafka-config/create-topics.sh &
exec /etc/confluent/docker/run