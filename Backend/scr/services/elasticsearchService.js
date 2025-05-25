const { esClient } = require('../config/db/elasticsearch');

const DRUG_INDEX = process.env.DRUG_INDEX || 'drugs';

const indexDrug = async (drugs) => {
  try {
    const body = drugs.flatMap((doc) => [
      { index: { _index: "drugs" } },
      {
        id_mongoDB: doc._id,
        name: doc.name,
        drug_class_and_effect: doc.drug_class_and_effect,
        indications: doc.indications,
      },
    ]);

    const { body: bulkResponse } = await esClient.bulk({ refresh: true, body });

    if (bulkResponse.errors) {
      throw new Error("Lỗi khi ghi dữ liệu bulk vào Elasticsearch");
    } else {
      return `Đã ghi ${drugs.length} documents`;
    }
  } catch (error) {
    throw new Error(`Error indexing drug in Elasticsearch: ${error.message}`);
  }
};

const deleteDrug = async (drugId) => {
  try {
    await esClient.delete({
      index: DRUG_INDEX,
      id: drugId.toString(),
    });
    return `Drug with ID ${drugId} deleted from Elasticsearch`;
  } catch (error) {
    throw new Error(`Error deleting drug from Elasticsearch: ${error.message}`);
  }
};

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