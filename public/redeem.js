document.addEventListener('DOMContentLoaded', function() {
    fetchUserInfo();
    setupExchangeItems();
    setupViewExchangeHistoryButton();
    setupDailyCheckButton(); // 设置本日检查按钮
});


function setupDailyCheckButton() {
    const dailyCheckButton = document.createElement('button');
    dailyCheckButton.textContent = '本日检查';
    dailyCheckButton.id = 'daily-check-button';

    const now = new Date();
    const hour = now.getHours();

    // 晚上9点之后启用按钮
    if (hour >= 21) {
        dailyCheckButton.disabled = false;
    } else {
        dailyCheckButton.disabled = true;
    }

    dailyCheckButton.onclick = performDailyCheck;
    document.body.appendChild(dailyCheckButton);
}

function performDailyCheck() {
    const userID = 1; // 假设用户ID已知

    fetch(`/api/dailyCheck?userID=${userID}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('完成了80%的活动，已获得1个特别积分！');
        } else {
            alert(data.message);
        }
        fetchUserInfo(); // 更新显示的用户信息
    })
    .catch(error => console.error('Error:', error));

      // 标记为已点击，并禁用按钮
      localStorage.setItem('dailyCheckClicked', true);
      document.getElementById('daily-check-button').disabled = true;
}

function fetchUserInfo() {
    fetch('/api/userinfo')
    .then(response => response.json())
    .then(data => {
        document.getElementById('user-name').textContent = `用户名: ${data.name}`;
        document.getElementById('total-points').textContent = `总积分: ${data.total_points}`;
        document.getElementById('special-points').textContent = `特别积分: ${data.special_points}`;
    })
    .catch(error => console.error('Error:', error));
}

function setupExchangeItems() {
    const exchangeItems = [
        { name: "看电视", type: "minutes" },
        { name: "玩电脑", type: "minutes" },
        { name: "换现金", type: "cash" }
    ];

    const exchangeList = document.getElementById('exchange-list');
    const userID = 1; // 假设用户ID已知

    exchangeItems.forEach(item => {
        const listItem = document.createElement('li');

        const itemName = document.createElement('span');
        itemName.textContent = item.name + ': ';
        
        const pointsInput = document.createElement('input');
        pointsInput.type = 'number';
        pointsInput.min = '1';
        pointsInput.placeholder = '消耗积分';

        const exchangeButton = document.createElement('button');
        exchangeButton.textContent = '兑换';
        exchangeButton.onclick = () => {
            const pointsUsed = pointsInput.value;
            const exchangedFor = item.type === 'minutes' ? `${pointsUsed} 分钟` : `${pointsUsed} 现金`;

            redeemPoints(userID, item.name, pointsUsed, exchangedFor);
        };

        listItem.appendChild(itemName);
        listItem.appendChild(pointsInput);
        listItem.appendChild(exchangeButton);
        exchangeList.appendChild(listItem);
    });
}

function executeRedemption(userID, exchangeType, pointsUsed, exchangedFor, specialPointsUsed = 0) {
    fetch('/redeemPoints', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userID: userID,
            exchangeType: exchangeType,
            pointsUsed: pointsUsed,
            exchangedFor: exchangedFor,
            specialPointsUsed: specialPointsUsed
        })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        fetchUserInfo(); // 重新获取用户信息以更新积分显示
    })
    .catch(error => console.error('Error:', error));
}

function redeemPoints(userID, exchangeType, pointsUsed, exchangedFor) {
    const specialPointsRequired = exchangeType === '换现金' ? 1 : 0; // 兑换现金所需的特别积分

    // 兑换现金时检查普通积分是否满足最低要求
    if (exchangeType === '换现金' && pointsUsed < 20) {
        alert('兑换现金至少需要20普通积分');
        return;
    }

    // 执行兑换，包括特别积分和普通积分
    executeRedemption(userID, exchangeType, pointsUsed, exchangedFor, specialPointsRequired);
}


function setupViewExchangeHistoryButton() {
    document.getElementById('view-exchange-history').addEventListener('click', function() {
        window.location.href = 'exchangeHistory.html'; // 假设有一个页面用于显示兑换历史
    });
}
