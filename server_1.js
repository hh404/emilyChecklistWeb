const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: '192.168.5.4',
  user: 'root',
  port: 3307,
  password: 'Hans_12345',
  database: 'emily'
});

db.connect((err) => {
  if (err) { throw err; }
  console.log('Connected to database');
});

const port = 30031;
app.use(express.static('public'));
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


app.get('/', (req, res) => {
res.sendFile(__dirname + '/public/index.html'); 
});

// 获取所有活动
app.get('/activities', (req, res) => {
  const sql = 'SELECT * FROM Activities';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// 用户完成活动
app.post('/useractivities', (req, res) => {
  const { userID, activityID } = req.body;
  const sql = 'INSERT INTO UserActivities (UserID, ActivityID, CompletionDate, PointsAwarded) VALUES (?, ?, CURDATE(), (SELECT RewardPoints FROM Activities WHERE ActivityID = ?))';
  db.query(sql, [userID, activityID, activityID], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Activity recorded', insertId: result.insertId });
  });
});


// 记录用户完成的活动
app.post('/recordActivity', (req, res) => {
const { userID, activityID, points } = req.body;
const sql = 'INSERT INTO UserActivities (UserID, ActivityID, CompletionDate, PointsAwarded) VALUES (?, ?, CURDATE(), ?)';
db.query(sql, [userID, activityID, points], (err, result) => {
if (err) {
console.error(err);
res.status(500).send('Error recording activity');
} else {
res.json({ message: 'Activity recorded', insertId: result.insertId });
}
});
});
// 其他路由...
