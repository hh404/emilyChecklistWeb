document.addEventListener('DOMContentLoaded', function() {
    fetchExchangeHistory();
});

function fetchExchangeHistory() {
    const userID = 1; // 假设用户ID已知或从会话中获取
    fetch(`/api/exchangeHistory?userID=${userID}`)
    .then(response => response.json())
    .then(data => {
        const historyList = document.getElementById('exchange-history-list');
        historyList.innerHTML = ''; // 清空现有的记录

        data.forEach(record => {
            const listItem = document.createElement('div');
            listItem.textContent = `日期: ${formatDate(record.ExchangeDate)}, 类型: ${record.ExchangeType}, 使用积分: ${record.PointsUsed}, 兑换: ${record.ExchangedFor}`;
            historyList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error:', error));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} (${hours}:${minutes})`;
}