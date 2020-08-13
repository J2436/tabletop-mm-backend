const jwt = require("jsonwebtoken");

const getTokenFrom = (req) => {
  if (req.get("cookie") === undefined) {
    return null;
  }

  const cookies = req.get("cookie").split(";");
  let token = "";
  cookies.forEach((cookie) => {
    if (cookie.indexOf("jwt") >= 0) {
      token = cookie;
    } else {
      return null;
    }
  });
  return token.substr(4);
};

module.exports = { getTokenFrom };
