const { connection } = require('../services/dbConnection');

class Model {
    async getData(id) {
        const query = "SELECT * FROM userinfo WHERE uid = ? and isDeleted = 0";
        return this.executeQuery(query,[id]);
    }

    async insertData(data) {
        const query = "INSERT INTO userinfo(uid,fullname,email,cpnum,gender,street,city,province,createdAt,isDeleted) VALUES(?,?,?,?,,?,?,?,?,?,0)"
        return this.executeQuery(query, data)
    }

    async executeQuery(query, params) {
        return new Promise((resolve, reject) => {
            connection.query(query, params, (error, results) => {
                if (error) {
                    console.error('Database error:', error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
}

module.exports = new Model();

