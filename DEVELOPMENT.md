# Development

Here is a guide of how to set up the development environment in OpenSupports.

## Requirements
* PHP 5.6+
* MySQL 4.1+

### Getting up and running FRONT-END (client folder)
1. Update: `sudo apt update`
2. Clone this repo: `git clone https://github.com/opensupports/opensupports.git`
3. Install `nvm`: https://github.com/nvm-sh/nvm
4. Use Node.js 24 or newer: `nvm install 24` followed by `nvm use 24`
5. Go to client: `cd opensupports/client`
6. Install dependencies: `npm install`
7. Run: `npm start` (PHP server api it must be running at :8080)
10. Go to the main app: `http://localhost:3002/app`
11. Your browser will automatically be opened and directed to the browser-sync proxy address.
12. Use `npm start-fixtures` to enable fixtures and not require php server to be running.

OpenSupport uses `3002` by default for the webpack dev server so it does not collide with common local tools already using `3000` or `3001`. If you need a different port, set `OS_DEV_SERVER_PORT` in `client/.env`.

You can also create `client/.env` to point the frontend to another endpoint without editing source files. The build/dev server reads these variables automatically:

- `OS_API_ROOT=https://remote.example.com/api` makes the frontend call that remote API directly.
- `OS_API_ROOT=/api` together with `OS_DEV_PROXY_TARGET=https://remote.example.com/api` keeps the browser on the local frontend and proxies API calls to a remote backend, which is useful to avoid CORS problems during development.
- `OS_CLIENT_ROOT`, `OS_GLOBAL_INDEX_PATH`, `OS_SHOW_LOGS`, `OS_DEV_SERVER_HOST`, and `OS_DEV_SERVER_PORT` are also available. See `client/.env.example` for a complete example.

##### Production Task

Just as there is a task for development, there is also a `npm build` task for putting the project into a production-ready state. This will run each of the tasks, while also adding the image minification task discussed above and the result store in `dist/` folder.

**Reminder:** Notice there is `index.html` and `index.php`. The first one searches the backend server where `config.js` says it, the second one uses `/api` to find the server. If you want to run OpenSupports in a single server, then use `index.php`.

#### Frontend Unit Testing
1. Do the steps described before.
2. Install mocha: `npm install -g mocha@6.2.0`
3. Run `npm test` to run the tests.

### Getting up and running BACK-END (server folder)
1. Install [Docker CE](https://docs.docker.com/install/)
2. Go to the server folder: `cd opensupports/server`
3. Run `make build` to build the images
4. Run `make install` to install composer dependencies

- `make run` runs the backend and database
- `make stop` stop backend and database server
- `make log` show live server logs
- `make db` access to mysql database console
- `make sh` access to backend docker container bash
- `make test` run phpunit tests
- `make doc` to build the documentation (requires `apidoc`)

Server api runs on `http://localhost:8080/`
Also, there's a *phpmyadmin* instance running on `http://localhost:6060/`,
you can access with the username `root` and empty password

##### Building
Once you've installed dependencies for frontend and backend, you can run `./build.sh` and it will generate a zip file inside `dist/` ready for distribution. You can use this file to install OpenSupports on a serving following the [installation instructions](https://github.com/opensupports/opensupports/wiki/Installation)

##### BACKEND API RUBY TESTING

1. Go to tests folder: `cd opensupports/tests`
2. Run `make build` to install ruby container and its required dependencies

- `make run` for running tests (database will be cleared)
- `make clear` for clearing database

##### BACKEND FAKE SMTP SERVER
If you're doing development, you can use a FakeSMTP server to see the mails that are being sent.

1. Install Java if you don't have it yet:

     `sudo apt-get install default-jre`
     `sudo apt-get install default-jdk`

2. [Download FakeSMTP](https://nilhcem.github.io/FakeSMTP/download.html)

3. Extract the file from the zip and run it:

    `java -jar fakeSMTP-2.0.jar`

4. Set the port to 7070 and start the SMTP server.

5. Every time the application sends an email, it will be reflected there.
