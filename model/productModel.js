const { connection } = require("../services/dbConnection");

class Model {
    async get(callback) {
        // const query = "SELECT * FROM product WHERE isDeleted = 0";
        // const query = "SELECT p.id,p.size_id,p.name,p.images,p.isApproved,ps.size,ps.price,ps.category,ps.stockIn FROM product AS p LEFT JOIN productsizes AS ps ON p.size_id = ps.id WHERE p.isDeleted = 0";
        const query = "SELECT p.id,p.size_id,p.name,p.images,p.isApproved,p.isCreated,ps.small,ps.medium,ps.large,ps.x_large,ps.price,ps.category FROM product AS p LEFT JOIN productsizes AS ps ON p.size_id = ps.id WHERE p.isDeleted = 0 AND p.isCreated >= DATE_SUB(NOW(), INTERVAL 1 WEEK);";
        connection.query(query, callback);
    }

    async getProductsByCategory(category, name, callback) {
        const query = `
            SELECT 
                p.id, 
                p.size_id, 
                p.name, 
                p.images, 
                p.isApproved, 
                p.isCreated, 
                ps.small, 
                ps.medium, 
                ps.large, 
                ps.x_large, 
                ps.price, 
                ps.category
            FROM product AS p
            LEFT JOIN productsizes AS ps ON p.size_id = ps.id
            WHERE p.isDeleted = 0
              AND (ps.category LIKE ? OR p.name LIKE ?);
        `;
    
        // Pass both `category` and `name` as separate arguments.
        connection.query(query, [category, name], callback);
    }
    

    async getProductsBySizeAndCategory(data, callback) {
        // const query = "SELECT * FROM product WHERE size = ? and category = ? and isDeleted = 0";
        const query = `SELECT * FROM product WHERE size = ? AND (category = ? OR name LIKE ?) AND isDeleted = 0;`;
        connection.query(query, data, callback);
    }

    
    async insert(data) {
        const query = `INSERT INTO product (id, costumerFeedback_id, name, size_id, images,seller_id) VALUES (?, ?, ?, ?, ?, ?)`;

        try {
            return new Promise((resolve, reject) => {
                connection.query(query, data, (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        } catch (error) {
            throw new Error(`Error inserting data: ${error.message}`);
        }
    }

    async stockIn(data) {
        const query = 'INSERT INTO productsizes(id, small, medium, large, x_large, price, category) VALUES (?, ?, ?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            connection.query(query, data, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
    

    async buyProduct(size, quantity, productId) {
        let query = '';

        if (size === 'S') {
            query = "UPDATE product AS p LEFT JOIN productsizes AS ps ON p.size_id = ps.id SET ps.small = ps.small - ? WHERE ps.id = ?";
        } else if (size === 'M') {
            query = "UPDATE product AS p LEFT JOIN productsizes AS ps ON p.size_id = ps.id SET ps.medium = ps.medium - ? WHERE ps.id = ?";
        } else if (size === 'L') {
            query = "UPDATE product AS p LEFT JOIN productsizes AS ps ON p.size_id = ps.id SET ps.large = ps.large - ? WHERE ps.id = ?";
        } else if (size === 'XL') {
            query = "UPDATE product AS p LEFT JOIN productsizes AS ps ON p.size_id = ps.id SET ps.x_large = ps.x_large - ? WHERE ps.id = ?";
        } else {
            throw new Error("Invalid size provided"); // Throw error if the size is invalid
        }

        try {
            const results = await this.executeQuery(query, [quantity, productId]);
            return results; // Return the results if the query succeeds
        } catch (err) {
            console.error('Database error:', err);
            throw err; // Propagate the error
        }
    }

    async cancelOrder(size, data, callback) {
        const [quantity, productId] = data; // Destructure data array

        let query = '';
        if (size === 'S') {
            query = "UPDATE product AS p LEFT JOIN productsizes AS ps ON p.size_id = ps.id SET ps.small = ps.small + ? WHERE ps.id = ?";
        } else if (size === 'M') {
            query = "UPDATE product AS p LEFT JOIN productsizes AS ps ON p.size_id = ps.id SET ps.medium = ps.medium + ? WHERE ps.id = ?";
        } else if (size === 'L') {
            query = "UPDATE product AS p LEFT JOIN productsizes AS ps ON p.size_id = ps.id SET ps.large = ps.large + ? WHERE ps.id = ?";
        } else if (size === 'XL') {
            query = "UPDATE product AS p LEFT JOIN productsizes AS ps ON p.size_id = ps.id SET ps.x_large = ps.x_large + ? WHERE ps.id = ?";
        } else {
            return callback(new Error("Invalid size provided"), null);
        }

        try {
            const results = await this.executeQuery(query, [quantity, productId]); // Ensure correct arguments
            callback(null, results);
        } catch (err) {
            console.error('Database error:', err);
            callback(err, null);
        }
    }


    async executeQuery(query, params) {
        return new Promise((resolve, reject) => {
            connection.query(query, params, (error, results) => {
                if (error) {
                    return reject(error); // Reject promise on error
                }
                resolve(results); // Resolve promise on success
            });
        });
    }



    async delete(id, callback) {
        const query = "UPDATE product SET isDeleted = 1 WHERE id = ?";
        connection.query(query, id, callback)
    }
    async deleteAllProduct(id, callback){
        const query = "UPDATE product SET isDeleted = 1 WHERE seller_id = ?";
        connection.query(query, id, callback) 
    }

    async approve(id, callback) {
        const query = "UPDATE product SET isApproved = 1 WHERE id = ?";
        connection.query(query, id, callback)
    }
    async disapprove(id, callback) {
        const query = "UPDATE product SET isApproved = 0  WHERE id = ?";
        connection.query(query, id, callback)
    }

    async update(data, callback) {
        const query = `UPDATE product AS p LEFT JOIN productsizes AS ps ON p.size_id = ps.id SET p.name = ?,ps.small = ?,ps.medium = ?,ps.large = ?,ps.x_large = ?,ps.price = ?,ps.category=? WHERE p.id = ?`;
        connection.query(query, data, callback);
    }

}

module.exports = new Model();