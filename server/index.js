const express = require("express"); //imports the framework
const app = express(); // creats server object
const cors = require("cors"); //CORS allows your frontend (React / browser) to call this backend.
                            // Without this, browser will block API calls.
const pool = require("./database.js"); //imp psql connection pool, so the server can talk to db.
//middle ware
app.use(cors());
app.use(express.json()); //Allows Express to read JSON data sent in request body.
//login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check ADMIN table (Use $1, $2)
    const adminSql = "SELECT * FROM users WHERE username = $1 AND password = $2";
    
    db.query(adminSql, [username, password], (err, adminResult) => {
        if (err) return res.json({ success: false, message: "DB Error" });

        const adminRows = adminResult.rows || adminResult; 

        if (adminRows.length > 0) {
            return res.json({ success: true, role: 'admin' });
        } else {
            const userSql = "SELECT * FROM login WHERE username = $1 AND password = $2";
            
            db.query(userSql, [username, password], (err, userResult) => {
                if (err) return res.json({ success: false, message: "DB Error" });
                
                const userRows = userResult.rows || userResult;

                if (userRows.length > 0) {
                    return res.json({ success: true, role: 'user' });
                } else {
                    return res.json({ success: false, message: "Invalid Credentials" });
                }
            });
        }
    });
});
// Register Route (For 'login' table)
app.post('/register', (req, res) => {
    // 1. Use $1, $2 instead of ?
    const sql = "INSERT INTO login (username, password) VALUES ($1, $2)";
    
    // 2. Simple array (No double brackets needed for Postgres single insert)
    const values = [
        req.body.username, 
        req.body.password
    ];

    // 3. Execute
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Postgres Error:", err);
            return res.json({ success: false, message: "Error registering" });
        }
        return res.json({ success: true, message: "User registered successfully" });
    });
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
    const { status } = req.body; 
    const { id } = req.params;
    try {
        const result = await pool.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',[status, id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});


app.post('/login', (req, res) => {
    const sentUsername = req.body.username;
    const sentPassword = req.body.password;

    //Check if they are an ADMIN 'users' table
    const adminSql = "SELECT * FROM users WHERE username = ? AND password = ?";
    
    pool.query(adminSql, [sentUsername, sentPassword], (err, adminData) => {
        if (err) return res.json({ success: false, message: "Database Error" });

        if (adminData.length > 0) {
            return res.json({ success: true, role: 'admin' });
        } else {
            const userSql = "SELECT * FROM login WHERE username = ? AND password = ?";
            
            db.query(userSql, [sentUsername, sentPassword], (err, userData) => {
                if (err) return res.json({ success: false, message: "Database Error" });

                if (userData.length > 0) {
                    return res.json({ success: true, role: 'user' });
                } else {
                    return res.json({ success: false, message: "Invalid Credentials" });
                }
            });
        }
    });
});