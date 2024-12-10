const { connection } = require("../services/dbConnection");

class AdminModel {
    async login(username, callback) {
        const query = "SELECT * FROM admin WHERE username = ?";
        connection.query(query, [username], callback);
    }

    async insert(data, callback) {
        const query = "INSERT INTO admin (id, username, password) VALUES (?, ?, ?)";
        connection.query(query, data, callback);
    }
}

module.exports = new AdminModel();
