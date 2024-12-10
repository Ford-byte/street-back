const { connection } = require('../services/dbConnection');

class Model {
    async get(callback) {
        const query = "SELECT * from cart WHERE isDeleted = 0";
        connection.query(query, callback);
    }
    async insert(data, callback) {
        const query = "INSERT INTO cart (id, product_id, isCreated, isDeleted, isUpdated) VALUES (?, ?, ?, 0, ?)";
        connection.query(query, data, callback);
    }

}

module.exports = new Model();