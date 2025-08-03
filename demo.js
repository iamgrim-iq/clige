const {
    COLORS, colorize, style, gradient,
    clear, getTerminalSize, padToScreen, bell,

    drawBox, drawContainer, drawNestedBox,
    createTable, createGrid, createBanner, createColumns,
    createInteractiveMenu, createSimplePrompt, createMultiPageMenu,
    drawProgressBar, drawSpinner, drawMultiProgressBar, drawStepProgress,

    createRegistrationForm, createLoginForm, createMultiStepForm,
    createSurveyForm, createConfigForm, createQuickForm,
    validateEmail, validatePassword,

    waitForEnter,

    formatSuccess, formatError,
    getTheme, listThemes,

    generateSlug, highlightText, similarity, formatBytes
} = require('./clige');

let currentThemeName = 'default';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function showAndWait(content, title = "Демонстрация") {
    clear();
    const theme = getTheme(currentThemeName);
    const box = drawBox(content, {
        title,
        color: theme.get('colors.primary'),
        borderStyle: 'double',
        padding: 2
    });
    console.log(box);
    await waitForEnter(`\n${theme.get('styles.link')}Нажмите Enter для возврата в меню...${COLORS.RESET}`);
}

async function showWelcome() {
    clear();
    const theme = getTheme(currentThemeName);
    const logo = `
 ██████╗██╗     ██╗ ██████╗ ███████╗
██╔════╝██║     ██║██╔════╝ ██╔════╝
██║     ██║     ██║██║  ███╗█████╗  
██║     ██║     ██║██║   ██║██╔══╝  
╚██████╗███████╗██║╚██████╔╝███████╗
 ╚═════╝╚══════╝╚═╝ ╚═════╝ ╚══════╝
    `;

    const gradientLogo = gradient(logo, {r: 255, g: 0, b: 0}, {r: 255, g: 150, b: 0});

    const welcome = drawBox(gradientLogo, {
        title: 'CLI Grim Engine Demo',
        color: theme.get('colors.primary') + COLORS.BOLD,
        borderStyle: 'double',
        align: 'center',
        padding: 2
    });

    const info = drawBox('Добро пожаловать в полное демо движка clige!\nВыберите опцию в главном меню для просмотра возможностей.', {
        title: 'Информация',
        color: theme.get('colors.secondary'),
        padding: 1,
        borderStyle: 'rounded'
    });

    const promptMessage = `\n${theme.get('styles.link')}Нажмите Enter для входа в главное меню...${COLORS.RESET}`;
    const fullContent = `${welcome}\n\n${info}\n${promptMessage}`;

    clear();
    process.stdout.write(
        padToScreen(fullContent, { vertical: 'center', horizontal: 'center' })
    );

    await new Promise(resolve => process.stdin.once('data', resolve));
}

async function showLayoutsDemo() {
    const theme = getTheme(currentThemeName);

    const tableData = [
        ['1', 'Node.js', 'Серверная платформа'],
        ['2', 'React', 'Frontend-библиотека'],
        ['3', 'clige', 'Движок для CLI']
    ];
    const tableHeaders = ['ID', 'Название', 'Описание'];
    const table = createTable(tableData, {
        headers: tableHeaders,
        borderColor: theme.get('colors.border'),
        headerColor: theme.get('components.table.headerColor'),
        alignment: ['center', 'left', 'left']
    });

    const gridItems = ['Элемент 1', 'Элемент 2', 'Элемент 3', 'Элемент 4', 'Элемент 5'];
    const grid = createGrid(gridItems, {
        columns: 3,
        cellWidth: 15,
        cellHeight: 3,
        showBorders: true,
    });

    const banner = createBanner('Это Баннер!', { style: 'double', color: theme.get('colors.accent') });

    const nested = drawNestedBox('Вложенность!', {
        levels: 3,
        colors: [theme.get('colors.error'), theme.get('colors.warning'), theme.get('colors.success')],
        spacing: 1
    });

    const content = `Таблица:\n${table}\n\nСетка:\n${grid}\n\nБаннер:\n${banner}\n\nВложенные рамки:\n${nested}`;
    await showAndWait(content, "Демонстрация Layouts");
}

async function showProgressDemo() {
    clear();
    const theme = getTheme(currentThemeName);
    console.log(drawBox("Демонстрация индикаторов прогресса", { color: theme.get('colors.primary'), align: 'center' }));

    console.log('\nПростой Progress Bar:');
    for (let i = 0; i <= 100; i += 5) {
        process.stdout.write('\r' + drawProgressBar(i, 100, {
            width: 50,
            color: theme.get('components.progress.fillColor'),
            showPercentage: true
        }));
        await sleep(50);
    }
    process.stdout.write('\n');

    console.log('\nАнимированный Spinner:');
    let frame = 0;
    const spinnerInterval = setInterval(() => {
        process.stdout.write('\r' + drawSpinner(frame++, {
            style: 'dots',
            color: theme.get('colors.accent'),
            text: 'Обработка данных...'
        }));
    }, 80);
    await sleep(2000);
    clearInterval(spinnerInterval);
    process.stdout.write('\r' + formatSuccess('operation', 'completed', 'Обработка данных') + ' '.repeat(20) + '\n');

    console.log('\nНесколько Progress Bar:');
    const bars = [
        { label: 'Скачивание файлов', current: 75, total: 100, color: theme.get('colors.primary') },
        { label: 'Распаковка архива', current: 33, total: 100, color: theme.get('colors.secondary') },
        { label: 'Установка зависимостей', current: 98, total: 100, color: theme.get('colors.success') }
    ];
    console.log(drawMultiProgressBar(bars));

    console.log('\nПошаговый прогресс:');
    const steps = ['Инициализация', 'Проверка', 'Выполнение', 'Завершение'];
    console.log(drawStepProgress(steps, 2, {
        currentColor: theme.get('colors.warning'),
        completedColor: theme.get('colors.success')
    }));

    await waitForEnter(`\n${theme.get('styles.link')}Нажмите Enter для возврата в меню...${COLORS.RESET}`);
}

async function showMenuDemo() {
    clear();
    const theme = getTheme(currentThemeName);
    console.log(drawBox("Демонстрация Меню", { color: theme.get('colors.primary'), align: 'center' }));

    console.log("\n1. Простое меню с выбором по номеру:");
    await createSimplePrompt(['Опция A', 'Опция B', { text: 'Отключено', disabled: true }], {
        title: "Простой выбор"
    });

    console.log("\n2. Меню с пагинацией (25 элементов):");
    const longList = Array.from({ length: 25 }, (_, i) => ({
        text: `Элемент номер ${i + 1}`,
        value: i + 1
    }));
    await createMultiPageMenu(longList, {
        title: "Большой список",
        itemsPerPage: 5,
        boxOptions: {
            color: theme.get('colors.secondary'),
            borderStyle: 'rounded'
        }
    });

    await waitForEnter(`\n${theme.get('styles.link')}Нажмите Enter для возврата в меню...${COLORS.RESET}`);
}

async function showForm(formFunction, ...args) {
    clear();
    const result = await formFunction(...args);
    clear();

    if (result.cancelled) {
        console.log(formatError('user', 'cancelled'));
    } else if (result.isValid === false || result.completed === false) {
        console.log(formatError('user', 'operationFailed', 'Заполнение формы'));
        console.log("Ошибки:", result.errors || "Неизвестная ошибка");
    } else {
        console.log(formatSuccess('operation', 'completed', 'Заполнение формы'));
        console.log("Полученные данные:");
        console.log(JSON.stringify(result.data, null, 2));
    }

    await waitForEnter(`\n${getTheme(currentThemeName).get('styles.link')}Нажмите Enter для возврата в меню...${COLORS.RESET}`);
}

async function showFormsMenu() {
    const theme = getTheme(currentThemeName);
    const menuItems = [
        { text: "Форма регистрации", value: "register" },
        { text: "Форма входа", value: "login" },
        { text: "Многошаговая форма", value: "multistep" },
        { text: "Форма опроса", value: "survey" },
        { text: "Форма конфигурации", value: "config" },
        { text: "Быстрая форма", value: "quick" },
        { text: "Назад", value: "back" }
    ];

    while (true) {
        clear();
        const choice = await createInteractiveMenu(menuItems, {
            title: `Главное меню - CLI Grim Engine (Тема: ${currentThemeName})`,
            center: true,
            boxOptions: {
                color: theme.get('colors.primary'),
                borderStyle: 'thick',
                padding: 1
            },
            selectedColor: theme.get('components.menu.selectedColor'),
            numbersColor: theme.get('components.menu.numbersColor'),
            center: true
        });

        if (!choice || choice.value === 'back') {
            break;
        }

        switch (choice.value) {
            case "register":
                await showForm(createRegistrationForm, {
                    requirePasswordConfirm: true,
                    customFields: [{ name: 'age', label: 'Возраст', type: 'number' }]
                });
                break;
            case "login":
                await showForm(createLoginForm, { allowRememberMe: true });
                break;
            case "multistep":
                const steps = [
                    { title: "Личная информация", fields: [{ name: 'name', label: 'Ваше имя' }, { name: 'email', label: 'Email' }] },
                    { title: "Адрес доставки", fields: [{ name: 'city', label: 'Город' }, { name: 'street', label: 'Улица' }] },
                    { title: "Подтверждение", description: "Проверьте введенные данные.", fields: [] }
                ];
                await showForm(createMultiStepForm, steps, { allowBack: true });
                break;
            case "survey":
                const questions = [
                    { question: "Ваш любимый цвет?", type: 'text', id: 'fav_color' },
                    { question: "Вам нравится clige?", type: 'boolean', id: 'like_clige' },
                    { question: "Какой фреймворк вы предпочитаете?", type: 'choice', options: ['React', 'Vue', 'Svelte'], id: 'framework' }
                ];
                await showForm(createSurveyForm, questions, { randomizeOrder: true });
                break;
            case "config":
                const schema = {
                    port: { description: 'Сетевой порт', type: 'number', default: 8080 },
                    enable_https: { description: 'Включить HTTPS', type: 'boolean', default: false },
                    log_level: { description: 'Уровень логирования', type: 'choice', enum: ['debug', 'info', 'warn', 'error'] }
                };
                await showForm(createConfigForm, schema);
                break;
            case "quick":
                 await showForm(createQuickForm, ['Имя', 'Фамилия', { name: 'nickname', label: 'Никнейм' }]);
                 break;
        }
    }
}

async function showUtilsDemo() {
    const theme = getTheme(currentThemeName);
    let content = '';

    content += style('--- Text Utils ---\n', theme.get('styles.title'));
    content += `Slug: ${generateSlug("Это Тестовая Строка для Slug'а!")}\n`;
    content += `Highlight: ${highlightText("Найди слово текст в этом тексте.", "текст", { highlightColor: theme.get('colors.highlight') })}\n`;
    content += `Similarity: Сходство между "color" и "colour" -> ${similarity('color', 'colour').toFixed(2)}\n`;
    content += `Format Bytes: ${formatBytes(123456789)}\n`;

    content += style('\n--- Validation Utils ---\n', theme.get('styles.title'));
    content += `Is 'test@test.com' a valid email? ${validateEmail('test@test.com') ? 'Да' : 'Нет'}\n`;
    const passResult = validatePassword('StrongPass123!');
    content += `Password 'StrongPass123!' strength: ${passResult.strength}\n`;

    content += style('\n--- String Formatters ---\n', theme.get('styles.title'));
    content += `${formatSuccess('authentication', 'loggedIn', 'Гость')}\n`;
    content += `${formatError('file', 'notFound', '/path/to/file.txt')}\n`;
    content += `${formatError('network', 'timeout')}\n`;

    bell(); 
    await showAndWait(content, "Демонстрация Утилит");
}

async function showThemeMenu() {
    const themeList = listThemes().map(t => ({ text: `${t.name} - ${t.description}`, value: t.name }));
    themeList.push({ text: "Назад", value: "back" });

    clear();
    const choice = await createInteractiveMenu(themeList, {
        title: "Выберите тему",
        center: true,
        boxOptions: { color: getTheme(currentThemeName).get('colors.primary') }
    });

    if (choice && choice.value !== 'back') {
        currentThemeName = choice.value;
        console.log(formatSuccess('operation', 'completed', `Тема изменена на ${currentThemeName}`));
        await sleep(1000);
    }
}

async function main() {
    process.on('SIGINT', () => {
        clear();
        console.log(colorize('Выход...', COLORS.YELLOW));
        process.exit(0);
    });

    await showWelcome();

    while (true) {
        clear();
        const theme = getTheme(currentThemeName);
        const menuItems = [
            { text: 'Демонстрация Layouts (таблицы, сетки)', value: 'layouts' },
            { text: 'Демонстрация Компонентов (прогресс, меню)', value: 'components' },
            { text: 'Демонстрация Форм (регистрация, логин, и т.д.)', value: 'forms' },
            { text: 'Демонстрация Утилит (текст, валидация)', value: 'utils' },
            { text: 'Сменить тему', value: 'theme', suffix: ` (текущая: ${currentThemeName})` },
            { text: 'Выход', value: 'exit', suffix: ' 🚪' }
        ];

        const choice = await createInteractiveMenu(menuItems, {
            title: `Главное меню - CLI Grim Engine (Тема: ${currentThemeName})`,
            center: true,
            boxOptions: {
                color: theme.get('colors.primary'),
                borderStyle: 'thick',
                padding: 1
            },
            selectedColor: theme.get('components.menu.selectedColor'),
            numbersColor: theme.get('components.menu.numbersColor')
        });

        if (!choice || choice.value === 'exit') {
            break;
        }

        switch (choice.value) {
            case 'layouts':
                await showLayoutsDemo();
                break;
            case 'components':
                 await showProgressDemo();
                 await showMenuDemo();
                break;
            case 'forms':
                await showFormsMenu();
                break;
            case 'utils':
                await showUtilsDemo();
                break;
            case 'theme':
                await showThemeMenu();
                break;
        }
    }

    clear();
    console.log(colorize('Спасибо за использование CLI Grim Engine Demo!', COLORS.BRIGHT_GREEN + COLORS.BOLD));
    console.log(colorize('До свидания! 👋', COLORS.YELLOW));
    process.exit(0);
}

main().catch(error => {
    console.clear();
    console.error(COLORS.BRIGHT_RED + "КРИТИЧЕСКАЯ ОШИБКА В ПРИЛОЖЕНИИ:" + COLORS.RESET);
    console.error(error);
    process.exit(1);
});