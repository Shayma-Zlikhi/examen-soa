#!/bin/bash
sleep 30 # Wait for Kafka to be ready
kafka-topics --bootstrap-server kafka:9092 --create --topic client-creations --partitions 1 --replication-factor 1
kafka-topics --bootstrap-server kafka:9092 --create --topic client-updates --partitions 1 --replication-factor 1
kafka-topics --bootstrap-server kafka:9092 --create --topic client-deletions --partitions 1 --replication-factor 1