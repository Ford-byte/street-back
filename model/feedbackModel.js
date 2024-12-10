const { connection } = require("../services/dbConnection");

class Model {
    async get(id, callback) {
        const query = "SELECT * FROM feedback WHERE product_id = ? and isDeleted = 0";
        connection.query(query, id, callback);
    }
    async getAll(callback) {
        const query = `SELECT u.*,f.*, f.id AS feedbackId
FROM feedback AS f 
LEFT JOIN userinfo AS u 
ON u.uid = f.user_id 
WHERE f.isDeleted = 0;
`;
        connection.query(query, callback);
    }
    async insert(data, callback) {
        const query = "INSERT INTO feedback (`id`, `product_id`, `user_id`, `message`,`rating`, `isCreated`) VALUES (?, ?, ?, ?, ?, ?)";
        connection.query(query, data, callback)
    }
    async drop(id,callback){
        const query = "UPDATE feedback SET isDeleted = 1 WHERE id = ?";
        connection.query(query,id,callback);
    }
}

module.exports = new Model();