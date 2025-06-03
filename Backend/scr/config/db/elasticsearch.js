<<<<<<< HEAD
const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
  ssl: {
    rejectUnauthorized: false, 
  },
});

const checkElasticsearchConnection = async () => {
  try {
    const health = await esClient.cluster.health();
    console.log('✅ Elasticsearch connection success');
  } catch (error) {
    console.error('❌ Elasticsearch connection failed:', error.message);
  }
};

module.exports = { esClient, checkElasticsearchConnection };
=======
// const { Client } = require('@elastic/elasticsearch');

// const esClient = new Client({
//   node: process.env.ELASTICSEARCH_NODE,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// const checkElasticsearchConnection = async () => {
//   try {
//     const health = await esClient.cluster.health();
//     console.log('✅ Elasticsearch connection success');
//   } catch (error) {
//     console.error('❌ Elasticsearch connection failed:', error.message);
//   }
// };

// module.exports = { esClient, checkElasticsearchConnection };
>>>>>>> a03675c (add elastic remote and AI chatbot)
