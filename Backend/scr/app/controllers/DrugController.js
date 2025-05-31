const Drug = require('../models/drug');
const { indexDrug, deleteDrug } = require('../../services/elasticsearchService');

const getAllDrugs = async (req, res, next) => {
  try {
    const drugs = await Drug.find().select('name indications _id');
    // Cho phép cache public (browser, CDN…) trong s
    res
      .set('Cache-Control', 'public, max-age=3600') //giây
      .status(200)
      .json(drugs);
  } catch (error) {
    next(error);
  }
};

// Hàm ngủ (delay)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Import data from mongoDB into Elasticsearch
const importDataToElasticsearch = async (req, res) => {
  try {
    let skip = 0;
    const batchSize = 100;
    const pauseTime = 500;
    while (true) {
      const drugs = await Drug.find().skip(skip).limit(batchSize).lean();
      if (drugs.length === 0) break;
      await indexDrug(drugs);
      skip += drugs.length;
      await sleep(pauseTime); // nghỉ giữa các batch để giảm tải CPU
    }
    res.status(201).json({ message: "Hoàn thành import data" });
  }
  catch {
    next(error);
  }
};

const createDrug = async (req, res) => {
  const newDrug = new Drug(req.body);
  try {
    const savedDrug = await newDrug.save();
    await indexDrug(savedDrug);
    res.status(201).json(savedDrug);
  } catch (error) {
    next(error);
  }
};

const getDrugById = async (req, res) => {
  try {
    const drug = await Drug.findById(req.params.id);
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }
    res.status(200).json(drug);
  } catch (error) {
    next(error);
  }
};

const updateDrug = async (req, res) => {
  try {
    const updatedDrug = await Drug.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDrug) {
      return res.status(404).json({ message: 'Drug not found' });
    }
    await indexDrug(updatedDrug);
    res.status(201).json(updatedDrug);
  } catch (error) {
    next(error);
  }
};

const deleteDrugById = async (req, res) => {
  try {
    const deletedDrug = await Drug.findByIdAndDelete(req.params.id);
    if (!deletedDrug) {
      return res.status(404).json({ message: 'Drug not found' });
    }
    await deleteDrug(deletedDrug._id);
    res.status(201).json({ message: 'Drug deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDrugs,
  createDrug,
  getDrugById,
  updateDrug,
  deleteDrugById,
  importDataToElasticsearch,
};