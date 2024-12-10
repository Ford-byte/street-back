const feedbackModel = require("../model/feedbackModel");
const columnRenamer = require('../middlewares/columnRenamer');
const getCurrentDateTime = require("../middlewares/getDate");
const { v4: uuidv4 } = require('uuid');

class Controller {
    async getFeedbacks(req, res) {
        const { id } = req.params;
        feedbackModel.get(id, (error, result) => {
            if (error) {
                return res.status(500).json({ message: "Internal Server Error!" });
            }

            if (!result || result.length === 0) {
                // Handle case where no data is returned
                return res.status(404).json({ message: "No feedbacks found." });
            }

            const renamedResult = columnRenamer(result);
            res.status(200).json({ renamedResult });
        });
    }

    async getAllFeedbacks(req, res) {
        try {
            feedbackModel.getAll((error, response) => {
                if (error) {
                    throw error;
                }
                res.status(200).json({ response })
            })
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }

    async insertFeedback(req, res) {
        const { product_id, user_id, message, rating } = req.body;

        // Validate that product_id and message are provided
        if (!product_id || !message || !rating) {
            return res.status(400).json({ message: "Product ID and message are required." });
        }

        const id = uuidv4();
        const data = [
            id, product_id, user_id, message, rating, getCurrentDateTime()
        ];

        try {
            // Assuming feedbackModel.insert returns a promise
            await feedbackModel.insert(data);
            res.status(200).json({ message: "Feedback sent!" });
        } catch (error) {
            console.error('Error inserting feedback:', error); // Log the error for debugging
            res.status(500).json({ message: "Internal Server Error!" });
        }
    }

    async dropFeedback(req, res) {
        const id = req.params.id;
        try {
            if (!id) {
                return res.status(400).json({ message: "Identifier is required!" });
            }

            const response = feedbackModel.drop(id);

            if (response) {
                return res.status(200).json({ message: "Feedback successfully deleted!" });
            } else {
                return res.status(404).json({ message: "Feedback not found or already deleted!" });
            }
        } catch (error) {
            console.error("Error in dropFeedback:", error); // Log for debugging
            return res.status(500).json({ message: "Internal Server Error!" });
        }
    }

}

module.exports = new Controller();
