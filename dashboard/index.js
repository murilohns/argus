const path = require('path');
const express = require('express');
const argus = require('@argus-dashboard/server');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const githubExtension = require('@argus-dashboard/github-extension/routes');
const routes = require('./routes');

let app = express();
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

argus.routes.add('github-extension', githubExtension);
argus.server(app, { port: process.env.PORT || 3000 });
