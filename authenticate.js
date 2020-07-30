const { sign, verify } = require("jsonwebtoken");
const cookie = require("cookie");

const secret = process.env.SECRET_SIGNATURE;
const superSecret = process.env.SECRET_SECRET_SIGNATURE;
if (!secret) throw new Error("Secret not set!");
if (!superSecret) throw new Error("Super secret not set!");

const authenticate = (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!authorization) throw new error("Not authorized");

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, secret);
    console.log(payload, Date.now());
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: error });
  }
};

const authenticateRefreshToken = (req) => {
  const { jmc } = cookie.parse(req.headers.cookie);
  const payload = verify(jmc, superSecret);
  return payload;
};

const generate = (user) => {
  if (!user) throw new Error("Invalid Parameter");
  if (user.role !== "admin") throw new Error("Not Authorized");

  return sign({ userId: user.id, role: "admin" }, secret, {
    expiresIn: "15s",
  });
};

const generateRefreshToken = (user) => {
  if (!user) throw new Error("Invalid Parameter");
  if (user.role !== "admin") throw new Error("Not Authorized");

  return sign({ userId: user.id, role: "admin" }, superSecret, {
    expiresIn: "30s",
  });
};

exports.authenticate = authenticate;
exports.authenticateRefreshToken = authenticateRefreshToken;
exports.generate = generate;
exports.generateRefreshToken = generateRefreshToken;
