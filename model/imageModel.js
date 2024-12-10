const { connection } = require("../services/dbConnection");

class Model {
    async get(id, callback) {
        const query = "SELECT * from productImages WHERE product_id = ? and isDeleted = 0 ";
        connection.query(query, id, callback)
    }
    async getAll(id, callback) {
        const query = "SELECT * from productImages WHERE isDeleted = 0 ";
        connection.query(query, id, callback)
    }

    async insert(data, callback) {
        const query = "INSERT INTO productImages (id, product_id, images) VALUES (?, ?, ?)";
        connection.query(query, data, callback);
    }    
}

module.exports = new Model();