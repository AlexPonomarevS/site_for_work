console.log('test');
async function exportToExcel(application) {
    try {
        // Создаем новую книгу Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Application Details');

        // Заголовки столбцов
        worksheet.addRow(['Name', 'Description', 'CreatedAt']);
        worksheet.addRow([application.name, application.description, application.createdAt]);

        // Создаем файл Excel
        const buffer = await workbook.xlsx.writeBuffer();

        // Создаем ссылку для скачивания файла
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'application.xlsx';
        link.click();
    } catch (error) {
        console.error('Произошла ошибка при экспорте в Excel:', error);
    }
}

// Находим кнопки "Export to Excel" и добавляем обработчик события
const exportButtons = document.querySelectorAll('.export-button');
exportButtons.forEach(button => {
    button.addEventListener('click', () => {
        const application = JSON.parse(button.dataset.application);
        exportToExcel(application);
        console.log('test');
    });
});