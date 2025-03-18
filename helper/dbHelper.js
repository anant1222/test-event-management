const sequelize = require("../config/dbConnection"); // Adjust path to your sequelize instance

function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        sequelize
            .query(sql, {
                replacements: params, // Use params as replacements
                type: sequelize.QueryTypes.SELECT, // Specify query type
            })
            .then((results) => resolve(results))
            .catch((err) => reject(err));
    });
}

module.exports = query;
