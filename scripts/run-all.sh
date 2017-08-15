#!/usr/bin/env bash

# kill all existing processes of the app
echo 'Kill old processes'
for p in `ps aux | grep -v grep | grep amerbank-test | sed 's/[^ ]\+ \+\([0-9]\+\) .*/\1/'`
do kill "$p" ; done

LOG_DIR='logs'
APP_NAME='amerbank-test'

mkdir -p "$LOG_DIR"

# run microservices
for ms in `ls services`
do
    echo "Starting $ms service"
    node "./services/$ms/ms.js" "$APP_NAME" > "$LOG_DIR/$ms" 2>&1 &
done
sleep 5

# export env vars
export MS_API_URL=`cat logs/gate | grep 'Server started on:' | sed 's/.*started on: \(.*\)",.*/\1/'`

# run APIs
echo "Starting front API"
node "./apis/front/front-api.js" "$APP_NAME" > "$LOG_DIR/front-api" 2>&1 &
sleep 5

# processes running
echo "Processes running:"
ps aux | grep -v grep | grep "$APP_NAME"

# cat logs
echo "Current logs:"
for f in `ls logs`
do
    echo "----$f----"
    cat "./logs/$f"
    echo "------------------"
done
