#!/usr/bin/env bash

# run angular

# run APIs
node "./apis/front/front-api.js"

# run microservices
for ms in `ls services`
do
    node "./services/$ms/ms.js"
done
