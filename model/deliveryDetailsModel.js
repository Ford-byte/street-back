const { connection } = require("../services/dbConnection");

class DeliveryDetailsModel {
    // Retrieve all delivery details or a specific record if an ID is provided
    async get(id, callback) {
        let query = "SELECT * FROM `deliverdetails` WHERE isDeleted = 0 AND id = ?";
        connection.query(query, id, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results);
        });
    }

    // Insert a new delivery detail record
    async insert(data, callback) {
        const query = `
            INSERT INTO \`deliverdetails\` (id,\`user_id\`, \`cart_id\`, \`name\`, \`email\`, \`address\`, \`city\`, \`zipCode\`, \`paymentMethod\`, \`isDeleted\`)
            VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, 0)
        `;
        connection.query(query, data, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results);
        });
    }

    // Update existing delivery detail records
    async update(data, callback) {
        const query = `
            UPDATE \`deliverdetails\`
            SET \`user_id\` = ?, \`cart_id\` = ?, \`name\` = ?, \`email\` = ?, \`address\` = ?, \`city\` = ?, \`zipCode\` = ?, \`paymentMethod\` = ?, \`isDeleted\` = ?
            WHERE \`id\` = ?
        `;
        connection.query(query, data, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results);
        });
    }

    // Update a single record by ID
    async updateOne(id, data, callback) {
        const query = `
            UPDATE \`deliverdetails\`
            SET \`user_id\` = ?, \`cart_id\` = ?, \`name\` = ?, \`email\` = ?, \`address\` = ?, \`city\` = ?, \`zipCode\` = ?, \`paymentMethod\` = ?, \`isDeleted\` = ?
            WHERE \`id\` = ?
        `;
        const values = [
            data.user_id,
            data.cart_id,
            data.name,
            data.email,
            data.address,
            data.city,
            data.zipCode,
            data.paymentMethod,
            data.isDeleted || 0,
            id
        ];
        connection.query(query, values, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results);
        });
    }

    // Delete a record by ID
    async delete(id, callback) {
        const query = "UPDATE `deliverdetails`  SET isDeleted = 1 WHERE `id` = ?";
        connection.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results);
        });
    }
}

module.exports = new DeliveryDetailsModel();
