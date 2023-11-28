document.addEventListener('DOMContentLoaded', () => {
    const datePicker = document.getElementById('datePicker');
    const homeworkList = document.getElementById('homeworkList');

    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;

    fetchHomeworks(today);

    datePicker.addEventListener('change', (e) => {
        const selectedDate = e.target.value;
        fetchHomeworks(selectedDate);
    });

    function fetchHomeworks(date) {
        fetch(`/api/homework?date=${date}`)
            .then(response => response.json())
            .then(homeworks => displayHomeworks(homeworks, date))
            .catch(error => console.error('Error:', error));
    }

    function displayHomeworks(homeworks, selectedDate) {
        homeworkList.innerHTML = '';
        homeworks.forEach(hw => {
            const hwElement = document.createElement('div');
            hwElement.innerHTML = `
                <h3>${hw.Subject}</h3>
                <p>${hw.Description}</p>
            `;

            // 创建上传按钮
            const uploadButton = document.createElement('input');
            uploadButton.type = 'file';

            // 显示已上传的附件列表
            const attachmentList = document.createElement('ul');
            uploadButton.addEventListener('change', function(event) {
                uploadHomeworkAttachment(hw.HomeworkID, event.target.files[0], selectedDate, attachmentList);
            });
  
            hwElement.appendChild(uploadButton);
            hwElement.appendChild(attachmentList);

            fetchHomeworkAttachments(hw.HomeworkID, attachmentList, selectedDate);

            homeworkList.appendChild(hwElement);
        });
    }

    function uploadHomeworkAttachment(homeworkID, file, selectedDate, attachmentListElement) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('homeworkID', homeworkID);
    
        fetch('/api/uploadHomeworkAttachment', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert('文件上传成功!');
            // 重新加载作业附件列表，以显示新上传的文件
            fetchHomeworkAttachments(homeworkID, attachmentListElement, selectedDate);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('文件上传失败！');
        });
    }
    

    function fetchHomeworkAttachments(homeworkID, attachmentListElement, selectedDate) {
        fetch(`/api/getHomeworkAttachments?homeworkID=${homeworkID}&date=${selectedDate}`)
            .then(response => response.json())
            .then(attachments => {
                attachments.forEach(attachment => {
                    console.log('Attachment:', attachment.FilePath); // 打印查看附件信息
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = `#`; // 假设FilePath是文件的URL
                    link.textContent = attachment.FilePath; // 假设FileName是文件的名字
                //     link.target = '_blank'; // 在新标签页中打开文件
                //     mediaLink.href = `#`;
                // mediaLink.textContent = file.FilePath;
                    link.onclick = function() { 
                        showPreview(`http://192.168.1.3:30031/${attachment.FilePath}`);
                    };
                    listItem.appendChild(link);
                    attachmentListElement.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error:', error));
    }
    
    function showPreview(filePath) {
        // 显示模态窗口
        const modal = document.getElementById('previewModal');
        modal.style.display = 'block';
        console.log(`showPreview filePath: ${filePath}`) 
    
        // 在这里设置预览内容
        const previewContent = document.getElementById('previewContent');
        const fileExtension = filePath.split('.').pop().toLowerCase();
        console.log(`showPreview fileExtension: ${fileExtension}`);
        if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg') {
            // 如果是图片，使用<img>标签显示
            previewContent.innerHTML = '<img src="' + filePath + '" alt="Image preview" style="max-width: 100%; height: auto;">';
        } else if (fileExtension === 'mov' || fileExtension === 'mp4') {
            // 如果是视频，使用<video>标签显示
            previewContent.innerHTML = '<video width="100%" height="400px" controls><source src="' + filePath + '" type="video/' + fileExtension + '"></video>';
        } else {
            // 其他文件类型，您可以决定如何显示，或者显示一个消息说无法预览s
            previewContent.innerHTML = '无法预览此文件类型';
        }
    
        // 设置关闭按钮的功能
        document.getElementById('closeModal').onclick = function() {
            modal.style.display = 'none';
        };
    }
    
});
