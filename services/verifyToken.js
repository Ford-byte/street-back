const verifyToken = (req, res) => {
    res.json({ valid: true, message: 'Authorized' });
}

module.exports = verifyToken;