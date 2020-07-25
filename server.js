require("dotenv").config();

const express = require("express");
const { authenticate, generate } = require("./authenticate");

const app = express();
app.use(express.json());

let users = [
  {
    id: 1,
    email: "batishparitosh2@gmail.com",
    password: "batishparitosh2@gmail.com",
    name: "Paritosh",
  },
  {
    id: 2,
    email: "paritoshbatish@gmail.com",
    name: "Batish",
  },
];

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const result = users.filter((item) => {
    if (item.email === email && item.password === password) return true;
  });

  if (result.length) {
    const accessToken = generate(result[0]);
    console.log(accessToken);
    return res.status(200).send({ accessToken: accessToken });
  }

  res.status(401).send({ err: "Unauthorized" });
});

app.get("/users", authenticate, (req, res) => {
  res.status(200).send(users);
});

app.listen(4000, () => console.log(`Listening on Port 3000`));
