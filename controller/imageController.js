const { generateFilename } = require("../middlewares/multer");
const imageModel = require("../model/imageModel");
const { v4: uuidv4 } = require("uuid")
class Controller {
    async getImages(req, res) {
        const id = req.params.id;
        imageModel.get(id, (error, result) => {
            if (error) {
                res.status(500).json({ message: "Internal Server Error!" });
            }
            res.status(200).json({ result })
        })
    }

    async getAllImages(req, res) {
        imageModel.getAll((error, result) => {
            if (error) {
                res.status(500).json({ message: "Internal Server Error!" });
            }
            res.status(200).json({ result })
        })
    }

    async insertImage(req, res) {
        try {
            const image = req.file; // Using singular 'image' since it's a single file
            const product_id = req.body.product_id;
            const id = uuidv4();

            if (!image) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const imgPath = generateFilename(image.path)

            const data = [
                id, product_id, imgPath
            ]

            // Assuming imageModel.insert returns a promise
            const result = await imageModel.insert(data);

            res.status(200).json({ result });
        } catch (error) {
            console.error("Error inserting image:", error);
            res.status(500).json({ message: "Internal Server Error!" });
        }
    }
}

module.exports = new Controller();