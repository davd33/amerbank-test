#!/usr/bin/env bash

# run services tests
for ms in `ls services-test`
do
    echo "Testing $ms service"
    node "./services-test/$ms/test.js"
done

# run routes tests
for ms in `ls routes-test`
do
    echo "Testing $ms route"
    MS_API_URL='http://mock-api-url' node "./routes-test/$ms/test.js"
done
