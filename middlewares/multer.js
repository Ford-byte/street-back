const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the directory where the files will be stored
        // const uploadDir = path.join(__dirname, 'uploads');
        // Ensure the upload directory exists
        // fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        // Generate a unique filename
        const filename = generateFilename(file.originalname);
        cb(null, filename);
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

// Function to generate a unique filename
function generateFilename(originalname) {
    const generatename = Math.round(Math.random() * 1e9);
    const extensionname = originalname.split('.').pop();
    return `${generatename}.${extensionname}`;
}

// Function to handle file upload with multer
function handleFileUpload(req, res, next) {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        // File is uploaded successfully
        res.send('File uploaded successfully');
    });
}

function handleMultipleFileUpload(req, res, next) {
    upload.array('files', 10)(req, res, (err) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.send('Files uploaded successfully');
    });
}


module.exports = {
    handleFileUpload,
    handleMultipleFileUpload,
    upload,
    generateFilename
};



// const fs = require('fs');
// const path = require('path');
// const multer = require('multer');
// const sanitize = require('sanitize-filename');

// // Ensure the upload directory exists
// const uploadDir = path.join(__dirname, 'public/images');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Multer storage configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, uploadDir),
//     filename: (req, file, cb) => {
//         const safeName = sanitize(file.originalname);
//         const uniqueName = `${Math.round(Math.random() * 1e9)}.${safeName.split('.').pop()}`;
//         cb(null, uniqueName);
//     }
// });

// // File filter and size limit
// const upload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//         if (allowedTypes.includes(file.mimetype)) cb(null, true);
//         else cb(new Error('Unsupported file type'), false);
//     },
//     limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// });

// function handleFileUpload(req, res) {
//     upload.single('file')(req, res, (err) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.status(200).json({ message: 'File uploaded successfully', file: req.file });
//     });
// }

// function handleMultipleFileUpload(req, res) {
//     upload.array('files', 10)(req, res, (err) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.status(200).json({ message: 'Files uploaded successfully', files: req.files });
//     });
// }
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//     } else {
//         req.fileValidationError = 'Invalid file type';
//         cb(null, false);
//     }
// };


// module.exports = { handleFileUpload, handleMultipleFileUpload, upload,fileFilter };
