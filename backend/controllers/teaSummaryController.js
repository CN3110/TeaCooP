const TeaSummary = require('../models/teaSummary');

// Get complete tea production summary
exports.getTeaProductionSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const summary = await TeaSummary.getTeaProductionSummary(month, year);
    
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching tea production summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tea production summary',
      error: error.message
    });
  }
};

// Get raw tea total
exports.getRawTeaTotal = async (req, res) => {
  try {
    const { month, year } = req.query;
    const totalRawTea = await TeaSummary.getTotalRawTeaWeight(month, year);
    
    res.status(200).json({
      success: true,
      data: { totalRawTea }
    });
  } catch (error) {
    console.error('Error fetching raw tea total:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch raw tea total',
      error: error.message
    });
  }
};

// Get made tea total
exports.getMadeTeaTotal = async (req, res) => {
  try {
    const { month, year } = req.query;
    const totalMadeTea = await TeaSummary.getTotalMadeTeaWeight(month, year);
    
    res.status(200).json({
      success: true,
      data: { totalMadeTea }
    });
  } catch (error) {
    console.error('Error fetching made tea total:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch made tea total',
      error: error.message
    });
  }
};

// Get total tea packets
exports.getTotalTeaPackets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const totalPackets = await TeaSummary.getTotalTeaPackets(month, year);
    
    res.status(200).json({
      success: true,
      data: { totalPackets }
    });
  } catch (error) {
    console.error('Error fetching total tea packets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch total tea packets',
      error: error.message
    });
  }
};

// Get tea production by type
exports.getTeaProductionByType = async (req, res) => {
  try {
    const { month, year } = req.query;
    const teaProduction = await TeaSummary.getTeaProductionByType(month, year);
    
    res.status(200).json({
      success: true,
      data: { teaProduction }
    });
  } catch (error) {
    console.error('Error fetching tea production by type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tea production by type',
      error: error.message
    });
  }
};

// Get current tea type stock
exports.getCurrentTeaTypeStock = async (req, res) => {
  try {
    const currentStock = await TeaSummary.getCurrentTeaTypeStock();
    
    res.status(200).json({
      success: true,
      data: { currentStock }
    });
  } catch (error) {
    console.error('Error fetching current tea type stock:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch current tea type stock',
      error: error.message
    });
  }
};

// Get total lot weights
exports.getTotalLotWeights = async (req, res) => {
  try {
    const { month, year } = req.query;
    const totalLotWeight = await TeaSummary.getTotalLotWeights(month, year);
    
    res.status(200).json({
      success: true,
      data: { totalLotWeight }
    });
  } catch (error) {
    console.error('Error fetching total lot weights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch total lot weights',
      error: error.message
    });
  }
};
