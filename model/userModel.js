
const { connection } = require('../services/dbConnection');

class UserModel {
    async get() {
        const query = "SELECT * FROM user WHERE isDeleted = 0";
        return this.executeQuery(query);
    }

    async insert(data) {
        const query = "INSERT INTO user (id, role, name, password, email, birthdate, isDeleted, isCreated, isUpdated, order_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return this.executeQuery(query, data);
    }

    async insertData(data) {
        const query = "INSERT INTO userinfo(uid,fullname,email,createdAt) VALUES(?,?,?,?)"
        return this.executeQuery(query, data)
    }


    async updateUser(data) {
        const query = `UPDATE userinfo 
SET fullname = ?, cpnum = ?, gender = ?, street = ? , city =?, province=? 
WHERE uid = ?
`;
        return this.executeQuery(query, data);
    }

    async deleteUser(id) {
        const query = "UPDATE user SET isDeleted = 1 WHERE id = ?";
        return this.executeQuery(query, [id]);
    }
    async blockUser(id) {
        const query = "UPDATE sellerinfo SET isBlocked = 1 WHERE id = ?";
        return this.executeQuery(query, [id]);
    }

    async login(email) {
        const query = "SELECT * FROM user WHERE email = ? AND isDeleted = 0";
        return this.executeQuery(query, [email]);
    }

    async getUser(email) {
        // const query = "SELECT * FROM user WHERE email = ? AND isDeleted = 0";
        const query = `
        SELECT user.*,userinfo.fullname,userinfo.email,userinfo.createdAt,userinfo.cpnum
        FROM user
        LEFT JOIN userinfo ON user.id = userinfo.uid
        WHERE user.email = ? AND user.isDeleted = 0;
    `;
        return this.executeQuery(query, [email]);
    }

    async getUserById(id) {
        const query = "SELECT * FROM user WHERE id = ? AND isDeleted = 0";
        return this.executeQuery(query, [id]);
    }

    async getUserRole(role) {
        const query = "SELECT * FROM user WHERE role = ? AND isDeleted = 0";
        return this.executeQuery(query, [role]);
    }

    async otp(data) {
        const query = "INSERT INTO otp (otpnum, email, expirationTimestamp) VALUES (?, ?, ?)";
        return this.executeQuery(query, data);
    }

    async myOtp(otp) {
        const query = "SELECT * FROM otp WHERE otpnum = ?";
        return this.executeQuery(query, [otp]);
    }

    async addRole(data) {
        const query = "UPDATE user SET role = ? WHERE id = ?";
        return this.executeQuery(query, data);
    }

    async addImage(data) {
        const query = "INSERT INTO userprofile (id, uid, image, isDeleted) VALUES (?, ?, ?, 0)";
        return this.executeQuery(query, data);
    }
    async getProfile(data) {
        const query = "SELECT image FROM userprofile WHERE uid = ? AND isDeleted = 0";
        return this.executeQuery(query, data)
    }

    async changePassword(data) {
        const query = "UPDATE user SET password = ? WHERE email = ?";
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

module.exports = new UserModel();

