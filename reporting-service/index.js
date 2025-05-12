const { ApolloServer } = require('apollo-server');
const { Kafka } = require('kafkajs');


const clients = {};


const typeDefs = `
  type Client {
    id: ID!
    nom: String!
    email: String!
    telephone: String
    adresse: String
    dateInscription: String!
  }

  type Query {
    clients: [Client!]!
    client(id: ID!): Client
    clientsParNom(nom: String!): [Client!]!
    clientsInscritsApres(date: String!): [Client!]!
  }
`;

const resolvers = {
  Query: {
    clients: () => Object.values(clients),
    client: (_, { id }) => clients[id],
    clientsParNom: (_, { nom }) => 
      Object.values(clients).filter(c => c.nom.includes(nom)),
    clientsInscritsApres: (_, { date }) => 
      Object.values(clients).filter(c => c.dateInscription > date)
  }
};

const kafka = new Kafka({
  clientId: 'reporting-service',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'reporting-group' });

async function startKafkaConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'client-creations', fromBeginning: true });
  await consumer.subscribe({ topic: 'client-updates', fromBeginning: true });
  await consumer.subscribe({ topic: 'client-deletions', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      
      switch (topic) {
        case 'client-creations':
          clients[data.id] = data;
          break;
        case 'client-updates':
          clients[data.id] = data;
          break;
        case 'client-deletions':
          delete clients[data.id];
          break;
      }
      console.log(`Mise à jour du reporting pour ${topic}`);
    },
  });
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`Service GraphQL prêt à l'URL ${url}`);
  startKafkaConsumer().catch(console.error);
});