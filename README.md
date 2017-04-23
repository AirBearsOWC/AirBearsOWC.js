# Installation

```sh
# Install Gulp, Bower, and Nodemon if you haven't already, then
# (Nodemon restarts the Node server when a change is made)
npm install -g nodemon
npm install -g gulp
npm install -g bower
npm install
bower install
gulp build
# Create env.json (see sample.env.json), then
# Start Postgresql, then
# Migrate and seed
node ./db/_migrate
node ./db/_seed
# Start Nodemon
nodemon
```

# TODO

- Hook up front-end JS and forms to back-end routes and ensure parameters are passed properly
- Specify which fields should be visible to which roles
- Create an interface for admins to update notes and indicate when a t-shirt was sent
- Allow admins to delete users
- Allow admins to search for users who have not yet had a t-shirt sent
- Display mailing addresses as mailing labels
- Reset password
- Tidy up the codebase
