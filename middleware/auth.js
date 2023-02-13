const jwt = require("jsonwebtoken");

const JWT_SECRET = "shhhhh";

const auth = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authorize using a valid token!" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ error: "Please authorize using a valid token!" });
  }
};

module.exports = auth;
