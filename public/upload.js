function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const newFileName = document.getElementById('newFileName').value;
    const files = fileInput.files;

    if (files.length === 0) {
        alert('请选择文件！');
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        // 如果用户输入了新文件名
        if (newFileName) {
            formData.append('newFileName', newFileName);
        }
        console.log(newFileName);
        console.log(formData);
        fetch('/emilyUpload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('上传成功：', data);
        })
        .catch(error => {
            console.error('上传失败：', error);
        });
    }
}
