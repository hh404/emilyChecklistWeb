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
			formData.append('activityID',activity.ActivityID);

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

// 动态创建媒体预览元素
function createMediaPreview(mediaFiles) {
const mediaContainer = document.createElement('div');
mediaFiles.forEach(file => {
if (file.FileType.startsWith('image/')) {
// 创建图片元素
const img = document.createElement('img');
img.src = `http://192.168.5.4:30031/uploads/640ef61372cf3e7d4fe211d3a2f1d400.png`;
// 根据实际存储路径调整
img.style.width = '100px';
// 或其他尺寸
mediaContainer.appendChild(img);
} else if (file.FileType.startsWith('video/')) {
// 创建视频元素
const video = document.createElement('video');
video.src = `192.168.5.4:30031/uploads/${file.FileName}`;
video.controls = true;
video.style.width = '200px';
// 或其他尺寸
mediaContainer.appendChild(video);
}
});
// 显示媒体容器
document.body.appendChild(mediaContainer);
// 或添加到其他指定的元素中 
}


        // 创建查看按钮
		console.log('chakan ActivityID', activity.ActivityID);
        const viewButton = document.createElement('button');
        viewButton.textContent = '查看';
        viewButton.addEventListener('click', function() {
          // 获取并显示当前活动的媒体文件
          fetch(`/getMedia?activityID=${activity.ActivityID}`)
          .then(response => response.json())
          .then(mediaFiles => {
            // 显示媒体文件的逻辑
			createMediaPreview(mediaFiles); // 创建媒体预览
            console.log(mediaFiles); // 这里只是打印文件列表，您可以添加显示图片和视频的逻辑
          })
          .catch(error => console.error('Error:', error));
        });

        item.appendChild(viewButton);
        list.appendChild(item);
      });
    })
    .catch(error => console.error('Error:', error));
});
