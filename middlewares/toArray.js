const toArray = (data) => {
    const arrayData = [];
    data.forEach(e => {
        arrayData.push(e);
    });
    return arrayData;
}

module.exports = toArray;