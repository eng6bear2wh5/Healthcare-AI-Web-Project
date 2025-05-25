const { searchDrugs } = require('../../services/elasticsearchService');

const search = async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ message: 'Search query is required' });
  }
  try {
    const results = await searchDrugs(q);
    res.status(201).json(results);
  } catch (error) {
    error.message = `Error during searching Drug: ${error.message}`;
    next(error);
  }
};

module.exports = {
  search,
};