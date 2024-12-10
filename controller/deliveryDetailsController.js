const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const columnRenamer = require('../middlewares/columnRenamer');
const { v4: uuidv4 } = require('uuid');

const deliveryDetails = require('../model/deliveryDetailsModel');
const deliveryDetailsModel = require('../model/deliveryDetailsModel');

class DeliveryDetailsController {
    async getDetails(req, res) {
        try {
            const id = req.params.id;
            const result = await new Promise((resolve, reject) => {
                deliveryDetails.get(id, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
            });
            const renamedResult = columnRenamer(result);
            res.status(200).json({ renamedResult });
        } catch (error) {
            res.status(500).json({ message: "Error fetching details", error });
        }
    }

    async insertDetails(req, res) {
        const { user_id, cart_id, name, email, address, city, zipCode, paymentMethod } = req.body;

        // // Validate required fields
        // if (!user_id || !cart_id || !name || !email || !address || !city || !zipCode || !paymentMethod) {
        //     return res.status(400).json({ error: 'All required fields must be provided' });
        // }
        const id = uuidv4();
        const data = [
            id, // If id is not provided, generate a new UUID
            id,
            id,
            name,
            email,
            address,
            city,
            zipCode,
            paymentMethod
        ];

        try {
            const result = await new Promise((resolve, reject) => {
                deliveryDetails.insert(data, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
            });
            res.status(201).json({ result });
        } catch (error) {
            res.status(500).json({ message: "Error inserting details", error });
        }
    }

    async updateDetails(req, res) {
        const { id } = req.params; // Get the ID from the URL parameters
        const { user_id, cart_id, name, email, address, city, zipCode, paymentMethod } = req.body;

        // Validate required fields
        if (!user_id || !cart_id || !name || !email || !address || !city || !zipCode || !paymentMethod) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        const data = [
            user_id,
            cart_id,
            name,
            email,
            address,
            city,
            zipCode,
            paymentMethod,
            id // The ID to locate the record
        ];

        try {
            const result = await new Promise((resolve, reject) => {
                deliveryDetails.update(data, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Record not found" });
            }

            res.status(200).json({ message: "Details updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error updating details", error });
        }
    }

    async deleteDetails(req, res) {
        const id = req.params.id;

        deliveryDetailsModel.delete(id, (error, result) => {
            if (error) {
                return res.status(404).json({ message: "Cannot find User!", error })
            }
            res.status(200).json({ message: "User Details Deleted Successfully!" });
        })
    }
}

module.exports = new DeliveryDetailsController();
