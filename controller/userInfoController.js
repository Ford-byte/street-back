const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const columnRenamer = require('../middlewares/columnRenamer.js');
const { v4: uuidv4 } = require('uuid');
const getCurrentDateTime = require('../middlewares/getDate.js');
const userInfoModel = require('../model/userInfoModel.js');

class Controller {
    async getData(req, res) {
        const uid = req.params.uid;
        try {
            const result = await userInfoModel.getData(uid);
            const response = columnRenamer(result);
            res.status(200).json({ response });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    // async insertData()
}

module.exports = new Controller();
