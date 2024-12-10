const bcryptjs = require('bcryptjs');
const adminModel = require('../model/adminModel');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid')

class AdminController {
    async adminLogin(req, res) {
        const { username, password } = req.body;
        try {
            adminModel.login([username], async (error, result) => {
                if (error) return res.status(500).json({ success: false, message: 'Internal server error!' });

                if (result.length === 0) {
                    return res.status(404).json({ success: false, message: 'User not found!' });
                }

                const user = result[0];
                const passwordMatch = await bcryptjs.compare(password, user.password);

                if (!passwordMatch) {
                    return res.status(401).json({ success: false, message: 'Invalid password!' });
                }


                const accessToken = jwt.sign({ id: user.id }, "jwt-access-token-secret-key", { expiresIn: '1m' })
                const refreshToken = jwt.sign({ id: user.id }, "jwt-refresh-token-secret-key", { expiresIn: '7d' })

                res.cookie('accessToken', accessToken, { maxAge: 60000 })

                res.cookie('refreshToken', refreshToken,
                    { maxAge: 604800000, httpOnly: true, sameSite: 'strict' })

                res.status(200).json({ success: true, message: 'Login successfully!' });
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error occured while proccessing data' });
        }
    }
    
    async adminRegistration(req, res) {
        const id = uuidv4();
        const {
            username, password
        } = req.body;
        const hashPassword = await bcryptjs.hash(password, 10);
        const data = [
            id,username, hashPassword
        ]
        adminModel.insert(data, (error, result) => {
            if (error) {
                return res.status(500).send({ message: "Internal Server Error!" });
            }
            res.status(200).send({ message: "Admin Sucessfully Registered!" })
        })
    }
}

module.exports = new AdminController();