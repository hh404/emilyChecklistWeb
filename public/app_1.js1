document.addEventListener('DOMContentLoaded', function() {
  fetch('/activities')
    .then(response => response.json())
    .then(data => {
	console.log('ddddata:', data);
      const list = document.getElementById('activity-list');
      data.forEach(activity => {
        const item = document.createElement('li');
        item.textContent = `${activity.Name} - 奖励积分: ${activity.RewardPoints}`;
        list.appendChild(item);
      });
    })
    .catch(error => console.error('Error:', error));
});
