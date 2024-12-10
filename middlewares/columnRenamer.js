const capitalize = (str) => {
    if (typeof str !== 'string') return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const columnRenamer = (objects) => {
    if (!Array.isArray(objects)) {
        throw new Error('Input must be an array of objects');
    }

    return objects.map(item => {
        if (typeof item !== 'object' || item === null) {
            throw new Error('Each item in the array must be an object');
        }

        return Object.entries(item).reduce((acc, [key, value]) => {
            const capitalizedKey = capitalize(key);
            acc[`SW_${capitalizedKey}`] = value;
            return acc;
        }, {});
    });
};

module.exports = columnRenamer;
