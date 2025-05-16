const SoldLot = require('../models/soldLot');

exports.addOrUpdateSoldPrice = async (req, res) => {
    const { lotNumber, brokerId, soldPrice } = req.body;

    if (!lotNumber || !brokerId || isNaN(soldPrice) || soldPrice <= 0) {
        return res.status(400).json({ 
            success: false,
            message: 'Valid lot number, broker ID and sold price are required' 
        });
    }

    try {
        const result = await SoldLot.addOrUpdateSoldPrice(lotNumber, brokerId, soldPrice);
        
        res.json({ 
            success: true,
            message: 'Sold price updated successfully',
            data: result
        });
    } catch (err) {
        console.error('Error in addOrUpdateSoldPrice:', err);
        res.status(500).json({ 
            success: false,
            message: err.message || 'Error updating sold price' 
        });
    }
};

exports.getSoldLotsByBroker = async (req, res) => {
    const { brokerId } = req.params;

    try {
        const results = await SoldLot.getByBroker(brokerId);
        res.json({
            success: true,
            data: results
        });
    } catch (err) {
        console.error('Error in getSoldLotsByBroker:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Error fetching sold lots'
        });
    }
};

exports.getAllSoldLotsForEmployee = async (req, res) => {
    try {
        const soldLots = await SoldLot.getAllForEmployee();
        
        res.json({
            success: true,
            data: soldLots
        });
    } catch (err) {
        console.error('Error in getAllSoldLotsForEmployee:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Error fetching sold lots data'
        });
    }
};



exports.deleteSoldPrice = async (req, res) => {
    const { saleId } = req.params;

    try {
        const deleted = await SoldLot.deleteSoldPrice(saleId);
        
        if (deleted) {
            res.json({ 
                success: true,
                message: 'Sold price deleted successfully' 
            });
        } else {
            res.status(404).json({ 
                success: false,
                message: 'Record not found' 
            });
        }
    } catch (err) {
        console.error('Error in deleteSoldPrice:', err);
        res.status(500).json({ 
            success: false,
            message: err.message || 'Error deleting sold price' 
        });
    }
};