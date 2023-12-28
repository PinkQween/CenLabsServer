const importAll = (r) => {
    let images = {};
    Object.keys(r).forEach((item) => { images[item.split('/').pop()] = r[item].default; });
    return images;
};

export default importAll(import.meta.globEager("../blogs/*"));