const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); 
const dbHelper = require('../helper/dbHelper');
const responseHandler = require('../handlers/responseHandler');
const errorMessages = require('../config/errorMessages.json');
const successMessages = require('../config/successMessages.json');
const requestParams = require('../config/requestParams.json');
const nativeQueries = require('../config/nativeQueries');
const requestParamsHandler = require('../handlers/requestParamsHandler.js');
const User = require('../models/user.js');
const jwtHelper = require('../helper/jwtHelper');
const removeKeys = require('../handlers/filterHandler.js')

async function signup(req, res) {
  try {
    const reqParams = req.body;
    await requestParamsHandler.validateNew(Object.keys(reqParams), requestParams.userSignup);

    let existingUser = await User.findOne({
      where: {
        email : reqParams.email
      }
    });
    existingUser = existingUser?.dataValues
    if (existingUser) {
      return responseHandler.sendResponse(res, errorMessages.emailExists, null, false);
    }

    const hashedPassword = await bcrypt.hash(reqParams.password, 10);
    const uniqueId = uuidv4();
    const role = reqParams.role || 'USER'; 

    let user = await User.create({
        uniqueId,
        email: reqParams.email,
        password: hashedPassword,
        name: reqParams.name,
        role
      });
      user = user.dataValues
      user = removeKeys.removeKeys(user, ["password", "id"])
      const token = jwtHelper.createToken({ id: user.id, email: user.email });
      user.token = token
      responseHandler.sendResponse(res, successMessages.userRegistered, user);
  } catch (err) {
    console.error('Error during signup:', err);
    responseHandler.sendResponse(res,  'An error occurred during signup', null, false);
  }
}

module.exports = { signup };
