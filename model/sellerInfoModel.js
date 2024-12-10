const { connection } = require('../services/dbConnection');

class Model {
    async get(id, callback) {
        const query = "SELECT * FROM `sellerinfo` WHERE sid = ?";
        connection.query(query, id, callback);
    }

    async insert(data, callback) {
        const query = "INSERT INTO sellerinfo() VALUES()"
    }
}

module.exports = new Model();

