#!/usr/bin/with-contenv bashio

openssl genpkey -algorithm RSA -aes-256-cbc -outform PEM -out private_key.pem -pkeyopt rsa_keygen_bits:2048
ssh-keygen -e -f private_key.pem > public_key.pem
