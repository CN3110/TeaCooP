const db = require('../config/database');

const SoldLot = {
    async addOrUpdateSoldPrice(lotNumber, brokerId, soldPrice) {
        try {
            // Get the lot details including totalNetWeight
            const [lot] = await db.query(
                `SELECT totalNetWeight FROM lot WHERE lotNumber = ?`, 
                [lotNumber]
            );
            
            if (!lot || lot.length === 0) {
                throw new Error('Lot not found');
            }

            // Calculate total in backend
            const totalSoldPrice = soldPrice * lot[0].totalNetWeight;

            // Check if record exists
            const [existing] = await db.query(
                `SELECT * FROM sold_lot WHERE lotNumber = ? AND brokerId = ?`,
                [lotNumber, brokerId]
            );

            if (existing.length > 0) {
                // Update existing record
                const [result] = await db.query(
                    `UPDATE sold_lot 
                     SET soldPrice = ?, 
                         total_sold_price = ?,
                         soldDate = NOW()
                     WHERE lotNumber = ? AND brokerId = ?`,
                    [soldPrice, totalSoldPrice, lotNumber, brokerId]
                );
                
                return {
                    operation: 'update',
                    affectedRows: result.affectedRows,
                    saleId: existing[0].saleId,
                    totalSoldPrice // Return calculated value
                };
            } else {
                // Create new record
                const [result] = await db.query(
                    `INSERT INTO sold_lot 
                     (lotNumber, brokerId, soldPrice, total_sold_price) 
                     VALUES (?, ?, ?, ?)`,
                    [lotNumber, brokerId, soldPrice, totalSoldPrice]
                );
                
                return {
                    operation: 'insert',
                    affectedRows: result.affectedRows,
                    saleId: result.insertId,
                    totalSoldPrice // Return calculated value
                };
            }
        } catch (err) {
            console.error('Error in addOrUpdateSoldPrice:', err);
            throw err;
        }
    },

    async getByBroker(brokerId) {
        try {
            const [results] = await db.query(
                `SELECT 
                    sl.saleId,
                    sl.lotNumber,
                    sl.brokerId,
                    sl.soldPrice,
                    sl.total_sold_price,
                    sl.soldDate,
                    l.invoiceNumber,
                    l.teaGrade,
                    l.noOfBags,
                    l.netWeight,
                    l.totalNetWeight,
                    l.manufacturingDate,
                    b.brokerName,
                    b.brokerCompanyName,
                    bv.valuationPrice as employeePrice
                FROM sold_lot sl
                JOIN lot l ON sl.lotNumber = l.lotNumber
                JOIN broker b ON sl.brokerId = b.brokerId
                LEFT JOIN broker_valuation bv ON 
                    sl.lotNumber = bv.lotNumber AND 
                    sl.brokerId = bv.brokerId AND
                    bv.is_confirmed = TRUE
                WHERE sl.brokerId = ?`,
                [brokerId]
            );

            // You could also calculate it here if you prefer not to store it
            // results.forEach(item => {
            //     item.calculated_total = item.soldPrice * item.totalNetWeight;
            // });

            return results;
        } catch (err) {
            console.error('Error in getByBroker:', err);
            throw err;
        }
    },

    async deleteSoldPrice(saleId) {
        try {
            const [result] = await db.query(
                `DELETE FROM sold_lot WHERE saleId = ?`,
                [saleId]
            );
            return result.affectedRows > 0;
        } catch (err) {
            console.error('Error in deleteSoldPrice:', err);
            throw err;
        }
    }
};

module.exports = SoldLot;