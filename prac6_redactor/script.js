// Инициализация редактора
const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['clean']
        ]
    }
});





/* ===== Открытие файла ===== */

const openBtn = document.getElementById("openFile");
const fileInput = document.getElementById("fileInput");

openBtn.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        const content = e.target.result;

        // Загружаем HTML с форматированием
        quill.root.innerHTML = content;
    };

    reader.readAsText(file);
});

/* ===== Сохранение файла (с форматированием) ===== */

const saveBtn = document.getElementById("saveFile");

saveBtn.addEventListener("click", () => {

    // Получаем HTML (с форматированием)
    const html = quill.root.innerHTML;

    const blob = new Blob([html], { type: "text/html" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "document.html";
    a.click();
});