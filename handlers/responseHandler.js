
function sendResponse(res, message, data = null, success = true) {
    const response = {
      message: message,
      success: success,
      data: data
    };
    res.status(200).json(response);
  }
  
  module.exports = {
    sendResponse
  };
  