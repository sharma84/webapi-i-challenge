//implement your API here
//yarn add express
const express = require("express");
const db = require("./data/db.js"); //we can access data from db.js file
const server = express(); //call express to get server

//middleware
server.use(express.json());




//creating end point for every .GET request
server.get("/", (req, res) => {
  res.send("Hello World");
});




//listening
server.listen(9090, () => {
  console.log("listening on port 9090");
});





//CRUD

//create/post - Creates a user using the information sent inside the request body.
server.post("/api/users", (req, res) => {
  const user = req.body;
  //console.log("req body", req.body);
  db.insert(user)
    .then((user) => {
      if (user) {
        res.status(201).json(user); //If the information about the user is valid
      } else {
        res.status(400).json({
          err: "Please provide name and bio for the user." //If the request body is missing the name or bio property
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        err: "There was an error while saving the user to the database" //If there's an error while saving the user
      });
    });
});




//read/get - Returns an array of all the user objects contained in the database.
server.get("/api/users", (req, res) => {
  db.find()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(500).json({
        err: "The users information could not be retrieved." //If there's an error in retrieving the users from the database
      });
    });
});

//works without 404
//update - Updates the user with the specified id using data from the request body. Returns the modified document, NOT the original.
// server.put("/api/users/:id", (req, res) => {
//   const { id } = req.params;
//   const changes = req.body;
//   //console.log("req body", req.body);
//   db.update(id, changes)
//     .then((user) => {
//         if (user) {
//             res.status(200).json(user);
//         } else {
//             res
//             .status(400)
//             .json({ err: "Please provide name and bio for the user." });
//         }
        
//     })
//     .catch((err) => {
//       res.status(500).json({
//         err: "The user information could not be modified."
//       });
//     });
// });



//with 404 status code
server.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    db.update(id, changes)
    .then((user) => {
                if(!user.id) {
                    res
                    .status(404)
                    .json({ err: "The user with the specified ID does not exist." });
                }else {
                    res.status(200).json(user); }
            if(!user) {
                res
                .status(400)
                .json({ err: "Please provide name and bio for the user." });
            } else {
                res.status(200).json(user); 
            }})
.catch((err) => {
    res.status(500).json({
      err: "The user information could not be modified."
    });

  });
});








//delete - Removes the user with the specified id and returns the deleted user.
server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  //console.log(req.params);
  db.remove(id)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res
          .status(404)
          .json({ err: "The user with the specified ID does not exist" }); //If the user with the specified id is not found
      }
    })
    .catch((err) => {
      res.status(500).json({
        err: "The user could not be removed" //If there's an error in removing the user from the database
      });
    });
});



