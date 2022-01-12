const express = require("express");
const { sequelize, Users, Movies, Screenings } = require("../models");
const jwt = require("jsonwebtoken");
const screenings = require("../models/screenings");
const e = require("express");
require("dotenv").config();

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401).json({ msg: err });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ msg: err });

    req.user = user;

    next();
  });
}

route.use(authToken);

route.get("/users", (req, res) => {
  Users.findAll()
    .then((rows) => res.json(rows))
    .catch((err) => res.status(500).json(err));
});

route.put("/users/:id", (req, res) => {
  usr_id = req.params.id;

  Users.findOne({ where: { id: req.user.id } })
    .then((usr) => {
      if (usr.role == "admin") {
        Users.findOne({ where: { id: usr_id } })
          .then((rows) => {
            if (rows.role == "admin") {
              msg = { msg: "role admin can not be changed" };
              res.json(msg);
            } else if (req.body.role != "") {
              rows.role = req.body.role;
              rows.save();
              res.json(rows);
            }
          })
          .catch((err) => res.status(500).json(err));
      } else {
        msg = { msg: "You are not admin" };
        res.json(msg);
      }
    })
    .catch((err) => res.status(500).json(err));
});

route.delete("/users/:id", (req, res) => {
  usr_id = req.params.id;
  Users.findOne({ where: { id: req.user.id } })
    .then((usr) => {
      if (usr.role == "admin") {
        Users.findOne({ where: { id: req.params.id } }).then((_user) => {
          if (_user.role != "admin") {
            Users.destroy({ where: { id: req.params.id } })
              .then((rows) => {
                res.json(rows);
              })
              .catch((err) => res.status(500).json(err));
          } else {
            msg = { msg: "Admin can not be deleted" };
            res.json(msg);
          }
        });
      } else {
        msg = { msg: "You are not admin" };
        res.json(msg);
      }
    })
    .catch((err) => res.status(500).json(err));
});

route.get("/movies", (req, res) => {
  Movies.findAll()
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => res.status(500).json(err));
});

route.get("/screenings/:movieId", (req, res) => {
  movie_id = req.params.movieId;
  Movies.findOne({ where: { id: movie_id } })
    .then((rows) => res.json(rows))
    .catch((err) => res.status(500).json(err));
});

route.delete("/movies/:id", (req, res) => {
  Users.findOne({ where: { id: req.user.id } })
    .then((usr) => {
      if (usr.role == "admin") {
        Movies.destroy({ where: { id: req.params.id } })
          .then((rows) => {
            Screenings.destroy({ where: { movieId: req.params.id } }).then(
              (sc) => {
                if (sc) {
                  Screenings.destroy({ where: { movieId: req.params.id } })
                    .then((rows) => res.json(rows))
                    .catch((err) => res.status(500).json(err));
                } else {
                  res.json(rows);
                }
              }
            );
          })
          .catch((err) => res.status(500).json(err));
      } else {
        msg = { msg: "You don't have premissionn" };
        res.json(msg);
      }
    })
    .catch((err) => res.status(500).json(err));
});

route.delete("/screenings/:id", (req, res) => {
  Users.findOne({ where: { id: req.user.id } })
    .then((usr) => {
      if (usr.role == "customer") {
        msg = { msg: "You don't have premission to delete screening" };
        res.json(msg);
      } else {
        Screenings.destroy({ where: { id: req.params.id } })
          .then((rows) => res.json(rows))
          .catch((err) => res.status(500).json(err));
      }
    })
    .catch((err) => res.status(500).json(err));
});

route.put("/movies/:id", (req, res) => {
  Users.findOne({ where: { id: req.user.id } })
    .then((usr) => {
      if (usr.role == "customer") {
        msg = { msg: "you don't have premission" };
        res.json(msg);
      } else {
        Movies.findOne({ where: { id: req.params.id } })
          .then((mov) => {
            if (req.body.name != "") {
              mov.name = req.body.name;
            }
            if (req.body.genre != "") {
              mov.genre = req.body.genre;
            }
            if (req.body.actors != "") {
              mov.actors = req.body.actors;
            }
            if (req.body.producer != "") {
              mov.producer = req.body.producer;
            }
            if (req.body.timeDuration != "") {
              mov.timeDuration = req.body.timeDuration;
            }
            if (req.body.releaseYear != "") {
              mov.releaseYear = req.body.releaseYear;
            }
            mov.save();
            res.json(mov);
          })
          .catch((err) => res.status(500).json(err));
      }
    })
    .catch((err) => res.status(500).json(err));
});

route.put("/screenings/:id", (req, res) => {
  scId = req.params.id;
  Users.findOne({ where: { id: req.user.id } })
    .then((usr) => {
      if (usr.role == "customer") {
        msg = { msg: "you don't have premission" };
        res.json(msg);
      } else {
        Screenings.findOne({ where: { id: scId } })
          .then((rows) => {
            date = req.body.date;
            day = req.body.day;
            time = req.body.time;
            if (date != "") {
              rows.date = req.body.date;
            }
            if (day != "") {
              rows.day = req.body.day;
            }
            if (time != "") {
              rows.time = req.body.time;
            }
            rows.save();
            res.json(rows);
          })
          .catch((err) => res.status(500).json(err));
      }
    })
    .catch((err) => res.status(500).json(err));
});

route.get("/screenings", (req, res) => {
  Screenings.findAll()
    .then((rows) => res.json(rows))
    .catch((err) => res.status(500).json(err));
});

route.post("/screenings", (req, res) => {
  Users.findOne({ where: { id: req.user.id } })
    .then((usr) => {
      if (usr.role == "customer") {
        msg = { msg: "You don't have premission to add screenings" };
        res.json(msg);
      } else {
        Movies.findOne({ where: { id: req.body.id } })
          .then((movie) => {
            if (movie) {
              const obj = {
                date: req.body.date,
                day: req.body.day,
                time: req.body.time,
                movieId: movie.id,
                movieName: movie.name,
              };
              Screenings.create(obj)
                .then((rows) => {
                  res.json(rows);
                })
                .catch((err) => res.status(501).json(err));
            } else {
              res.status(403).json({ msg: "Invalid credentials" });
            }
          })
          .catch((err) => res.status(500).json(err));
      }
    })
    .catch((err) => res.status(500).json(err));
});

route.post("/movies", (req, res) => {
  const obj = {
    name: req.body.name,
    genre: req.body.genre,
    actors: req.body.actors,
    producer: req.body.producer,
    timeDuration: req.body.timeDuration,
    releaseYear: req.body.releaseYear,
  };

  Users.findOne({ where: { id: req.user.id } })
    .then((usr) => {
      if (usr.role == "customer") {
        msg = { msg: "You don't have premission to add Movies" };
        res.json(msg);
      } else {
        Movies.create(obj)
          .then((rows) => {
            res.json(rows);
          })
          .catch((err) => res.status(500).json(err));
      }
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = route;
