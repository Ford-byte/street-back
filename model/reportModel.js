const { connection } = require("../services/dbConnection");

class Model {
    async getData() {
        const query = `SELECT r.*, r.id AS reportId,r.images AS reportedImages, p.*, p.name AS productName, u.* FROM report AS r LEFT JOIN product AS p ON r.pid = p.size_id LEFT JOIN userinfo AS u ON r.uid = u.uid WHERE r.isDeleted = 0;`;
        return this.executeQuery(query);
    }

    async deleteData(id){
        const query = `UPDATE report SET isDeleted = 1 WHERE id = ?`;
        return this.executeQuery(query,[id])
    }

    async insertData(data){
        const query = `INSERT INTO report(id,pid,uid,message,images) VALUES(?,?,?,?,?)`;
        return this.executeQuery(query,data)
    }

    async executeQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            connection.query(query, params, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
}

module.exports = new Model();
