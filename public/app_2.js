document.addEventListener('DOMContentLoaded', function() {
  fetch('/activities')
    .then(response => response.json())
    .then(data => {
      const list = document.getElementById('activity-list');
      data.forEach(activity => {
        const item = document.createElement('li');

        // 创建复选框
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = activity.ActivityID; // 假设每个活动有唯一的 ID

        // 添加事件监听器
        checkbox.addEventListener('change', (event) => {
          if (event.target.checked) {
            // 复选框被选中，发送数据到后端
            fetch('/recordActivity', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userID: 1, // 需要替换为实际的用户 ID
                activityID: activity.ActivityID,
                points: activity.RewardPoints
              })
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
          }
        });

        item.appendChild(checkbox);
        item.appendChild(document.createTextNode(` ${activity.Name} - 奖励积分: ${activity.RewardPoints}`));
        list.appendChild(item);
      });
    })
    .catch(error => console.error('Error:', error));
});
