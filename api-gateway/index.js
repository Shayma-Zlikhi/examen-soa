const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const { graphql } = require('graphql');
const proxy = require('express-http-proxy');

const app = express();


app.use('/api', proxy('http://client-service:3001'));


app.use('/graphql', proxy('http://reporting-service:4000'));


app.get('/', (req, res) => {
  res.send(`
    <h1>API Gateway</h1>
    <ul>
      <li><a href="/api/clients">API REST Clients</a></li>
      <li><a href="/graphql">API GraphQL Reporting</a></li>
    </ul>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API Gateway écoutant sur le port ${PORT}`);
});