require("dotenv").config();

const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const {
  authenticate,
  generate,
  generateRefreshToken,
  authenticateRefreshToken,
} = require("./authenticate");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

let users = [
  {
    id: 1,
    email: "paritosh",
    password: "toshi",
    name: "Paritosh",
    role: "admin",
  },
];

let tokens = [
  {
    userId: 1,
    token: "",
  },
];

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const result = users.filter((item) => {
    if (item.email === email && item.password === password) return true;
  });

  if (result.length) {
    try {
      const accessToken = generate(result[0]);
      const refreshToken = generateRefreshToken(result[0]);

      return res
        .status(200)
        .cookie("jmc", refreshToken, {
          httpOnly: true,
          sameSite: true,
          expires: 0,
          // secure: true,
        })
        .send({ accessToken: accessToken });
    } catch (err) {
      console.log("-->", err);
      return res.status(401).send({ error: err });
    }
  }
});

app.get("/users", authenticate, (_req, res) => {
  res.status(200).send(users);
});

app.post("/dashboard", authenticate, (_req, res) => {
  res.send("Hi from dashboard API");
});

app.post("/transactions", authenticate, (_req, res) => {
  res.send("Hi from transactions API");
});

app.post("/users", authenticate, (_req, res) => {
  res.send("Hi from users API");
});

app.post("/groups", authenticate, (_req, res) => {
  res.send("Hi from groups API");
});

app.post("/request_refresh", (req, res) => {
  try {
    const result = authenticateRefreshToken(req);
    const accessToken = generate(result);
    const refreshToken = generateRefreshToken(result);

    return res
      .status(200)
      .cookie("jmc", refreshToken, {
        httpOnly: true,
        sameSite: true,
        expires: 0,
        // secure: true,
      })
      .send({ accessToken: accessToken });
  } catch (err) {
    return res.status(401).send({ error: err });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
