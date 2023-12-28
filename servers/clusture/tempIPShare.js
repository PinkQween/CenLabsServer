const temp = new Map()

const getTemp = () => {
    return temp;
}

const setTemp = (prop, prop2) => {
    return temp.set(prop, prop2);
}

const tempHas = (prop) => {
    return temp.has(prop);
}

const delateTemp = (prop) => {
    return temp.delete(prop)
}

module.exports = {
    temp
}