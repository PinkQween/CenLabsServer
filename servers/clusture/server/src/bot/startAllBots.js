module.exports = (exclude = []) => {
    if (!exclude.includes('discord')) {
        require('./discord')
    }
}