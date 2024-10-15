const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');




const app = express();
app.use(bodyParser.json());


app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  credentials: true, // Allow cookies if needed

}));

app.options('*', cors()); //cors still not working so trying with adding cors globally in options


const secretKey = process.env.JWT_SECRET; 

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'user_database'
});

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to Db');
});

// Register a new user
app.post('/register', cors(), async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(sql, [username, hashedPassword], (err) => {
    if (err) return res.status(500).send('Error registering user');
    res.status(201).send('User registered');
  });
});



// Authen ticate user and return JWT
app.post('/login', cors(), (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ?';

  db.query(sql, [username], async (err, results) => {
    if (err || results.length === 0) return res.status(400).send('Invalid credentials');
    
    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
    res.json({ token }) ;
  });
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(403).send('Access denied');


  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (err)  {
    res.status(403).send('Invalid token');
  }
};


app.get('/protected', verifyToken,  (req, res) => {
  res.send('');
});

app.listen(3001, () =>  {
  console.log('Server is listening on port 3001');
});
