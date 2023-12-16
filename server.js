const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'Hans1234',
  database: 'emily'
});

db.connect((err) => {
  if (err) { throw err; }
  console.log('Connected to database');
});

// 配置静态文件服务
app.use('/attachments', express.static(path.join(__dirname, 'attachments')));

// multer 配置，以保存原始文件扩展名
/*const storage = multer.diskStorage({
destination: function (req, file, cb) {
    cb(null, 'uploads/');
},
filename: function (req, file, cb) {
    const date = new Date(); // 当前日期和时间
    const year = date.getFullYear(); // 年份，如 2020
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份，从 0 开始计数，所以加 1
    const day = String(date.getDate()).padStart(2, '0'); // 日期
    const uniqueSuffix = `${year}${month}${day}`; // 如 20200212
    const fileExtension = path.extname(file.originalname); // 获取文件扩展名
    const baseName = path.basename(file.originalname, fileExtension); // 获取不包含扩展名的文件名
    cb(null, `${baseName}-${uniqueSuffix}${fileExtension}`); // 组合新的文件名
}
});

const upload = multer({ storage: storage });*/
// 配置 multer 用于保存文件到 uploads 文件夹
const uploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: uploadStorage });

// 配置 multer 用于保存文件到 attachments 文件夹
const attachmentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'attachments/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const attachmentUpload = multer({ storage: attachmentStorage });

// 设置 multer 的存储配置
const emilyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'emily/');
  },
  filename: (req, file, cb) => {
      const newFileName = req.body.newFileName;
      if (newFileName) {
          cb(null, newFileName + path.extname(file.originalname));
      } else {
          cb(null, file.originalname);
      }
  }
});

const emilyUpload = multer({ storage: emilyStorage });

// 配置静态文件服务 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/emily', express.static(path.join(__dirname, 'emily')));

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
  // 获取查询参数中的日期，如果没有则默认为今天
  const queryDate = req.query.date || new Date().toISOString().slice(0, 10);

  // 获取用户的勤奋度
  const userDiligenceSql = 'SELECT diligence FROM Users WHERE UserID = ?';
  db.query(userDiligenceSql, [userID], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).send('Error fetching user diligence');
    }
    const userDiligence = results[0].diligence;
    const sql = `
    SELECT a.ActivityID, a.Name, a.basePoints, a.ShowTimer,
           ua.CompletionDateTime, ua.Duration,
           CASE WHEN DATE(ua.CompletionDateTime) = ? THEN 1 ELSE 0 END AS CompletedToday
    FROM Activities a
    LEFT JOIN UserActivities ua
    ON a.ActivityID = ua.ActivityID
    AND ua.UserID = ?
    AND DATE(ua.CompletionDateTime) = ?;
`;
    db.query(sql, [queryDate, userID, queryDate], (err, result) => {
      if (err) throw err;
      result.forEach(activity => {
        console.log(`activities ActivityID: ${activity.ActivityID}, CompletedToday: ${activity.CompletedToday}, duration: ${activity.Duration}`);
      });
      console.log('activities: ', result);
      //res.json(result);
      // 计算可获得积分
      const enrichedActivities = result.map(activity => {
        return {
          ...activity,
          availablePoints: activity.basePoints * userDiligence
        };
      });
      res.json(enrichedActivities);
    });
  });
});

// 用户完成活动
app.post('/useractivities', (req, res) => {
  const { userID, activityID, points } = req.body;
  console.log("ActivityID:", activityID, "Points:", points);

  // 开始数据库事务
  db.beginTransaction(err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error starting transaction');
    }

    // 第一步：记录活动完成
    const insertActivitySql = `
          INSERT INTO UserActivities (UserID, ActivityID, CompletionDateTime, PointsAwarded)
          VALUES (?, ?, NOW(), ?)
          ON DUPLICATE KEY UPDATE CompletionDateTime = NOW(), PointsAwarded = ?;
      `;
    let completedTime;
    db.query(insertActivitySql, [userID, activityID, points, points], (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error(err);
          res.status(500).send('Error recording activity');
        });
      }
      completedTime = new Date();
      // 第二步：更新用户总积分
      const updatePointsSql = 'UPDATE Users SET total_points = total_points + ? WHERE UserID = ?';
      db.query(updatePointsSql, [points, userID], (err, updateResult) => {
        if (err) {
          return db.rollback(() => {
            console.error(err);
            res.status(500).send('Error updating points');
          });
        }

        // 第三步：获取更新后的总积分
        const getNewTotalPointsSql = 'SELECT total_points FROM Users WHERE UserID = ?';
        db.query(getNewTotalPointsSql, [userID], (err, pointsResult) => {
          if (err) {
            return db.rollback(() => {
              console.error(err);
              res.status(500).send('Error fetching new total points');
            });
          }

          // 提交事务
          db.commit(err => {
            if (err) {
              console.error(err);
              return db.rollback(() => {
                res.status(500).send('Error during transaction commit');
              });
            }

            const newTotalPoints = pointsResult[0].total_points;
            res.json({
              message: 'Activity recorded and points updated',
              newTotalPoints: newTotalPoints, completedTime: completedTime.toISOString()
            });
          });
        });
      });
    });
  });
});


//app.post('/useractivities', (req, res) => {
//const { userID, activityID } = req.body;
//const sql = `
//  INSERT INTO UserActivities (UserID, ActivityID, CompletionDateTime, CompletionDateOnly, PointsAwarded)
//  VALUES (?, ?, NOW(), CURDATE(), (SELECT basePoints FROM Activities WHERE ActivityID = ?))
//  ON DUPLICATE KEY UPDATE CompletionDateTime = VALUES(CompletionDateTime);
//`;
//db.query(sql, [userID, activityID, activityID], (err, result) => {
//  if (err) throw err;
//  res.json({ message: 'Activity recorded', insertId: result.insertId });
//});
//});



// 记录用户完成的活动
app.post('/recordActivity', (req, res) => {
  const { userID, activityID, duration } = req.body;
  const currentDate = new Date().toISOString().slice(0, 10);

  // 首先，检查当前日期是否存在活动记录
  const checkSql = `
      SELECT UserActivityID FROM UserActivities 
      WHERE UserID = ? AND ActivityID = ? AND CompletionDateTime = CURDATE();
  `;

  db.query(checkSql, [userID, activityID], (checkErr, checkResults) => {
      if (checkErr) {
          console.error(checkErr);
          return res.status(500).send('检查现有活动时出错');
      }

      if (checkResults.length > 0) {
          // 如果存在，更新持续时间
          const updateSql = `
              UPDATE UserActivities 
              SET Duration = ? 
              WHERE UserActivityID = ?;
          `;
          db.query(updateSql, [duration, checkResults[0].UserActivityID], (updateErr, updateResults) => {
              if (updateErr) {
                  console.error(updateErr);
                  return res.status(500).send('更新活动持续时间时出错');
              }
              res.send('活动持续时间更新成功');
          });
      } else {
          // 如果不存在，插入新记录
          const insertSql = `
              INSERT INTO UserActivities (UserID, ActivityID, CompletionDateTime, Duration)
              VALUES (?, ?, CURDATE(), ?);
          `;
          db.query(insertSql, [userID, activityID, duration], (insertErr, insertResults) => {
              if (insertErr) {
                  console.error(insertErr);
                  return res.status(500).send('记录新活动时出错');
              }
              res.send('新活动记录成功，包含持续时间');
          });
      }
  });
});

// 其他路由...

// 文件上传路由
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    const { originalname, filename, mimetype, size } = req.file;
    const filePath = req.file.path;
    const activityID = req.body.activityID; // 假设前端发送了活动ID

    // 将文件信息插入数据库
    const sql = 'INSERT INTO ActivityMedia (ActivityID, FilePath, FileType, UploadDate) VALUES (?, ?, ?, CURDATE())';
    db.query(sql, [activityID, filePath, mimetype], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error saving file info');
      }
      res.json({ message: 'File uploaded and info saved', mediaID: result.insertId });
    });
  } else {
    res.status(400).send('No file uploaded');
  }
});

//app.get('/getMedia', (req, res) => {
//  const activityID = req.query.activityID;
//  console.log(`activityID = ${activityID}`);
//  // 假设您有一个表来存储媒体文件的信息
//  const sql = 'SELECT * FROM ActivityMedia WHERE ActivityID = ?';
//  db.query(sql, [activityID], (err, result) => {
//      if (err) {
//          console.error(err);
//          res.status(500).send('Error fetching media files');
//      } else {
//          console.log(`activityID = ${activityID}: result = ${JSON.stringify(result)}`);
//          res.json(result);
//          // 发送媒体文件的信息
//      }
//  });
//});
app.get('/getMedia', (req, res) => {
  const activityID = req.query.activityID;
  const queryDate = req.query.date || new Date().toISOString().slice(0, 10); // 如果未提供日期，则默认为今天

  console.log(`activityID = ${activityID}, queryDate = ${queryDate}`);

  const sql = 'SELECT * FROM ActivityMedia WHERE ActivityID = ? AND DATE(UploadDate) = ?';
  db.query(sql, [activityID, queryDate], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching media files');
    } else {
      console.log(`activityID = ${activityID}, queryDate = ${queryDate}: result = ${JSON.stringify(result)}`);
      res.json(result); // 发送指定日期的媒体文件信息
    }
  });
});



// 用户信息路由
app.get('/api/userinfo', (req, res) => {
  const sql = 'SELECT name, age, total_points, special_points FROM users WHERE UserID = ?';
  db.query(sql, [userID], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching user info');
    } else {
      // 假设我们只期待一个结果，因为UserID是唯一的
      if (results.length > 0) {
        const userInfo = results[0];
        res.json({
          name: userInfo.name,
          age: userInfo.age,
          total_points: userInfo.total_points,
          special_points: userInfo.special_points
        });
      } else {
        res.status(404).send('User not found');
      }
    }
  });
});

//app.post('/recordActivity', (req, res) => {
//const { userID, activityID } = req.body;
//// ...记录活动完成的逻辑...
//
//// 假设记录完成后，我们返回当前时间作为完成时间
//const completedTime = new Date();
//res.json({ completedTime: completedTime.toISOString() });
//});

app.post('/redeemPoints', (req, res) => {
  const { userID, exchangeType, pointsUsed, exchangedFor, specialPointsUsed = 0 } = req.body;

  // 开始数据库事务
  db.beginTransaction(err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error starting transaction');
    }
    console.log("检查用户是否有足够的积分");
    // 检查用户是否有足够的积分
    const checkPointsSql = 'SELECT total_points, special_points FROM Users WHERE UserID = ?';
    db.query(checkPointsSql, [userID], (checkErr, checkResults) => {
      if (checkErr || checkResults.length === 0) {
        return db.rollback(() => {
          console.error(checkErr);
          res.status(500).send('Error checking points');
        });
      }

      const userPoints = checkResults[0];
      if (userPoints.total_points < pointsUsed || userPoints.special_points < specialPointsUsed) {
        return db.rollback(() => {
          res.status(400).send('Not enough points');
        });
      }

      console.log("扣除普通积分和特别积分");
      // 扣除普通积分和特别积分
      const updatePointsSql = 'UPDATE Users SET total_points = total_points - ?, special_points = special_points - ? WHERE UserID = ?';
      db.query(updatePointsSql, [pointsUsed, specialPointsUsed, userID], (updateErr, updateResults) => {
        if (updateErr) {
          return db.rollback(() => {
            console.error(updateErr);
            res.status(500).send('Error updating points');
          });
        }
        console.log("扣除普通积分和特别积分end");
        // 记录兑换历史
        const insertExchangeSql = 'INSERT INTO PointExchanges (UserID, ExchangeType, PointsUsed, ExchangedFor, SpecialPointsUsed) VALUES (?, ?, ?, ?, ?)';
        db.query(insertExchangeSql, [userID, exchangeType, pointsUsed, exchangedFor, specialPointsUsed], (insertErr, insertResults) => {
          if (insertErr) {
            return db.rollback(() => {
              console.error(insertErr);
              res.status(500).send('Error recording exchange');
            });
          }

          // 提交事务
          db.commit(commitErr => {
            if (commitErr) {
              console.error(commitErr);
              return db.rollback(() => {
                res.status(500).send('Error during transaction commit');
              });
            }

            res.send('Exchange successful');
          });
        });
      });
    });
  });
});


app.get('/api/exchangeHistory', (req, res) => {
  const userID = req.query.userID; // 获取用户ID，应从请求中获取或通过认证系统确定

  const sql = `
      SELECT ExchangeType, PointsUsed, ExchangedFor, ExchangeDate
      FROM PointExchanges
      WHERE UserID = ?
      ORDER BY ExchangeDate DESC
  `;
  db.query(sql, [userID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching exchange history');
    }

    res.json(results);
  });
});

app.get('/api/dailyCheckOld', (req, res) => {
  const userID = req.query.userID;
  const today = new Date().toISOString().slice(0, 10);

  // ...检查用户今日完成的活动数量...

  if (completedActivities / totalActivities >= 0.8) {
    // 检查用户是否已经执行过本日检查
    const checkDailySql = 'SELECT LastDailyCheck FROM Users WHERE UserID = ?';
    db.query(checkDailySql, [userID], (checkDailyErr, checkDailyResults) => {
      if (checkDailyErr || checkDailyResults.length === 0) {
        console.error(checkDailyErr);
        return res.status(500).send('Error checking last daily check');
      }

      const lastDailyCheck = checkDailyResults[0].LastDailyCheck;
      if (lastDailyCheck === today) {
        return res.status(400).send('Daily check already performed today');
      }

      // 更新特别积分和最后一次日检查日期
      const updateSql = 'UPDATE Users SET special_points = special_points + 1, LastDailyCheck = ? WHERE UserID = ?';
      db.query(updateSql, [today, userID], (updateErr, updateResults) => {
        // ...更新逻辑...
      });
    });
  } else {
    res.json({ success: false });
  }
});

app.get('/api/dailyCheck', (req, res) => {
  const userID = req.query.userID;
  const today = new Date().toISOString().slice(0, 10);
  console.log("👹👹dailyCheck");
  // 第一步：查询用户今日完成的活动数量
  const countActivitiesSql = `SELECT COUNT(*) AS completedCount FROM UserActivities WHERE UserID = ? AND DATE(CompletionDateTime) = ?`;
  db.query(countActivitiesSql, [userID, today], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error querying completed activities');
    }

    // 完成的活动数量
    const completedActivities = results[0].completedCount;

    // 获取总活动数
    const totalActivitiesSql = 'SELECT COUNT(*) AS totalCount FROM Activities';
    db.query(totalActivitiesSql, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error querying total activities');
      }

      const totalActivities = results[0].totalCount;

      // 在此处继续您的逻辑，比如计算完成的活动比例等
      // 第二步：检查是否已经获得过特别积分
      if (completedActivities / totalActivities >= 0.8) {
        // 检查用户今天是否已经获得过特别积分
        const checkSpecialSql = "SELECT * FROM PointExchanges WHERE UserID = ? AND ExchangeType = 'Daily Check' AND DATE(ExchangeDate) = ?";
        db.query(checkSpecialSql, [userID, today], (checkSpecialErr, checkSpecialResults) => {
          if (checkSpecialErr) {
            console.error(checkSpecialErr);
            return res.status(500).send('Error checking special point award');
          }

          if (checkSpecialResults.length > 0) {
            // 如果今天已经增加过特别积分，则不再增加
            res.json({ success: false, message: 'Special point already awarded today' });
          } else {
            // 增加特别积分
            // 记录到 PointExchanges 表
            const insertExchangeSql = 'INSERT INTO PointExchanges (UserID, ExchangeType, PointsUsed, ExchangedFor, SpecialPointsUsed, ExchangeDate) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(insertExchangeSql, [userID, 'Daily Check', 0, '1 Special Point', 0, today], (insertErr, insertResults) => {
              if (insertErr) {
                console.error(insertErr);
                return res.status(500).send('Error recording exchange');
              }

              // 更新特别积分和最后一次日检查日期
              const updateSql = 'UPDATE Users SET special_points = special_points + 1, LastDailyCheck = ? WHERE UserID = ?';
              db.query(updateSql, [today, userID], (updateErr, updateResults) => {
                // ...更新逻辑...
                console.log(updateErr);
                res.json({ success: true, message: 'Special point awarded for daily check' });
              });
            });
          }
        });
      } else {
        res.json({ success: false, message: 'Not enough activities completed' });
      }
    });
  });
});

app.get('/api/homework', (req, res) => {
  const { date } = req.query; // 获取查询日期
  // SQL 查询获取该日期的作业
  const sql = 'SELECT * FROM Homeworks';
  db.query(sql, [date], (err, results) => {
    if (err) {
      return res.status(500).send('Error querying homework');
    }
    res.json(results);
  });
});


//const uploadHomeworkAttachment = multer({ dest: 'attachments/' }); // 设置附件上传目录

app.post('/api/uploadHomeworkAttachment', attachmentUpload.single('file'), (req, res) => {
  const { homeworkID } = req.body;
  const file = req.file;
  // SQL 插入附件信息
  const sql = 'INSERT INTO HomeworkAttachments (HomeworkID, FilePath, FileType, UploadDate) VALUES (?, ?, ?, NOW())';
  db.query(sql, [homeworkID, file.path, file.mimetype], (err, results) => {
    if (err) {
      return res.status(500).send('Error uploading attachment');
    }
    res.json({ message: "文件上传成功" });
  });
});

app.get('/api/getHomeworkAttachments', (req, res) => {
  const { homeworkID, date } = req.query;

  // SQL 查询获取指定日期的作业附件
  const sql = 'SELECT * FROM HomeworkAttachments WHERE HomeworkID = ? AND DATE(UploadDate) = ?';
  db.query(sql, [homeworkID, date], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching attachments');
    }
    res.json(results);
  });
});

const users = {
  'admin': { password: 'admin123', role: 'admin' },
  'user': { password: 'user123', role: 'user' }
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username].password === password) {
    const token = jwt.sign({ username, role: users[username].role }, 'secretKey');
    return res.json({ token });
  }
  res.status(401).send('Credentials are not valid');
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/emilyUpload', emilyUpload.single('file'), (req, res) => {
  const newFileName = req.body.newFileName;
  const originalPath = path.join(__dirname, 'emily', req.file.originalname);

  if (newFileName) {
    // 获取当前时间，格式化为 "年后两位月日时分"
    const now = new Date();
    const formattedTime = now.getFullYear().toString().slice(-2) + 
                          String(now.getMonth() + 1).padStart(2, '0') + 
                          String(now.getDate()).padStart(2, '0') + 
                          String(now.getHours()).padStart(2, '0') + 
                          String(now.getMinutes()).padStart(2, '0');

    const newPath = path.join(__dirname, 'emily', `${newFileName}-${formattedTime}${path.extname(req.file.originalname)}`);
    fs.rename(originalPath, newPath, (err) => {
      if (err) {
        console.error('重命名失败：', err);
        return res.status(500).send('重命名失败');
      }
      res.json({ message: '文件上传并重命名成功' });
    });
  } else {
    res.json({ message: '文件上传成功' });
  }
});
