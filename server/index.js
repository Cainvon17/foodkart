const express = require("express"); //imports the framework
const app = express(); // creats server object
const cors = require("cors"); //CORS allows your frontend (React / browser) to call this backend.
                            // Without this, browser will block API calls.
const pool = require("./database.js"); //imp psql connection pool, so the server can talk to db.
//middle ware
app.use(cors());
app.use(express.json()); //Allows Express to read JSON data sent in request body.
//login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2", 
      [username, password]
    );
 
    if (result.rows.length > 0) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }

  } catch (err) {
    console.error("SERVER ERROR:", err.message);
    res.status(500).send("Server Error");
  }
});
app.listen(5000,() => {
    console.log("Server Running on 5000");
});

//routes 
//menu 
app.get('/menu', async(req,res) => {
    try {
        const result = await pool.query('SELECT * FROM menu');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

//place order
app.post('/orders', async(req,res) => {
    const { name, total, items } = req.body;
    try {
        const result = await pool.query('INSERT INTO orders(cname,tamt,status,items) VALUES($1, $2, $3, $4) RETURNING *',[name, total, 'Pending', JSON.stringify(items)]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }

});
//admin 
//get all orders
app.get('/orders', async(req,res) =>{
    try {
        const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');

    }
});
//update a order status

app.put('/orders/:id', async(req,res) => {
    const { status } = req.body; // Frontend sends: { status: "Delivered" }
    const { id } = req.params;
    try {
        const result = await pool.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',[status, id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});