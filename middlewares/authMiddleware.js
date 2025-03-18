const jwtHelper = require('../helper/jwtHelper');
const responseHandler = require('../handlers/responseHandler');

function authenticate(req, res, next) {
  // Get the token from the request header
  const token = req.headers['token'];

  // Check if the token is provided
  if (!token) {
    return responseHandler.sendResponse(res, 'No token provided', null, false);
  }

  // Verify the token
  const decoded = jwtHelper.verifyToken(token);

  // If the token is invalid or expired, return an unauthorized response
  if (!decoded) {
    return responseHandler.sendResponse(res, 'Unauthorized access', null, false);
  }

  // Token is valid, proceed with the request
  req.user = decoded; // Attach the decoded token to the request object
  next();
}

module.exports = { authenticate };

