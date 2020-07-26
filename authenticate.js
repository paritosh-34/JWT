const { sign, verify } = require("jsonwebtoken");
const secret = process.env.SECRET_SIGNATURE;
if (!secret) throw new Error("Secret not set!");

const authenticate = (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!authorization) throw new error("Not authorized");

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token);
    console.log(payload);
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: error });
  }
};

const generate = (user) => {
  if (!user) throw new Error("No user found.");

  return sign({ userId: user.id }, secret, {
    expiresIn: "15m",
  });
};

exports.authenticate = authenticate;
exports.generate = generate;
