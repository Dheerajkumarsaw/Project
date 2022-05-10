const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value == "string" && value.trim().length === 0) return false
    // isletters(value)
    return true
};
const isletters = function (value) {
    const regx = /^[a-zA-Z]$/
    if (regx.test(value)) {
        return false
    } else {
        return true
    }
};
const isValidRegxDate = function (value) {
    const regx = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
    if (regx.test(value)) {
        return true
    } else {
        return false
    }
};
const isValidRegxISBN = function (value) {
    const regx = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
    if (regx.test(value)) {
        return true
    } else {
        return false
    }
};


module.exports = { isValid, isValidRegxDate, isValidRegxISBN, isletters }