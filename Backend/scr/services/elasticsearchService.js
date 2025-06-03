<<<<<<< HEAD
const { esClient } = require('../config/db/elasticsearch');

const DRUG_INDEX = process.env.DRUG_INDEX || 'drugs';

const indexDrug = async (drugs) => {
  try {
    const body = drugs.flatMap((doc) => [
      { index: { _index: "drugs" } },
      {
        id_mongoDB: doc._id,
=======
const axios = require('axios');

const esClient = axios.create({
  baseURL: process.env.ELASTICSEARCH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const DRUG_INDEX = process.env.ELASTICSEARCH_DRUG_INDEX || 'drugs';

// Tạo nhiều documents (bulk indexing)
const indexDrug = async (drugs) => {
  try {
    const bulkBody = drugs.flatMap((doc) => [
      { index: { _index: DRUG_INDEX } },
      {
>>>>>>> a03675c (add elastic remote and AI chatbot)
        name: doc.name,
        drug_class_and_effect: doc.drug_class_and_effect,
        indications: doc.indications,
      },
    ]);

<<<<<<< HEAD
    const { body: bulkResponse } = await esClient.bulk({ refresh: true, body });

    if (bulkResponse.errors) {
      throw new Error("Lỗi khi ghi dữ liệu bulk vào Elasticsearch");
    } else {
      return `Đã ghi ${drugs.length} documents`;
    }
=======
    const response = await esClient.post(`/_bulk`, bulkBody.map(JSON.stringify).join('\n') + '\n', {
      headers: { 'Content-Type': 'application/x-ndjson' },
      params: { refresh: true },
    });

    if (response.data.errors) {
      throw new Error('Lỗi khi ghi dữ liệu bulk vào Elasticsearch');
    }

    return `Đã ghi ${drugs.length} documents`;
>>>>>>> a03675c (add elastic remote and AI chatbot)
  } catch (error) {
    throw new Error(`Error indexing drug in Elasticsearch: ${error.message}`);
  }
};

<<<<<<< HEAD
const deleteDrug = async (drugId) => {
  try {
    await esClient.delete({
      index: DRUG_INDEX,
      id: drugId.toString(),
    });
=======
// Xoá document theo ID
const deleteDrug = async (drugId) => {
  try {
    const response = await esClient.delete(`/${DRUG_INDEX}/_doc/${drugId}`);
>>>>>>> a03675c (add elastic remote and AI chatbot)
    return `Drug with ID ${drugId} deleted from Elasticsearch`;
  } catch (error) {
    throw new Error(`Error deleting drug from Elasticsearch: ${error.message}`);
  }
};

<<<<<<< HEAD
const searchDrugs = async (query) => {
  try {
    const result = await esClient.search({
      index: DRUG_INDEX,
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['name^3', 'drug_class_and_effect^2', 'indications'], // tăng độ ưu tiên cho trường name
            type: "best_fields", // hoặc "most_fields" nếu bạn muốn tổng hợp tất cả điểm khớp
            fuzziness: "AUTO",   // tìm gần đúng
            operator: "or",      // hoặc "and" nếu bạn muốn tất cả từ phải khớp
            minimum_should_match: "70%" // kiểm soát độ khớp nội dung
          }
        }
      }
    });
    
    if (!result.hits || !result.hits.hits) {
      throw new Error("Invalid response from Elasticsearch");
    }

    return result.hits.hits.map(hit => hit._source);
  } catch (error) {
    throw new Error (`Error searching drugs in Elasticsearch: ${error.message}`);
  }
};

module.exports = { indexDrug, deleteDrug, searchDrugs };
=======
// Tìm kiếm thuốc theo từ khóa
const searchDrugs = async (query) => {
  try {
    const body = {
      size: 10,
      query: {
        bool: {
          should: [
            {
              match_phrase_prefix: {
                name: {
                  query,
                  boost: 2
                }
              }
            },
            {
              fuzzy: {
                name: {
                  value: query,
                  fuzziness: "AUTO"
                }
              }
            }
          ],
          minimum_should_match: 1
        }
      }
    };


    const response = await esClient.post(`/${DRUG_INDEX}/_search`, body);

    const hits = response.data.hits?.hits || [];

    return hits.map((hit) => hit._source);
  } catch (error) {
    throw new Error(`Error searching drugs in Elasticsearch: ${error.message}`);
  }
};

module.exports = {
  indexDrug,
  deleteDrug,
  searchDrugs,
};
>>>>>>> a03675c (add elastic remote and AI chatbot)
