
const { connection } = require('../services/dbConnection');

class Model {
    async getOrders() {
        const query = "SELECT * FROM orders WHERE isDeleted = 0 ORDER BY isCreated DESC";
        //     const query = `SELECT 
        // *,
        // DATE(isCreated) AS date_only,
        // TIME(isCreated) AS time_only,
        // DATE_FORMAT(isCreated, '%Y-%m-%d %H:%i:%s') AS formatted_date_time
        // FROM orders WHERE isDeleted = 0 ORDER BY isCreated DESC;`
        return this.executeQuery(query);
    }
    async getUserOrders(id) {
        // const query = "SELECT * FROM orders WHERE isCostumerDeleted = 0 AND uid = ? ORDER BY isCreated DESC";
        //     const query = `SELECT 
        // *,
        // DATE(isCreated) AS date_only,
        // TIME(isCreated) AS time_only,
        // DATE_FORMAT(isCreated, '%Y-%m-%d %H:%i:%s') AS formatted_date_time
        // FROM orders WHERE isDeleted = 0 ORDER BY isCreated DESC;`
        const query=`SELECT 
    orders.*, 
    product.seller_id, 
    user.name AS seller_name 
FROM 
    orders 
JOIN 
    product 
ON 
    orders.pid = product.id 
JOIN 
    user 
ON 
    product.seller_id = user.id 
WHERE 
    orders.isCostumerDeleted = 0 
    AND orders.uid = ? 
ORDER BY 
    orders.isCreated DESC;

`;
        return this.executeQuery(query , id);
    }
    async insertOrder(data) {
        const query = "INSERT INTO orders(id,uid,pid,checkoutSessionId,paymentIntentId,uname,pname,price,size,quantity,location,isDeleted) VALUES(?,?,?,?,?,?,?,?,?,?,?,0)";
        return this.executeQuery(query, data)
    }
    async insertOrderCod(data) {
        const query = "INSERT INTO orders(id,uid,pid,uname,pname,price,size,quantity,location,isDeleted) VALUES(?,?,?,?,?,?,?,?,?,0)";
        return this.executeQuery(query, data)
    }
    async approveOrder(id) {
        const query = "UPDATE orders SET isApproved = 1 WHERE id = ?";
        return this.executeQuery(query, [id])
    }
    async orderReceived(id) {
        const query = "UPDATE orders SET status = 1 WHERE id = ?";
        return this.executeQuery(query, [id])
    }
    async deleteOrder(id) {
        const query = "UPDATE orders SET isDeleted = 1 WHERE id = ?";
        return this.executeQuery(query, [id])
    } 
    async deleteUserOrder(id) {
        const query = "UPDATE orders SET isCostumerDeleted = 1 WHERE id = ?";
        return this.executeQuery(query, [id])
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

