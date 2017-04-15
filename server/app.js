const express = require('express');
const fs = require('fs');
const path = require('path');

function createApp() {
  const template = fs.readFileSync(path.join(__dirname, 'template.html')).toString();
  const app = express();

  app.get('/*', (req, res) => {
    const isLoggedIn = false;
    let t = '';

    if (!isLoggedIn) {
      const templateName = process.env.NODE_ENV == 'production' ? '/static/loggedout.bundle.js' : 'http://localhost:8080/loggedout.bundle.js';
      t = template.replace('[BUNDLE]', templateName);
    } else {
      const templateName = process.env.NODE_ENV == 'production' ? '/static/loggedin.bundle.js' : 'http://localhost:8080/loggedin.bundle.js';
      t = template.replace('[BUNDLE]', templateName);
    }

    res.set('content-type', 'text/html');
    res.send(t);
  });
  app.get('/api/users', (req, res) => {
    const users = [{name:'Andri Mar Björgvinsson',username:'andri'},{name:'Jón jónsson',username:'joi'}];
    res.json(users);
  });

  return app;
}

module.exports = createApp;
