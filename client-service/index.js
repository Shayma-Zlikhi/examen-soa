const express = require('express');
const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());


const kafka = new Kafka({
  clientId: 'client-service',
  brokers: ['kafka:9092']
});

const producer = kafka.producer();


const clients = {};

app.use(async (req, res, next) => {
  await producer.connect();
  next();
});


app.post('/clients', async (req, res) => {
  const id = uuidv4();
  const client = { id, ...req.body, dateInscription: new Date().toISOString() };
  clients[id] = client;
  
  await producer.send({
    topic: 'client-creations',
    messages: [{ value: JSON.stringify(client) }]
  });
  
  res.status(201).json(client);
});

app.get('/clients', (req, res) => {
  res.json(Object.values(clients));
});

app.get('/clients/:id', (req, res) => {
  const client = clients[req.params.id];
  if (!client) return res.status(404).send('Client non trouvé');
  res.json(client);
});

app.put('/clients/:id', async (req, res) => {
  const client = clients[req.params.id];
  if (!client) return res.status(404).send('Client non trouvé');
  
  const updatedClient = { ...client, ...req.body };
  clients[req.params.id] = updatedClient;
  
  await producer.send({
    topic: 'client-updates',
    messages: [{ value: JSON.stringify(updatedClient) }]
  });
  
  res.json(updatedClient);
});

app.delete('/clients/:id', async (req, res) => {
  const client = clients[req.params.id];
  if (!client) return res.status(404).send('Client non trouvé');
  
  delete clients[req.params.id];
  
  await producer.send({
    topic: 'client-deletions',
    messages: [{ value: JSON.stringify({ id: req.params.id }) }]
  });
  
  res.status(204).send();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Service Client REST écoutant sur le port ${PORT}`);
});