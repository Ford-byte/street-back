const cartModel = require("../model/cartModel");
const columnRenamer = require('../middlewares/columnRenamer');
const getCurrentDateTime = require("../middlewares/getDate");
const { v4: uuidv4 } = require('uuid');

class Controller {
    async getCart(req, res) {
        cartModel.get((error, result) => {
            if (error) {
                return res.status(500).json({ message: "Internal Server Error!" });
            }
            const renamedResult = columnRenamer(result);
            res.status(200).json({ renamedResult });
        });
    }

    async insertCart(req, res) {
        try {
            const { product_id } = req.body;

            if (!product_id) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const id = uuidv4();
            const currentDateTime = getCurrentDateTime();

            const data = [
                id,
                product_id,
                currentDateTime,
                currentDateTime
            ];

            cartModel.insert(data, (error, results) => {
                if (error) {
                    console.error('Error inserting data:', error);
                    return res.status(500).json({ message: 'Failed to insert data', error });
                }
                res.status(201).json({ message: 'Data inserted successfully', results });
            });
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred', error });
        }
    }
}

module.exports = new Controller();
