# Тестовое задание - Планировщик

## Задание

1. При наведении на задачу должно отображать всплывающее окно с подсказкой. Для всплывающих подсказок нужно использовать css и html, без js.

2. Список пользователей получить по адресу https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users 
Список задач получить по адресу https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks

3. На диаграмме должна отображать как минимум одна неделя. Должна быть возможность “прокручивать” календарь по неделям.

4. Если у задачи указан исполнитель (executor)  - ставим задачу исполнителю, иначе складываем задачи в backlog.

5. Пользователь должен иметь возможность перетаскивать задачи из backlog конкретному пользователю и на любую дату. То есть дата и исполнить определяются пересечением строки пользователя и колонкой даты. Если задачу закинуть на самого пользователя (в первый столбец), то задача ставится на те даты, которые указаны в ее свойствах.

6. Для реализации использовать нативный JS, флексы и гриды. Решение должно быть кроссбраузерным - работать в Chrome и Firefox. Верстка должна быть адаптивной. В мобильной версии Backlog не отображается.