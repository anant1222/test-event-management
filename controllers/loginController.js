const bcrypt = require('bcryptjs');
const dbHelper = require('../helper/dbHelper');
const responseHandler = require('../handlers/responseHandler');
const jwtHelper = require('../helper/jwtHelper');
var successMessages = require('../config/successMessages.json');
const nativeQueries = require('../config/nativeQueries');
var errorMessages = require('../config/errorMessages.json');
const requestParamsHandler = require('../handlers/requestParamsHandler.js');
const requestParams = require('../config/requestParams.json');
const User = require('../models/user.js');

async function login(req, res) {
  try {
    const reqParams = req.body;
    await requestParamsHandler.validateNew(Object.keys(reqParams), requestParams.userLogin);

    // Check if user exists
    let user = await User.findOne({
      where: {
        email : reqParams.email
      }
    });
    user = user.dataValues
    if (!user) {
      return responseHandler.sendResponse(res, errorMessages.invalidEmailOrPassword, null, false);
    }
    if(user.role.toUpperCase() != reqParams.type.toUpperCase()){
      return responseHandler.sendResponse(res, errorMessages.invalidType, null, false);
    }
    const userRecord = user;
    // Compare password
    const isMatch = await bcrypt.compare(reqParams.password, userRecord.password);

    if (!isMatch) {
      return responseHandler.sendResponse(res, errorMessages.invalidEmailOrPassword, null, false);
    }

    // Generate JWT token
    const token = jwtHelper.createToken({ id: userRecord.id, email: userRecord.email });
    
    response = {
      name : user.name,
      email: user.email,
      token: token
    }
    responseHandler.sendResponse(res, successMessages.loginSuccess, response);
  } catch (err) {
    console.error('Error during login:', err.message);
    responseHandler.sendResponse(res, 'An error occurred during login', null, false);
  }
}

module.exports = {
  login
};
