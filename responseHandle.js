const corsHeader = require("./corsHeader");

const successHandle = (res, data) => {
  res.writeHead(200, corsHeader);
  res.write(JSON.stringify({
    "status": "success",
    "data": data
  }));
  res.end();
};

const errorHandle = (res, statusCode, message) => {
  res.writeHead(statusCode, corsHeader);
  res.write(JSON.stringify({
    "status": "false",
    "message": message
  }));
  res.end();
};

module.exports = { successHandle, errorHandle };