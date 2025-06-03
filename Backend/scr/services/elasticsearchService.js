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
        name: doc.name,
        drug_class_and_effect: doc.drug_class_and_effect,
        indications: doc.indications,
      },
    ]);

    const response = await esClient.post(`/_bulk`, bulkBody.map(JSON.stringify).join('\n') + '\n', {
      headers: { 'Content-Type': 'application/x-ndjson' },
      params: { refresh: true },
    });

    if (response.data.errors) {
      throw new Error('Lỗi khi ghi dữ liệu bulk vào Elasticsearch');
    }

    return `Đã ghi ${drugs.length} documents`;
  } catch (error) {
    throw new Error(`Error indexing drug in Elasticsearch: ${error.message}`);
  }
};

// Xoá document theo ID
const deleteDrug = async (drugId) => {
  try {
    const response = await esClient.delete(`/${DRUG_INDEX}/_doc/${drugId}`);
    return `Drug with ID ${drugId} deleted from Elasticsearch`;
  } catch (error) {
    throw new Error(`Error deleting drug from Elasticsearch: ${error.message}`);
  }
};

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
