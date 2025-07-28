async function fetchApplications() {
    try {
        const response = await fetch('http://localhost:3000/applications');
        if (response.ok) {
            const applications = await response.json();
            const list = document.querySelector('ul');

            applications.forEach(application => {
                // Создадим элемент списка для заявки
                const listItem = document.createElement('li');
                listItem.classList.add('list__app-item');

                // При клике по элементу списка переходим на страницу деталей заявки
                listItem.addEventListener('click', () => {
                    window.location.href = `/applications/${application.id}`;
                });

                // Создаём и наполняем элементы для отображения данных заявки
                const nameElement = document.createElement('p');
                nameElement.classList.add('item-name');
                nameElement.textContent = `Название: ${application.name}`;

                const descriptionElement = document.createElement('p');
                descriptionElement.classList.add('item-description');
                descriptionElement.textContent = `Описание: ${application.description}`;

                const dateElement = document.createElement('p');
                dateElement.classList.add('item-date');
                // Форматирование даты – берём первые 10 символов для даты
                dateElement.textContent = `Дата создания: ${application.createdAt.slice(0,10)}`;

                // Кнопка экспорта в Excel
                const exportButton = document.createElement('button');
                exportButton.classList.add('export-button');
                exportButton.textContent = '';
                exportButton.dataset.application = JSON.stringify(application);
                exportButton.addEventListener('click', async (evt) => {
                    evt.stopPropagation();  // не пускаем событие клика на родительский li
                    try {
                        const applicationId = application.id;
                        const response = await fetch(`http://localhost:3000/applications/export-to-excel/${applicationId}`);
                        if (response.ok) {
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `application_${applicationId}.xlsx`;
                            a.click();
                        } else {
                            console.error('Ошибка при экспорте в Excel:', response.statusText);
                        }
                    } catch (error) {
                        console.error('Произошла ошибка:', error);
                    }
                });

                // Кнопка удаления заявки
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-button');
                deleteButton.textContent = '';
                deleteButton.dataset.application = JSON.stringify(application);
                deleteButton.addEventListener('click', async (evt) => {
                    // Предотвращаем всплытие события клика на родительский элемент
                    evt.stopPropagation();
                    try {
                        const applicationId = application.id;
                        const response = await fetch(`http://localhost:3000/applications/delete/${applicationId}`, {
                            method: 'DELETE'
                        });
                        if (response.ok) {
                            evt.target.parentElement.remove();
                        } else {
                            console.error('Ошибка при удалении', response.statusText);
                        }
                    } catch (error) {
                        console.error('Произошла ошибка:', error);
                    }
                });

                // Добавляем элементы в li
                listItem.appendChild(nameElement);
                listItem.appendChild(descriptionElement);
                listItem.appendChild(dateElement);
                listItem.appendChild(exportButton);
                listItem.appendChild(deleteButton);

                // Добавляем li в список (ul)
                list.appendChild(listItem);
            });
        } else {
            console.error('Ошибка при получении заявок:', response.statusText);
        }
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}

fetchApplications();
