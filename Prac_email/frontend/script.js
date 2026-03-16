const form = document.getElementById("mailForm");
const csvInput = document.getElementById("csvFile");
const attachmentsInput = document.getElementById("attachments");
const dropZone = document.getElementById("dropZone");
const fileList = document.getElementById("fileList");

let attachedFiles = [];

/* ===== CSV загрузка ===== */

csvInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        const emails = parseCSV(text);
        document.getElementById("recipients").value = emails.join(", ");
    };

    reader.readAsText(file);
});

function parseCSV(content) {
    return content
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0);
}

/* ===== Вложения ===== */

attachmentsInput.addEventListener("change", function () {
    addFiles(this.files);
});

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
});

function addFiles(files) {
    for (const file of files) {
        attachedFiles.push(file);

        const li = document.createElement("li");
        li.textContent = file.name;
        fileList.appendChild(li);
    }
}

/* ===== Отправка формы ===== */

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const provider = document.getElementById("provider").value;
    const recipients = document.getElementById("recipients").value;
    const subject = document.getElementById("subject").value;
    const text = document.getElementById("text").value;

    const formData = new FormData();

    formData.append("provider", provider);
    formData.append("to", recipients);
    formData.append("subject", subject);
    formData.append("text", text);

    for (const file of attachedFiles) {
        formData.append("attachments", file);
    }

    const response = await fetch("http://localhost:3000/send", {
        method: "POST",
        body: formData
    });

    const result = await response.json();
    alert(JSON.stringify(result));
});