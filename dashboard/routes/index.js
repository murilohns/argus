var express = require('express');
var router = express.Router();
var axios = require('axios');

const apiUrl = process.env.API_URL;

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', async function(req, res, next) {
  const { username, password } = req.body;

  let request = await axios.post(`${apiUrl}/supporters/login`, {
    user: username,
    password: password
  }).then( res => res.data );

  res.cookie('user', request._id);
  res.send('ok');
});

router.get('/login', function(req, res, next) {
  const loggedUser = req.cookies.user || null;
  res.send(loggedUser);
});

router.post('/issue/assign', async function(req, res, next) {
  const { id: issueId } = req.body;

  const loggedUser = req.cookies.user || null;

  if( loggedUser ) {
    let response = await axios.put(`${apiUrl}/issues/${issueId}/assign`, {
      supporter: loggedUser
    });

    res.json(response.data);
    return;
  }

  res.send('Not logged in');
});

module.exports = router;
