const jwt = require("jsonwebtoken");

const getTokenFrom = (req) => {
  const cookies = req.get("cookie").split(";");
  let token = "";

  cookies.forEach((cookie) => {
    if (cookie.indexOf("jwt") >= 0) {
      token = cookie;
    } else {
      token = null;
    }
  });
  return token.substr(4);
};

const getDecodedToken = (req) => {
  const cookies = req.get("cookie").split(";");
  let token = "";

  cookies.forEach((cookie) => {
    if (cookie.indexOf("jwt") >= 0) {
      token = cookie;
    } else {
      token = null;
    }
  });
  if (token) {
    token = token.substr(4);
    let decodedToken = jwt.verify(token, process.env.SECRET);
    return decodedToken;
  } else {
    return null;
  }
};

const checkLoginToken = (req) => {};

module.exports = { getTokenFrom, getDecodedToken };
