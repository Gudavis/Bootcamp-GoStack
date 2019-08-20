const express = require("express");

const server = express();

server.use(express.json());

// Query params = ?nome="davis" -- (const nome = req.query.nome;)
// Route params = /users/1 -- (const { id } = req.params;)
// Request body = {name: "Davis", email: "gustavo.davis@"}

// CRUD - Create, Read, Update, Delete

const users = ["Sil", "Gustavo", "Theo"];

// Middleware Global sempre será executado independente da rota
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

// Middleware local é aplicado diretamente na rota

// Verifica se o nome do usuário foi digitado
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

// Verifica se o usuário existe no array

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User doesn't exists" });
  }

  req.user = user;

  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put("/users/:index", checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send("Removido com sucesso");
});

// localhost:3000
server.listen(3000);
