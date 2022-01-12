const express = require("express");
const { sequelize, Users } = require("./models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();

var corsOptions = {
  origin: "http://127.0.0.1:8000",
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

app.post("/register", (req, res) => {
  const obj = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: bcrypt.hashSync(req.body.password, 10),
  };

  Users.create(obj)
    .then((rows) => {
      const usr = {
        id: rows.id,
        name: rows.name,
        role: rows.role,
      };

      const token = jwt.sign(usr, process.env.ACCESS_TOKEN_SECRET);

      res.json({ token: token });
    })
    .catch((err) => res.status(500).json(err));
});

app.post("/login", (req, res) => {
  Users.findOne({ where: { name: req.body.name } })
    .then((usr) => {
      if (bcrypt.compareSync(req.body.password, usr.password)) {
        const obj = {
          id: usr.id,
          name: usr.name,
          type: usr.type,
        };
        const token = jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET);
        res.json({ token: token });
      } else {
        res.status(400).json({ msg: "Invalid credentials" });
      }
    })
    .catch((err) => {
      res.status(400).json({ msg: "Invalid credentials" });
    });
});

app.listen({ port: 9000 }, async () => {
  await sequelize.authenticate();
});
