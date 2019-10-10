const express = require('express'); // after installing via npm -i 
const hbs = require('hbs');
const path = require('path');
const sql = require('./utils/sql');

const port = process.env.PORT || 3000;
const app = express();
app.use(express.static('public')); // serves up the resource

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + "/views"));

app.get('/', (req, res) => {  
  res.render('home',{ homemessage: "hey there!", bio: "some generic bio information"}); // sends the information to the hbs to compile
})

// add users route
app.get('/users', (req, res) => {
  // get the user data when we hit this route

  // try a connection
  // if connection fails, log error(s) to the console and quit
  sql.getConnection((err, connection) => {
    if (err) {
      return console.log(err.message);
    }

    let query = "SELECT * FROM tbl_card"; // return back all of the information in the database

    sql.query(query, (err, rows) => {
      // we are done with our DB connection, so let someone else
      connection.release();

      // if something broke, quit and show error message
      if (err) { return console.log(err.message); }


      // show me that data!
      console.log(rows);

      res.render('users', rows[0]); //renders into the user view (on the website)
    })
  })
})

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
})