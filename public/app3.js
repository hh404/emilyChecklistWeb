document.addEventListener('DOMContentLoaded', function() {
  // 获取活动数据
  fetch('/activities')
    .then(response => response.json())
    .then(data => {
      const list = document.getElementById('activity-list');
      data.forEach(activity => {
        const item = document.createElement('li');

        // 创建复选框
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = activity.ActivityID;

        // 检查活动是否已完成
        if (activity.CompletedToday > 0) {
          checkbox.checked = true;
          checkbox.disabled = true;
        }

        // 添加复选框的事件监听器
        checkbox.addEventListener('change', (event) => {
          if (event.target.checked) {
            fetch('/recordActivity', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userID: 1, // 用户 ID，需要根据实际情况调整
                activityID: activity.ActivityID,
                points: activity.RewardPoints
              })
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
          }
        });

        // 创建上传按钮
        const uploadButton = document.createElement('input');
        uploadButton.type = 'file';
        uploadButton.accept = 'image/*,video/*'; // 接受图片和视频文件
        uploadButton.addEventListener('change', function(event) {
          const file = event.target.files[0];
          if (file) {
            const formData = new FormData();
            formData.append('file', file);

            fetch('/upload', {
              method: 'POST',
              body: formData
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
          }
        });

        item.appendChild(checkbox);
        item.appendChild(document.createTextNode(` ${activity.Name} - 奖励积分: ${activity.RewardPoints}`));
        item.appendChild(uploadButton);
        list.appendChild(item);
      });
    })
    .catch(error => console.error('Error:', error));
});
