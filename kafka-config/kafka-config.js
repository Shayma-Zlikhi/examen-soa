module.exports = {
  kafkaConfig: {
    clientId: 'client-management-app',
    brokers: ['kafka:9092'],
    topics: {
      creations: 'client-creations',
      updates: 'client-updates',
      deletions: 'client-deletions'
    }
  }
};