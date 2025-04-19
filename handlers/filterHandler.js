module.exports = {
    /**
     * Removes specified keys from an object.
     *
     * @param {Object} obj - The object from which keys need to be removed.
     * @param {string[]} keysToRemove - An array of keys to be removed from the object.
     * @returns {Object} - A new object with the specified keys removed.
     */
    removeKeys(obj, keysToRemove) {
        const newObj = { ...obj }; // Create a shallow copy of the object
        keysToRemove.forEach((key) => {
            delete newObj[key];
        });
        return newObj;
    },

    keepKeys(obj, keysToKeep) {
        const newObj = {}; // Create a new object to store the result
        keysToKeep.forEach((key) => {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = obj[key];
            }
        });
        return newObj;
    },
};
