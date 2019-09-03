# neat-maps
a node.js &amp; React.js web sample app for uploading specific csv files.


## run on docker via docker-compose

1. modify your GOOGLE API KEY(javascript Map API and geocoder API enabled) in `docker-compose.yml` env 
2. `$docker-compose up -d`

## development

1. `$yarn` or `$npm install`
2. copy `.env.example` to `.env` and modify env variables
3. `$yarn run dev:client`
4. `$yarn run dev:server`

## run test

`npm t`