const { sign, verify } = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  console.log(token);
  next();
};

const generate = (user) => {
  if (!user) throw Error("No user found.");
  return sign({ userId: user.id }, "asdfasdfasdfasdfasdfasdf", {
    expiresIn: "15m",
  });
};

exports.authenticate = authenticate;
exports.generate = generate;
