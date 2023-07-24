const express = require("express");
const mysql = require("mysql");
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sams",
});

const app = express();
app.use(express.static("public"));
// middleware
app.use(express.urlencoded({ extended: false })); // supply req.body object with form data
// server static files in expres
const port = process.env.port || 3003;

app.get("/", (req, res) => {
  conn.query("SELECT * FROM students", (sqlerr1, students) => {
    if (!sqlerr1) {
      // continue
      conn.query("SELECT * FROM teachers", (sqlerr2, teachers) => {
        if (sqlerr2) {
          res.send("Database Error Occured");
        } else {
          console.log(students);
          console.log(teachers);
          res.render("home.ejs", { students: students, teachers: teachers });
        }
      });
    } else {
      res.send("Database Error Occured");
    }
  });
});

app.get("/anonymous", (req, res) => {
  conn.query("SELECT COUNT(reg_no) as num FROM students", (sqlerr, dataOne) => {
    if (sqlerr) {
      console.log(sqlerr);
    }
    conn.query(
      "SELECT COUNT(reg_no) as numm FROM student_attendance WHERE DAY(time_stamp) = 11 AND (type = 'SpecialIN' OR type = 'NormalIN')",
      (errr, dataTwo) => {
        if (errr) {
          console.log(errr);
        }
        // console.log(dataTwo);
        res.render("home.ejs", {
          numberOfStudents: dataOne[0].num,
          presentStudents: dataTwo[0].numm,
        });
      }
    );
  });
});

app.get("/news/sports/epl-transfers", (req, res) => {
  // sports route
  console.log("sports route requested");
  res.status(200);
  //   res.send("Sports route in the server responding!!!");
  res.render("blog.ejs");
});

app.get("/newStaff", (req, res) => {
  res.render("newTeacher.ejs");
});
app.get("/newStudent", (req, res) => {
  res.render("newStudent.ejs");
});

app.post("/addStudent", (req, res) => {
  // save the data to db
  console.log(req.body);
  // redirect user to home/root route
  conn.query(
    "INSERT INTO students(reg_no,fullname,class) VALUES(?,?,?)",
    [Number(req.body.reg), req.body.name, Number(req.body.class)],
    (sqlerror) => {
      if (sqlerror) {
        console.log(sqlerror);
        res.send("A Db error occurered while saving new student");
      } else {
        res.redirect("/");
      }
    }
  );
});

// newStudent
// app.post("", () => {});

// enviroment variables --- show how to use .env in a node project
// truthy and falsy values
// http status codes

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("App is running and listening on port 3003");
  }
});
