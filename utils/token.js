const jwt = require("jsonwebtoken");

const getTokenFrom = (req) => {
  console.log(req.get("cookie"));
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
  let token = getTokenFrom(req);
  if (token) {
    token = token.substr(4);
    let decodedToken = jwt.verify(token, process.env.SECRET);
    return decodedToken;
  } else {
    return null;
  }
};

module.exports = { getTokenFrom, getDecodedToken };
