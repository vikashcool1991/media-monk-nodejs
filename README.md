# media-monk-nodejs

### Prerequisites

* install latest nodejs
* install redis 
* install mongodb
* run npm i -g pm2 nodemon jest // to install pm2, nodemon, jest globally

### setup

* clone this repo and run below commands inside cloned repo.
* `npm install`
* `npm run dev` // to run in non-cluster mode
* OR `pm2 start ecosystem.config.js`  // to run in cluster mode
* Server will start at `http://localhost:3000`
* send message to websocket server in format `key=value`
* send GET api request at `http://localhost:3000/api/v1/key/{somekey}`

### Load test

* run `artillery run load-test/http-script.yml --output test.json` to start load testing
* run `node load-test/script.js` to generate sample csv file with key-value pairs
* update variable `TOTAL_KEY_VALUE_PAIR_CSV` in `load-test/.env` to generate more sample csv key-value records

### unit test

* run `npm run test`
