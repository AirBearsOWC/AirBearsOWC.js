```sh
git clone etc
# Install Gulp, Bower, and Nodemon if you haven't already
# (Nodemon restarts the Node server when a change is made)
npm install -g nodemon
npm install -g gulp
npm install -g bower
npm install
bower install
gulp build
# Start MySQL somehow, then
# Migrate and seed
node ./db/_migrate
node ./db/_seed
# Start Nodemon
nodemon
```
