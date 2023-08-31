// const http = require("http");
const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const mongoose = require("mongoose");

const PORT = 3000;
const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/node-1")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Mongo error", err));

// Scheme for MongoDB
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  job_title: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

// Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

app.get("/users", (req, res) => {
  const html = `
  <ul>
  ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
  </ul>
  `;
  res.send(html);
});

app.get("/api/users", (req, res) => {
  return res.json(users);
});
app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.job_title ||
    !body.gender
  ) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  const result = await User.create(
    {
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      gender: body.gender,
      job_title: body.job_title,
    },
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      return res.status(201).json({ message: "User Created" });
    }
  );
});

// If routes are same then we can write like this for multiple methods pointing to same route
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .post((req, res) => {
    return res.send("POST HTTP method on user resource");
  })
  .patch((req, res) => {
    return res.send("POST HTTP method on user resource");
  })
  .delete((req, res) => {
    return res.send("POST HTTP method on user resource");
  });

// :id is a route parameter and is dynamic and can be accessed via req.params
// app.get("/api/users/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const user = users.find((user) => user.id === id);
//   return res.json(user);
// });

// app.post("/api/users/:id", (req, res) => {
//   return res.send("POST HTTP method on user resource");
// });
// app.patch("/api/users/:id", (req, res) => {
//   return res.send("POST HTTP method on user resource");
// });
// app.delete("/api/users/:id", (req, res) => {
//   return res.send("POST HTTP method on user resource");
// });

app.listen(3000, () => console.log(`Server started on PORT ${PORT}`));

// const myServer = http.createServer(app);
// myServer.listen(3000, () => console.log("Listening on port 3000"));
