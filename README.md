# media-monk-nodejs

## Prerequisites
* install latest nodejs
* install redis 
* install mongodb
* run npm i -g pm2 nodemon jest // to install pm2, nodemon, jest globally

## setup
* clone this repo and run below commands inside cloned repo.
* `npm install`
* `npm run dev` // to run in non-cluster mode
* OR `pm2 start ecosystem.config.js`  // to run in cluster mode

### Load test
run `artillery run load-test/http-script.yml --output test.json` to start load testing

### unit test
run `npm run test`
