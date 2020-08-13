const jwt = require("jsonwebtoken");

module.exports = function TokenChecker(req, res, next) {
  if (req.user) next();

  if (req.get("cookie") === undefined) {
    res.send(401, "Unauthorized");
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

  token = token.substr(4);
  const user = jwt.verify(token, process.env.SECRET);
  if (user) {
    req.user = user;
    next();
  } else {
    res.send(401, "Unauthorized");
  }
};
