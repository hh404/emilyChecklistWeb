document.addEventListener('DOMContentLoaded', function() {
  const calendar = document.getElementById('calendar');
  const today = new Date().toISOString().slice(0, 10); // 获取今天的日期，格式为 'YYYY-MM-DD'
  calendar.value = today; // 设置日历的默认值为今天

  calendar.addEventListener('change', function() {
      const selectedDate = this.value;
      console.log('Selected date:', selectedDate);

      // 发送请求到服务器获取选择日期的checklist
      fetchActivities(selectedDate)
      .then(response => response.json())
      .then(data => {
          // 处理并显示这一天的checklist
          console.log(data);
          // 此处添加显示checklist的逻辑
      })
      .catch(error => console.error('Error:', error));
  });
  
  fetch('/api/userinfo') // 假设这是获取用户信息的API端点
  .then(response => response.json())
  .then(data => {
    document.getElementById('user-name').textContent += data.name;
    document.getElementById('user-age').textContent += data.age;
    document.getElementById('total-points').textContent += data.total_points;
    document.getElementById('special-points').textContent += data.special_points;
  })
  .catch(error => console.error('Error:', error));
  
    // 获取活动数据
    fetchActivities();
    /*fetch('/activities')
    .then(response => response.json())
    .then(data => {
        const list = document.getElementById('activity-list');
        data.forEach(activity => {
            const item = document.createElement('li');
            
            // 创建复选框
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = activity.ActivityID;
            
          // 创建显示完成时间的元素
          const completedTimeSpan = document.createElement('span');
          completedTimeSpan.id = `completed-time-${activity.ActivityID}`;
          // 检查活动是否已完成
          if (activity.CompletedToday > 0) {
            console.log("activity.CompletedToday",activity.ActivityID, "CompletionDateTime", activity.CompletionDateTime);
            checkbox.checked = true;
            checkbox.disabled = true;
            if (activity.CompletionDateTime) {
              completedTimeSpan.textContent = ` --[完成时间: ${formatTime(activity.CompletionDateTime)}]`;
            }
          }
          
            console.log('罗峰');
          
            // 添加复选框的事件监听器
            checkbox.addEventListener('change', (event) => {
                if (event.target.checked) {
                  fetch('/useractivities', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userID: 1, // 用户 ID
                      activityID: activity.ActivityID,
                      points: activity.basePoints
                    })
                  })
                  .then(response => response.json())
                  .then(data => {
                    checkbox.checked = true;
                    checkbox.disabled = true;
                    
                    if (data.newTotalPoints != null) {
                      // 更新页面上显示的总积分
                      document.getElementById('total-points').textContent = `总积分: ${data.newTotalPoints}`;
                    }
                    
                    if (data.completedTime) {
                      // 更新显示完成时间的元素
                      completedTimeSpan.textContent = `    --[完成时间: ${formatTime(data.completedTime)}]`;
                    }
                  })
                  .catch(error => console.error('Error:', error));
                }
            });
            console.log('巴巴塔');
            // 创建上传按钮
            const uploadButton = document.createElement('input');
            uploadButton.type = 'file';
            uploadButton.accept = 'image/*,video/*'; // 接受图片和视频文件
            uploadButton.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('activityID',activity.ActivityID);
                    
                    fetch('/upload', {
                    method: 'POST',
                    body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                      alert('File uploaded successfully!');
                      location.reload(); // 刷新页面
                    })
                    .catch(error => console.error('Error:', error));
                }
            });
            
            // 获取当前活动的媒体文件
            console.log('Sending request to /getMedia with activityID:', activity.ActivityID);
            fetch(`/getMedia?activityID=${activity.ActivityID}`)
            .then(response => {
                console.log('Response received');
                return response.json();
            })
            .then(mediaFiles => {
                console.log('Received media files:', mediaFiles);
                const mediaList = document.createElement('ul');
                mediaFiles.forEach(file => {
                    console.log('File name:', file.FilePath); // 打印文件名称
                  const mediaItem = document.createElement('li');
                  const mediaLink = document.createElement('a');
                  mediaLink.href = `#`;
                  mediaLink.textContent = file.FilePath;
                  
                  // 点击链接时显示 Popup
                  mediaLink.addEventListener('click', function(event) {
                    event.preventDefault(); // 阻止链接默认行为
                    showMediaPopup(`http://192.168.1.3:30031/${file.FilePath}`, file.FileType);
                  });
                  
                  mediaItem.appendChild(mediaLink);
                  mediaList.appendChild(mediaItem);
                });
                item.appendChild(mediaList);
            })
            .catch(error => console.error('Error:', error));
            
          
            item.appendChild(checkbox);
            item.appendChild(document.createTextNode(` ${activity.Name} - 奖励积分1: ${activity.basePoints}`));
          item.appendChild(completedTimeSpan); // 添加完成时间元素
            item.appendChild(uploadButton);
            list.appendChild(item);
            
        });
      
      // 显示媒体 Popup 的函数
      function showMediaPopup(mediaUrl, fileType) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#FFF';
        popup.style.padding = '20px';
        popup.style.zIndex = '1000';
        popup.style.border = '1px solid #CCC';
        popup.style.width = '80%'; // 调整弹出窗口的宽度
        popup.style.maxHeight = '80vh'; // 调整弹出窗口的最大高度
        popup.style.overflowY = 'auto'; // 添加滚动条
        
        if (fileType.startsWith('image/')) {
          const img = document.createElement('img');
          img.src = mediaUrl;
          img.style.maxWidth = '100%';
          img.style.display = 'block'; // 确保图片块级显示
          popup.appendChild(img);
        } else if (fileType.startsWith('video/')) {
          const video = document.createElement('video');
          video.src = mediaUrl;
          video.controls = true;
          video.style.maxWidth = '100%';
          video.style.display = 'block'; // 确保视频块级显示
          popup.appendChild(video);
        }
        
        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.display = 'block'; // 确保按钮块级显示
        closeButton.style.margin = '10px auto'; // 水平居中
        closeButton.addEventListener('click', function() {
          document.body.removeChild(popup);
        });
        popup.appendChild(closeButton);
        
        document.body.appendChild(popup);
      }

      function formatTime(dateTime) {
        const date = new Date(dateTime);
        let hours = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }
    })
    .catch(error => console.error('Error:', error));
});*/


function fetchActivities(selectedDate = '') {
  // 如果提供了日期，则将其添加到请求的查询字符串中
  const url = selectedDate ? `/activities?date=${selectedDate}` : '/activities';

  fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log("🤢🤢${activity.title}");
      const list = document.getElementById('activity-list');
      list.innerHTML = ''; // 清空现有的列表
      // 这里是创建和显示活动列表项的逻辑
      data.forEach(activity => {
          const item = document.createElement('li');
          
          // 创建复选框
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = activity.ActivityID;

        // 创建显示持续时间的标签
        const durationLabel = document.createElement('span');
        durationLabel.id = `duration-${activity.ActivityID}`;

      // 如果活动有持续时间，显示它
      if (activity.Duration > 0) {
        const duration = activity.Duration;
        const hours = Math.floor(duration / 3600); // 计算小时数
        const minutes = Math.floor((duration % 3600) / 60); // 计算分钟数
        const seconds = duration % 60; // 计算秒数
    
        durationLabel.textContent = `持续时间: ${hours}小时 ${minutes}分钟 ${seconds}秒`;
      }
        // 创建开始/结束按钮
        const timerButton = document.createElement('button');
        timerButton.textContent = '开始';
        //timerButton.style.marginLeft = 'auto'; // 右对齐按钮
        timerButton.onclick = () => toggleTimer(timerButton, durationLabel, "1", activity.ActivityID);
          
        // 创建显示完成时间的元素
        const completedTimeSpan = document.createElement('span');
        completedTimeSpan.id = `completed-time-${activity.ActivityID}`;
        // 检查活动是否已完成
        if (activity.CompletedToday > 0) {
          console.log("activity.CompletedToday",activity.ActivityID, "CompletionDateTime", activity.CompletionDateTime);
          checkbox.checked = true;
          checkbox.disabled = true;
          if (activity.CompletionDateTime) {
            completedTimeSpan.textContent = ` --[完成时间: ${formatTime(activity.CompletionDateTime)}]`;
          }
        }
        
          console.log('罗峰');
        
          // 添加复选框的事件监听器
          checkbox.addEventListener('change', (event) => {
              if (event.target.checked) {
                const durationValue = activity.Duration ? activity.Duration : 0;
                fetch('/useractivities', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userID: 1, // 用户 ID
                    activityID: activity.ActivityID,
                    points: activity.basePoints,
                    duration: durationValue // 添加duration参数
                  })
                })
                .then(response => response.json())
                .then(data => {
                  checkbox.checked = true;
                  checkbox.disabled = true;
                  
                  if (data.newTotalPoints != null) {
                    // 更新页面上显示的总积分
                    document.getElementById('total-points').textContent = `总积分: ${data.newTotalPoints}`;
                  }
                  
                  if (data.completedTime) {
                    // 更新显示完成时间的元素
                    completedTimeSpan.textContent = `    --[完成时间: ${formatTime(data.completedTime)}]`;
                  }
                })
                .catch(error => console.error('Error:', error));
              }
          });
          console.log('巴巴塔');
          // 创建上传按钮
          const uploadButton = document.createElement('input');
          uploadButton.type = 'file';
          uploadButton.accept = 'image/*,video/*'; // 接受图片和视频文件
          uploadButton.addEventListener('change', function(event) {
              const file = event.target.files[0];
              if (file) {
                  const formData = new FormData();
                  formData.append('file', file);
                  formData.append('activityID',activity.ActivityID);
                  
                  fetch('/upload', {
                  method: 'POST',
                  body: formData
                  })
                  .then(response => response.json())
                  .then(data => {
                    alert('File uploaded successfully!');
                    location.reload(); // 刷新页面
                  })
                  .catch(error => console.error('Error:', error));
              }
          });
          
          // 获取当前活动的媒体文件
          console.log('Sending request to /getMedia with activityID:', activity.ActivityID);
          fetch(`/getMedia?activityID=${activity.ActivityID}&date=${selectedDate}`)
          .then(response => {
              console.log('Response received');
              return response.json();
          })
          .then(mediaFiles => {
              console.log('Received media files:', mediaFiles);
              const mediaList = document.createElement('ul');
              mediaFiles.forEach(file => {
                  console.log('File name:', file.FilePath); // 打印文件名称
                const mediaItem = document.createElement('li');
                const mediaLink = document.createElement('a');
                mediaLink.href = `#`;
                mediaLink.textContent = file.FilePath;
                
                // 点击链接时显示 Popup
                mediaLink.addEventListener('click', function(event) {
                  event.preventDefault(); // 阻止链接默认行为
                  showMediaPopup(`http://192.168.1.3:30031/${file.FilePath}`, file.FileType);
                });
                
                mediaItem.appendChild(mediaLink);
                mediaList.appendChild(mediaItem);
              });
              item.appendChild(mediaList);
          })
          .catch(error => console.error('Error:', error));
          
          item.appendChild(checkbox);
          item.appendChild(document.createTextNode(`${activity.Name} - 可获得积分: ${activity.availablePoints}`));
          item.appendChild(completedTimeSpan); // 添加完成时间元素
          if (activity.ShowTimer) {
            item.appendChild(timerButton);
          }
          item.appendChild(durationLabel);
          item.appendChild(uploadButton);
          list.appendChild(item);
          
      });
    
    // 显示媒体 Popup 的函数
    function showMediaPopup(mediaUrl, fileType) {
      const popup = document.createElement('div');
      popup.style.position = 'fixed';
      popup.style.left = '50%';
      popup.style.top = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
      popup.style.backgroundColor = '#FFF';
      popup.style.padding = '20px';
      popup.style.zIndex = '1000';
      popup.style.border = '1px solid #CCC';
      popup.style.width = '80%'; // 调整弹出窗口的宽度
      popup.style.maxHeight = '80vh'; // 调整弹出窗口的最大高度
      popup.style.overflowY = 'auto'; // 添加滚动条
      
      if (fileType.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = mediaUrl;
        img.style.maxWidth = '100%';
        img.style.display = 'block'; // 确保图片块级显示
        popup.appendChild(img);
      } else if (fileType.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = mediaUrl;
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.display = 'block'; // 确保视频块级显示
        popup.appendChild(video);
      }
      
      // 添加关闭按钮
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.style.display = 'block'; // 确保按钮块级显示
      closeButton.style.margin = '10px auto'; // 水平居中
      closeButton.addEventListener('click', function() {
        document.body.removeChild(popup);
      });
      popup.appendChild(closeButton);
      
      document.body.appendChild(popup);
    }

    function formatTime(dateTime) {
      const date = new Date(dateTime);
      let hours = date.getHours().toString().padStart(2, '0');
      let minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    function fetchMedia(activityID, selectedDate) {
      const url = `/getMedia?activityID=${activityID}&date=${selectedDate}`;
      fetch(url)
      .then(response => response.json())
      .then(mediaFiles => {
          // 处理媒体文件
          console.log(mediaFiles);
      })
      .catch(error => console.error('Error:', error));
  }

  function toggleTimer(button, durationLabel, userID, activityID) {
    if (button.textContent === '开始') {
        button.textContent = '结束';
        durationLabel.startTime = Date.now(); // 记录开始时间
    } else {
        button.textContent = '开始';
        const endTime = Date.now();
        const durationMillis = endTime - durationLabel.startTime; // 持续时间（毫秒）
        const totalSeconds = Math.floor(durationMillis / 1000); // 总秒数
        const durationHours = Math.floor(durationMillis / 3600000); // 持续时间的小时部分
        const durationMins = Math.floor((durationMillis % 3600000) / 60000); // 持续时间的分钟部分
        const durationSecs = Math.floor((durationMillis % 60000) / 1000); // 持续时间的秒数部分

        durationLabel.textContent = ` 持续时间: ${durationHours}时 ${durationMins}分 ${durationSecs}秒`;

        // 发送持续时间到服务器
        // 注意：这里您可能需要考虑以何种形式发送数据（仅分钟，或分钟和秒）
       recordActivity(userID, activityID, totalSeconds);
    }
  }

  function recordActivity(userID, activityID, duration) {
    fetch('/recordActivity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userID: userID,
            activityID: activityID,
            duration: duration
        })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data); // 这里可以添加一些处理逻辑，例如显示一个提示信息
    })
    .catch(error => console.error('Error:', error));
}
  
  })
  .catch(error => console.error('Error:', error));
}
})