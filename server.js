const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

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

// 配置静态文件服务 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = 30031;
app.use(express.static('public'));
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


app.get('/', (req, res) => {
res.sendFile(__dirname + '/public/index.html'); 
});

// 假设 userID 是已知的，这里为了示例使用静态值
const userID = 1;

app.get('/activities', (req, res) => {
  const today = new Date().toISOString().slice(0, 10); // 获取今天的日期
  const sql = `
    SELECT a.ActivityID, a.Name, a.RewardPoints, 
           (SELECT COUNT(*) FROM UserActivities WHERE UserID = ? AND ActivityID = a.ActivityID AND CompletionDate = ?) AS CompletedToday
    FROM Activities a`;
  db.query(sql, [userID, today], (err, result) => {
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

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // 设置上传文件的存储目录

// ...之前的代码...

// 文件上传路由
app.post('/upload', upload.single('file'), (req, res) => {
if (req.file) {
// 获取文件信息
const { originalname, filename, mimetype, size } = req.file;
const filePath = req.file.path;
const activityID = req.body.activityID;
// 假设前端发送了活动ID
// 将文件信息插入数据库
const sql = 'INSERT INTO ActivityMedia (ActivityID, FilePath, FileType, UploadDate) VALUES (?, ?, ?, CURDATE())';
db.query(sql, [activityID, filePath, mimetype], (err, result) => {
if (err) {
console.error(err);
return res.status(500).send('Error saving file info');
}
res.json({
message: 'File uploaded and info saved', mediaID: result.insertId 
});
});
} else {
res.status(400).send('No file uploaded');
}
});

app.get('/getMedia', (req, res) => {
const activityID = req.query.activityID;
// 假设您有一个表来存储媒体文件的信息
const sql = 'SELECT * FROM ActivityMedia WHERE ActivityID = ?';
db.query(sql, [activityID], (err, result) => {
if (err) {
console.error(err);
res.status(500).send('Error fetching media files');
} else {
res.json(result);
// 发送媒体文件的信息
 }
 });
 });
