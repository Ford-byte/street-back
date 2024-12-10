const columnRenamer = require('../middlewares/columnRenamer');
const { v4: uuidv4 } = require('uuid');
const getCurrentDateTime = require('../middlewares/getDate');
const ordersModel = require('../model/ordersModel');

class UserController {
    async getProducts(req, res) {
        try {
            const result = await ordersModel.getOrders();
            const response = columnRenamer(result);
            res.status(200).json({ response });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Internal Server Error!' });
        }
    }
    async getUserProducts(req, res) {
        try {
            const id = req.params.id;
            const result = await ordersModel.getUserOrders([id]);
            const response = columnRenamer(result);
            res.status(200).json({ response });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Internal Server Error!' });
        }
    }

    async insertProducts(req, res) {
        const {
            uid: uid,
            pid: pid,
            uname: uname,
            pname: pname,
            price: price,
            size: size,
            quantity: quantity,
            location: location
        } = req.body;

        // Prepare data for insertion
        const data = [
            uuidv4(),
            uid,
            pid,
            uname,
            pname,
            price,
            size,
            quantity,
            location    
        ];
        try {
            const result = await ordersModel.insertOrder(data);
            res.status(201).json({ message: 'Product inserted successfully!', result });
        } catch (error) {
            console.error('Error inserting products:', error);
            res.status(500).json({ message: 'Internal Server Error!' });
        }
    }

    async insertOrderCod(req, res) {
        const {
            uid: uid,
            pid: pid,
            uname: uname,
            pname: pname,
            price: price,
            size: size,
            quantity: quantity,
            location: location
        } = req.body;

        // Prepare data for insertion
        const data = [
            uuidv4(),
            uid,
            pid,
            uname,
            pname,
            price,
            size,
            quantity,
            location    
        ];
        try {
            const result = await ordersModel.insertOrderCod(data);
            res.status(201).json({ message: 'Product inserted successfully!', result });
        } catch (error) {
            console.error('Error inserting products:', error);
            res.status(500).json({ message: 'Internal Server Error!' });
        }
    }
    async approveOrder(req, res) {
        const id = req.params.id;
        try {
            const result = await ordersModel.approveOrder(id);
            res.status(200).json({ message: 'Product Approved!', result });
        } catch (error) {
            console.error('Error approving order:', error);
            res.status(500).json({ message: 'Internal Server Error!' });
        }
    }

    async orderReceived(req, res) {
        const id = req.params.id;

        try {
            const result = await ordersModel.orderReceived(id);
            res.status(200).json({ message: 'Product Received!', result });
        } catch (error) {
            console.error('Error approving order:', error);
            res.status(500).json({ message: 'Internal Server Error!' });
        }
    }

    async deleteOrder(req, res) {
        const id = req.params.id;

        try {
            const result = await ordersModel.deleteOrder(id);
            res.status(200).json({ message: 'Product Deleted!', result });
        } catch (error) {
            console.error('Error approving order:', error);
            res.status(500).json({ message: 'Internal Server Error!' });
        }
    }
    async deleteUserOrder(req, res) {
        const id = req.params.id;

        try {
            const result = await ordersModel.deleteUserOrder(id);
            res.status(200).json({ message: 'Product Deleted!', result });
        } catch (error) {
            console.error('Error approving order:', error);
            res.status(500).json({ message: 'Internal Server Error!' });
        }
    }
}

module.exports = new UserController();
