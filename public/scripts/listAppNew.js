// listApp.js

document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.service__menu');
  const buttons = menu.querySelectorAll('.card__button');
  const list = document.querySelector('.list__app');
  let applications = [];

  // Загрузить все заявки и сразу отрисовать полный список
  async function loadApplications() {
    try {
      const res = await fetch('http://localhost:3000/applications');
      if (!res.ok) throw new Error(res.statusText);
      applications = await res.json();
      renderList(applications);
    } catch (err) {
      console.error('Ошибка загрузки заявок:', err);
      list.innerHTML = '<li>Не удалось загрузить заявки</li>';
    }
  }

  // Отрисовать список переданных заявок
  function renderList(items) {
    list.innerHTML = '';
    if (items.length === 0) {
      list.innerHTML = '<li>Заявок не найдено</li>';
      return;
    }

    items.forEach((app) => {
      const li = document.createElement('li');
      li.classList.add('list__app-item');

      // Показываем description как нативный тултип
      li.title = app.description;

      // Переход на детальную страницу по клику
      li.addEventListener('click', () => {
        window.location.href = `/applications/${app.id}`;
      });

      // Название
      const nameEl = document.createElement('p');
      nameEl.textContent = `Название: ${app.name}`;

      // Описание (дублируем уже в тултипе, можно убрать если не нужно в списке)
      const descEl = document.createElement('p');
      descEl.textContent = `Автор: ${app.username}`;

      // Дата
      const dateEl = document.createElement('p');
      dateEl.textContent = `Дата: ${app.createdAt.slice(0, 10)}`;

      // Кнопка экспорта в Excel
      const expBtn = document.createElement('button');
      expBtn.textContent = 'Экспорт в Excel';
      expBtn.addEventListener('click', async (evt) => {
        evt.stopPropagation();
        const res = await fetch(
          `http://localhost:3000/applications/export-to-excel/${app.id}`,
        );
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `application_${app.id}.xlsx`;
          a.click();
          URL.revokeObjectURL(url);
        } else {
          console.error('Ошибка экспорта:', res.statusText);
        }
      });

      // Кнопка удаления
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Удалить';
      delBtn.addEventListener('click', async (evt) => {
        evt.stopPropagation();
        const res = await fetch(
          `http://localhost:3000/applications/delete/${app.id}`,
          { method: 'DELETE' },
        );
        if (res.ok) {
          li.remove();
        } else {
          console.error('Ошибка удаления:', res.statusText);
        }
      });

      // Внутри renderList(items) после создания delBtn и expBtn

      // 1. Корневой контейнер
      const statusBlock = document.createElement('div');
      statusBlock.className = 'status-block'; // лучше не использовать id, иначе дублируется

      // 2. Label
      const statusLabel = document.createElement('label');
      statusLabel.setAttribute('for', `statusSelect-${app.id}`);
      statusLabel.innerHTML = '<strong>Изменить статус:</strong>';

      // 3. Select
      const statusSelect = document.createElement('select');
      statusSelect.id = `statusSelect-${app.id}`;

      statusSelect.addEventListener('click', e => e.stopPropagation());
      statusSelect.addEventListener('mousedown', e => e.stopPropagation());


      // 4. Опции (сделайте полный список по аналогии)
      const statuses = [
        { value: 'WORK', text: 'В работе' },
        { value: 'CLOSED', text: 'Закрыта' },
        { value: 'OPEN', text: 'Открыта' },
        {
          value: 'FORMALIZED_PGR_WAIT',
          text: 'Оформлена в ПГР ждем утверждения',
        },
        {
          value: 'FORMALIZED_POESO_GARANTIA',
          text: 'Оформлена в ПОЭСО - ГАРАНТИЯ',
        },
        {
          value: 'FORMALIZED_POESO_PGR',
          text: 'Оформлена в ПОЭСО - ПГР',
        },
        {
          value: 'FORMALIZED_POESO_REPLACEMENT',
          text: 'Оформлена в ПОЭСО заменой из ОФ',
        },
        {
          value: 'FORMALIZED_POESO_CONSULTATION',
          text: 'Оформлена в ПОЭСО консультацией',
        },
        {
          value: 'FORMALIZED_POESO_VR_GARANTIA',
          text: 'Оформлена в ПОЭСО по ВР - ГАРАНТИЯ',
        },
        {
          value: 'FORMALIZED_POESO_VR_PGR',
          text: 'Оформлена в ПОЭСО по ВР - ПГР',
        },
        {
          value: 'FORMALIZED_POESO_REPAIR_KSA_WITHOUT_ZIP',
          text: 'Оформлена в ПОЭСО ремонтом на КСА без ЗИП',
        },
        {
          value: 'FORMALIZED_POESO_REPAIR_KSA_WITH_ZIP',
          text: 'Оформлена в ПОЭСО ремонтом на КСА с ЗИП',
        },
        {
          value: 'FORMALIZED_DEV_REQUEST',
          text: 'Оформлена заявка разработчику',
        },
        /* … остальные опции … */
      ];

      statuses.forEach(({ value, text }) => {
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = text;
        if (app.status === value) opt.selected = true;
        statusSelect.append(opt);
      });

      // 5. Кнопка «Обновить статус»
      const statusBtn = document.createElement('button');
      statusBtn.className = 'update-status-btn';
      statusBtn.textContent = 'Обновить статус';
      statusBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const select = statusSelect;
        const newStatus = select.value;
        console.log(JSON.stringify({ status: newStatus }));
        const applicationId = `${app.id}`;
        const response = await fetch(`/applications/${applicationId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        if (response.ok) {
          alert('Статус обновлён');
          // location.reload();
        } else {
          alert('Ошибка при обновлении статуса');
        }
      });

      // 6. Собираем и встраиваем
      statusBlock.append(statusLabel, statusSelect, statusBtn);

      // 1) Создаём контейнер для раздела
      const sectionBlock = document.createElement('div');
      sectionBlock.className = 'section-block'; // вместо id, чтобы не дублировался

// 2) Label
      const sectionLabel = document.createElement('label');
      sectionLabel.setAttribute('for', `sectionSelect-${app.id}`);
      sectionLabel.innerHTML = '<strong>Изменить раздел:</strong>';

// 3) Select
      const sectionSelect = document.createElement('select');
      sectionSelect.id = `sectionSelect-${app.id}`;

      sectionSelect.addEventListener('click', e => e.stopPropagation());
      sectionSelect.addEventListener('mousedown', e => e.stopPropagation());
// 4) Опции разделов
      const sections = [
        { value: 'DEFAULT',      text: 'Горячая линия' },
        { value: 'PGR',          text: 'ПГР' },
        { value: 'GARANTIA',     text: 'Гарантия' },
        { value: 'GARANTIA_IBP', text: 'Гарантия ИБП' },
        { value: 'ARCHIVE',      text: 'Архив' }
      ];

      sections.forEach(({ value, text }) => {
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = text;
        if (app.section === value) opt.selected = true;
        sectionSelect.append(opt);
      });

// 5) Кнопка «Обновить раздел»
      const sectionBtn = document.createElement('button');
      sectionBtn.className = 'update-section-btn';
      sectionBtn.textContent = 'Обновить раздел';
      sectionBtn.addEventListener('click', async e => {
        e.stopPropagation();
        const select = sectionSelect;
        const newSection = select.value;
        console.log(JSON.stringify({ section: newSection }));
        const applicationId = `${app.id}`;
        const response = await fetch(`/applications/${applicationId}/section`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section: newSection })
        });
        if (response.ok) {
          alert('Раздел обновлён');
          // location.reload();
        } else {
          alert('Ошибка при обновлении раздела');
        }
      });

// 6) Собираем блок и приклеиваем к <li>
      sectionBlock.append(sectionLabel, sectionSelect, sectionBtn);
      li.append(sectionBlock);

      // Собираем элемент списка
      nameEl.style.border = '1px solid blue';
      descEl.style.border = '1px solid blue';
      dateEl.style.border = '1px solid blue';
      expBtn.style.border = '1px solid blue';
      delBtn.style.border = '1px solid blue';
      statusBlock.style.border = '1px solid blue';
      sectionBlock.style.border = '1px solid blue';

      li.append(nameEl, descEl, dateEl, expBtn, delBtn);
      li.append(statusBlock);
      li.append(sectionBlock);
      list.appendChild(li);
    });
  }

  // Обработчик клика по меню разделов
  menu.addEventListener('click', (evt) => {
    const btn = evt.target.closest('.card__button');
    if (!btn) return;

    // Подсветка активной кнопки
    buttons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    // Фильтрация или показ всех
    const section = btn.dataset.section;
    const filtered =
      section === 'ALL'
        ? applications
        : applications.filter((app) => app.section === section);

    renderList(filtered);
  });

  // Старт загрузки данных
  loadApplications();
});
