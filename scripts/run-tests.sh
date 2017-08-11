#!/usr/bin/env bash

# run services tests
for ms in `ls services-test`
do
    echo "Testing $ms service"
    node "./services-test/$ms/test.js"
done
