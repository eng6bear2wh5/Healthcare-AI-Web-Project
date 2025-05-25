const express = require('express');
const router = express.Router();
const drugController = require('../app/controllers/DrugController');
const searchController = require('../app/controllers/SearchController');

router.get('/drugs', drugController.getAllDrugs);
router.post('/drugs', drugController.createDrug);
router.get('/drugs/:id', drugController.getDrugById);
router.put('/drugs/:id', drugController.updateDrug);
router.delete('/drugs/:id', drugController.deleteDrugById);
router.get('/import-data', drugController.importDataToElasticsearch);

router.get('/search', searchController.search);

module.exports = router;
