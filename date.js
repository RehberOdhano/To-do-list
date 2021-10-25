// console.log(module);

// module.exports = getDate;  // exports only getDate function
// it is an object so we can add or it can be bound to multiple properties and methods

// module.exports or exports both are equivalent
exports.getDate = function() {
    const today = new Date();

    // these are the options in which we want to format the date object
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    return today.toLocaleDateString("en-US", options);
}

exports.getDay = function() {
    const today = new Date();

    // these are the options in which we want to format the date object
    const options = {
        weekday: "long",
    };

    return today.toLocaleDateString("en-US", options);
}
