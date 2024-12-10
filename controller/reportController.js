const columnRenamer = require('../middlewares/columnRenamer');
const { v4: uuidv4 } = require('uuid');
const reportModel = require('../model/reportModel');
const { generateFilename } = require('../middlewares/multer');

class Controller {
    async getData(req, res) {
        try {
            const result = await reportModel.getData()
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error!' });
        }
    }
    async deleteData(req, res) {
        const id = req.params.id;
        try {
            const result = await reportModel.deleteData(id);
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error: error })
        }
    }

    async insertData(req, res) {
        const { pid, uid, message } = req.body;
        const files = req.files;

        if (!message || !files) {
            return res.json(500).json({ message: "All input is required!" })
        }
        let images = [];

        files.forEach(file => {
            if (file.mimetype === 'application/octet-stream' && file.buffer) {
                const fileName = uuidv4() + '.jpg';
                fs.writeFileSync(path.join(__dirname, 'uploads', fileName), file.buffer);
                images.push(fileName);
            } else {
                images.push(file.filename);
            }
        });


        const data = [uuidv4(), pid, uid, message, images.join(',')]; // Join array into a single string if storing in one column

        try {
            const result = await reportModel.insertData(data);
            res.status(200).json({ message: "Data successfully inserted", result: result });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error: error });
        }
    }


}

module.exports = new Controller();
