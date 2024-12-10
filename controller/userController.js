const UserModel = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const columnRenamer = require('../middlewares/columnRenamer');
const { v4: uuidv4 } = require('uuid');
const getCurrentDateTime = require('../middlewares/getDate');
const { sendEMail } = require('../middlewares/emailMiddleware.js');


class UserController {

    async getUsers(req, res) {
        try {
            const result = await UserModel.get();
            const response = columnRenamer(result);
            res.status(200).json({ response });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Internal Server Error!' });
        }
    }

    async getUserById(req, res) {
        const id = req.params.id;
        try {
            const result = await UserModel.getUserById(id);
            if (!result) return res.status(404).json({ message: 'User not found!' });
            const response = columnRenamer(result);
            res.status(200).json({ response });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Internal Server Error!' });
        }
    }

    async otp(req, res) {
        const email = req.body.email;
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format!' });
        }

        try {
            const userExists = await UserModel.getUser(email);
            if (userExists.length > 0) {
                return res.status(400).json({ message: 'Email is already registered!' });
            }

            const otp = String(Math.floor(100000 + Math.random() * 900000));
            const expirationTimestamp = getCurrentDateTime() + 3 * 60 * 1000; // 3 minutes from now
            await UserModel.otp([otp, email, expirationTimestamp]);

            // Uncomment to send email
            const emailResponse = await sendEMail(email, otp);

            return res.status(200).json({ message: 'OTP generated and sent successfully, Please Check your Email.', emailResponse });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error!', error });
        }
    }

    async userRegistration(req, res) {
        const { otp, email, name, password, birthdate, role } = req.body;

        // Check for required fields
        const errors = [];
        if (!otp) errors.push('OTP is required!');
        if (!email) errors.push('Email is required!');
        if (!name) errors.push('Name is required!');
        if (!password) errors.push('Password is required!');
        if (!birthdate) errors.push('Birthdate is required!');
        if (!role) errors.push('Role is required!');

        if (errors.length > 0) {
            return res.status(400).json({ message: errors });
        }

        // Check if user is at least 18 years old
        const birthDateObj = new Date(birthdate);
        const age = new Date().getFullYear() - birthDateObj.getFullYear();
        const monthDiff = new Date().getMonth() - birthDateObj.getMonth();
        if (age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && new Date() < new Date(birthdate))) {
            return res.status(400).json({ message: "You're not old enough to register!" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email format is not valid!" });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }
        if (!/[a-zA-Z]/.test(password)) {
            return res.status(400).json({ message: "Password must contain at least one letter." });
        }

        if (!/\d/.test(password)) {
            return res.status(400).json({ message: "Password must contain at least one number." });
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return res.status(400).json({ message: "Password must contain at least one special character." });
        }


        if (errors.length > 0) {
            return res.status(400).json({ message: errors });
        }

        try {
            // Validate OTP
            const otpData = await UserModel.myOtp(otp);
            if (!otpData || !otpData.length || getCurrentDateTime() > otpData[0].expirationTimestamp) {
                return res.status(400).json({ message: 'Invalid or expired OTP!' });
            }

            // Hash password
            const hashPassword = await bcrypt.hash(password, 10);

            // Check if user already exists
            const userExists = await UserModel.getUser(email);
            if (userExists.length > 0) {
                return res.status(400).json({ message: 'Email is already registered!' });
            }

            // Generate unique ID for the user
            const id = uuidv4();

            // Prepare data for insertion
            const data = [id, role, name, hashPassword, email, birthdate, false, getCurrentDateTime(), false, id];
            const dataTwo = [id, name, email, getCurrentDateTime()];

            // Insert user data
            await UserModel.insert(data);
            await UserModel.insertData(dataTwo);

            return res.status(201).json({ message: 'Registration successful!' });
        } catch (error) {
            console.error('Error during user registration:', error);
            return res.status(500).json({ message: 'Internal Server Error!' });
        }
    }


    async userLogin(req, res) {
        const { username, password } = req.body;
        try {
            const result = await UserModel.getUser(username);
            if (!result.length) {
                return res.status(401).json({ message: 'User not found!' });
            }

            const user = result[0];
            console.log(user);
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid password!' });
            }

            const accessToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '10h' });
            res.status(200).json({ message: 'Login successful!', role: user.role, id: user.id, isUser: user.email, name: user.fullname, token: accessToken });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Error occurred while processing data' });
        }
    }

    async addRole(req, res) {
        const { role, id } = req.body;
        try {
            await UserModel.addRole([role, id]);
            res.status(200).json({ message: 'Role added' });
        } catch (error) {
            console.error('Error adding role:', error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    }

    async getUserByRole(req, res) {
        const role = req.params.role;
        try {
            const result = await UserModel.getUserRole(role);
            const finalResult = columnRenamer(result);
            res.status(200).json({ finalResult });
        } catch (error) {
            console.error('Error fetching users by role:', error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    }

    async addProfile(req, res) {
        const uid = req.body.uid;
        const image = req.file;

        if (!image) {
            return res.status(400).json({ message: 'Image is required!' });
        }

        const data = [uuidv4(), uid, image.filename];
        try {
            await UserModel.addImage(data);
            res.status(200).json({ message: 'Profile image added successfully!' });
        } catch (error) {
            console.error('Error adding profile image:', error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    }

    async getProfile(req, res) {
        const uid = req.params.uid
        try {
            const result = await UserModel.getProfile(uid);
            const finalResult = columnRenamer(result);
            res.status(200).json({ finalResult });
        } catch (error) {
            console.error('Error fetching users by role:', error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    }
    async updateUser(req, res) {
        const id = req.params.id;
        const { name, number, gender, street, city, province } = req.body;
        if (!name || !gender || !street || !city || !province || !number) {
            return res.status(400).json({ message: "Missing required fields!" });
        }

        const data = [name, number, gender, street, city, province, id];
        try {
            await UserModel.updateUser(data);
            res.status(200).json({ message: "User data updated!" });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: "Internal Server Error!", error: error.message });
        }
    }

    async deleteUser(req, res) {
        const id = req.params.id;
        try {
            await UserModel.deleteUser(id);
            res.status(200).json({ message: "User deleted!" });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
    async blockUser(req, res) {
        const id = req.params.id;
        try {
            await UserModel.blockUser(id);
            res.status(200).json({ message: "User blocked!" });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // async userExists(req, res) {
    //     const email = req.body.email;
    //     try {
    //         const response = await UserModel.login(email);

    //         if (response) {
    //                 await bcrypt.compare(password, user.password)
    //                 sendPassword(response.email, response.password)
    //         } else {
    //             res.status(500).json({ message: "Sorry, we cannot find your account." });
    //         }

    //         res.status(200).json({ message: "Please check your email." });
    //     } catch (error) {
    //         console.error('Error deleting user:', error);
    //         res.status(500).json({ message: "Internal Server Error" });
    //     }
    // }
    async forgotPassword(req, res) {
        const email = req.body.email;
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format!' });
        }

        try {
            const userExists = await UserModel.getUser(email);
            if (userExists.length == 0) {
                return res.status(400).json({ message: 'Sorry we cant find your account in our system.' });
            }

            const otp = String(Math.floor(100000 + Math.random() * 900000));
            const expirationTimestamp = getCurrentDateTime() + 1 * 60 * 1000; // 3 minutes from now
            await UserModel.otp([otp, email, expirationTimestamp]);

            // Uncomment to send email
            const emailResponse = await sendEMail(email, otp);

            return res.status(200).json({ message: 'OTP generated and sent successfully, Please Check your Email.', emailResponse });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error!', error });
        }
    }

    async changePassword(req, res) {
        const { otp, email, password } = req.body;

        // Check for required fields
        const errors = [];
        if (!otp) errors.push('OTP is required!');
        if (!email) errors.push('Email is required!');
        if (!password) errors.push('Password is required!');

        if (errors.length > 0) {
            return res.status(400).json({ message: errors });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }
        if (!/[a-zA-Z]/.test(password)) {
            return res.status(400).json({ message: "Password must contain at least one letter." });
        }

        if (!/\d/.test(password)) {
            return res.status(400).json({ message: "Password must contain at least one number." });
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return res.status(400).json({ message: "Password must contain at least one special character." });
        }


        if (errors.length > 0) {
            return res.status(400).json({ message: errors });
        }

        try {
            const otpData = await UserModel.myOtp(otp);
            if (!otpData || !otpData.length || getCurrentDateTime() > otpData[0].expirationTimestamp) {
                return res.status(400).json({ message: 'Invalid or expired OTP!' });
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const data = [hashPassword, email];
            
            await UserModel.changePassword(data);

            return res.status(201).json({ message: 'Change password successful!' });
        } catch (error) {
            console.error('Error during user registration:', error);
            return res.status(500).json({ message: 'Internal Server Error!' });
        }
    }
}

module.exports = new UserController();


