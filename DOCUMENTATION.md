# API Reference

## I. Core Modules

### `clige/core/colors.js`

Утилиты для работы с ANSI-цветами и стилями текста в терминале.

*   **`COLORS`**: `Object`
    *   Набор констант для ANSI-кодов цветов (`BLACK`, `RED`, `GREEN`, `BLUE`, `CYAN`, `WHITE`, `BRIGHT_*`, `BG_*`) и стилей (`RESET`, `BOLD`, `DIM`, `ITALIC`, `UNDERLINE`, `BLINK`, `REVERSE`, `STRIKETHROUGH`).
*   **`colorize(text: string, color: string): string`**
    *   Применяет заданный `color` (ANSI-код) к `text`.
*   **`style(text: string, ...styles: string[]): string`**
    *   Применяет один или несколько ANSI `styles` к `text`.
*   **`rgb(r: number, g: number, b: number): string`**
    *   Генерирует ANSI-код для 24-битного RGB-цвета текста.
*   **`bgRgb(r: number, g: number, b: number): string`**
    *   Генерирует ANSI-код для 24-битного RGB-цвета фона.
*   **`gradient(text: string, startColor: { r, g, b }, endColor: { r, g, b }): string`**
    *   Применяет градиентный эффект к `text`, переходя от `startColor` к `endColor`.

### `clige/core/renderer.js`

Низкоуровневые утилиты для рендеринга и манипуляции текстом в терминале.

*   **`repeat(char: string, count: number): string`**
    *   Повторяет символ `char` заданное `count` раз.
*   **`pad(text: string, width: number, char?: string, align?: 'left' | 'center' | 'right'): string`**
    *   Дополняет `text` до `width` символом `char` с заданным `align`ментом.
*   **`stripAnsi(text: string): string`**
    *   Удаляет все ANSI-коды из `text`.
*   **`wrapText(text: string, width: number): string[]`**
    *   Разбивает `text` на массив строк, каждая из которых не превышает `width`.
*   **`truncate(text: string, width: number, suffix?: string): string`**
    *   Обрезает `text` до `width`, добавляя `suffix` (`...`) при необходимости.
*   **`alignText(text: string, width: number, alignment?: 'left' | 'center' | 'right'): string`**
    *   Выравнивает многострочный `text` по заданной `width` и `alignment`.
*   **`createBorder(style?: 'single' | 'double' | 'rounded' | 'thick'): Object`**
    *   Возвращает объект с символами для углов и линий рамки выбранного `style`.
*   **`measureText(text: string): { width: number, height: number, lines: string[] }`**
    *   Измеряет ширину и высоту (без ANSI-кодов) `text` и возвращает очищенные строки.
*   **`fitToTerminal(text: string, reservedWidth?: number, reservedHeight?: number): string`**
    *   Подгоняет `text` под размеры терминала, учитывая `reservedWidth` и `reservedHeight`.

### `clige/core/terminal.js`

Функции для взаимодействия с терминалом (размер, курсор, режимы ввода).

*   **`getTerminalSize(): { width: number, height: number }`**
    *   Возвращает текущую ширину и высоту терминала.
*   **`clear(): void`**
    *   Очищает экран терминала.
*   **`moveCursor(x: number, y: number): void`**
    *   Перемещает курсор на позицию `(x, y)` (1-индексировано).
*   **`hideCursor(): void`**
    *   Скрывает курсор.
*   **`showCursor(): void`**
    *   Показывает курсор.
*   **`clearLine(): void`**
    *   Очищает текущую строку.
*   **`clearFromCursor(): void`**
    *   Очищает строку от курсора до конца.
*   **`saveCursor(): void`**
    *   Сохраняет текущую позицию курсора.
*   **`restoreCursor(): void`**
    *   Восстанавливает сохраненную позицию курсора.
*   **`scrollUp(lines?: number): void`**
    *   Прокручивает содержимое терминала вверх на `lines` строк (по умолчанию 1).
*   **`scrollDown(lines?: number): void`**
    *   Прокручивает содержимое терминала вниз на `lines` строк (по умолчанию 1).
*   **`bell(): void`**
    *   Издает звуковой сигнал терминала.
*   **`enableRawMode(): void`**
    *   Включает "сырой" режим ввода (посимвольный).
*   **`disableRawMode(): void`**
    *   Выключает "сырой" режим ввода.
*   **`onResize(callback: Function): void`**
    *   Регистрирует `callback` для события изменения размера терминала.
*   **`getAvailableSpace(reservedLines?: number): { width: number, height: number }`**
    *   Возвращает доступное пространство для контента, учитывая `reservedLines` (для футера и т.п.).
*   **`isTerminalColorSupported(): boolean`**
    *   Проверяет поддержку ANSI-цветов текущим терминалом.

## II. Components Modules

### `clige/components/boxes.js`

Функции для рисования рамок и контейнеров.

*   **`drawBox(content: string, options?: Object): string`**
    *   Рисует рамку вокруг `content`.
    *   **Опции:** `width`, `height`, `padding`, `margin`, `title`, `titleAlign`, `borderStyle`, `color`, `background`, `align`.
*   **`drawContainer(items: Array<Object>, options?: Object): string`**
    *   Размещает массив `items` (объектов `{ content, ...drawBoxOptions }`) вертикально или горизонтально.
    *   **Опции:** `title` (для всего контейнера), `spacing`, `layout` (`'vertical'`|`'horizontal'`), `color`, `containerPadding`.
*   **`drawNestedBox(content: string, options?: Object): string`**
    *   Рисует `levels` вложенных рамок вокруг `content`.
    *   **Опции:** `levels`, `spacing`, `colors` (массив цветов для каждого уровня), `expandWidth` (насколько каждая внешняя рамка шире), `borderStyle`, `color`.

### `clige/components/forms.js`

Функции для создания интерактивных форм.

*   **`createForm(fields: Array<Object>, options?: Object): Promise<{ data: Object, errors: Object | null, isValid: boolean }>`**
    *   Создает и обрабатывает форму.
    *   **Параметры `fields`:** `{ name: string, label: string, type: 'text'|'password'|'number'|'boolean'|'choice'|'multiline', required?: boolean, defaultValue?: any, validation?: Function[], dependsOn?: string, conditional?: Function, ...inputOptions }`.
    *   **Опции формы:** `title`, `showProgress`, `theme`, `boxOptions`.
*   **`processField(field: Object, existingData?: Object): Promise<Object>`** (Вспомогательная)
    *   Обрабатывает ввод для одного поля формы.
*   **`createMultiStepForm(steps: Array<Object>, options?: Object): Promise<{ data: Object, completed: boolean, cancelled: boolean }>`**
    *   Создает многошаговую форму.
    *   **Параметры `steps`:** `{ title: string, description?: string, fields: Object[], options?: Object, onComplete?: Function }`.
    *   **Опции формы:** `title`, `showStepProgress`, `allowBack`.
*   **`createSurveyForm(questions: Array<Object>, options?: Object): Promise<{ data: Object, errors: Object | null, isValid: boolean }>`**
    *   Создает форму-опрос на основе массива `questions`.
    *   **Опции:** `title`, `allowSkip`, `randomizeOrder`, `showQuestionNumbers`.
*   **`createRegistrationForm(options?: Object): Promise<{ data: Object, errors: Object | null, isValid: boolean }>`**
    *   Готовая форма регистрации.
    *   **Опции:** `requireEmail`, `requirePhone`, `requirePasswordConfirm`, `customFields`.
*   **`createConfigForm(configSchema: Object, options?: Object): Promise<{ data: Object, errors: Object | null, isValid: boolean }>`**
    *   Создает форму для настроек на основе `configSchema` (ключ: `{ description, type, default, required, enum, validation, condition }`).
*   **`createLoginForm(options?: Object): Promise<{ data: Object, errors: Object | null, isValid: boolean }>`**
    *   Готовая форма для входа.
    *   **Опции:** `title`, `allowRememberMe`, `customFields`.
*   **`createQuickForm(fieldDefinitions: Array<string | Object>): Promise<{ data: Object, errors: Object | null, isValid: boolean }>`**
    *   Простая форма: `fieldDefinitions` может быть массивом строк (как метки) или полных объектов полей.

### `clige/components/layouts.js`

Функции для создания различных макетов и размещения текста.

*   **`centerText(text: string, options?: Object): string`**
    *   Центрирует `text` по горизонтали в рамках `width` (или ширины терминала).
*   **`alignText(text: string, alignment?: 'left' | 'center' | 'right', options?: Object): string`**
    *   Выравнивает многострочный `text` по заданному `alignment`.
*   **`createColumns(contents: string[], options?: Object): string`**
    *   Располагает `contents` (массив строк/блоков) в колонках.
    *   **Опции:** `widths` (массив ширин), `spacing`, `alignment`, `borders`, `borderChar`.
*   **`createGrid(items: string[], options?: Object): string`**
    *   Размещает `items` в сетке.
    *   **Опции:** `columns`, `cellWidth`, `cellHeight`, `spacing`, `showBorders`, `alignment`.
*   **`padToScreen(content: string, options?: Object): string`**
    *   Дополняет `content` пробелами, чтобы оно центрировалось/выравнивалось по всему экрану.
    *   **Опции:** `horizontal` (`'center'`|`'left'`|`'right'`), `vertical` (`'center'`|`'top'`|`'bottom'`), `fillChar`, `reservedLines`.
*   **`createBanner(text: string, options?: Object): string`**
    *   Создает стилизованный баннер с `text`.
    *   **Опции:** `style` (`'simple'`|`'double'`|`'star'`), `width`, `padding`, `color`, `borderColor`, `fillChar`.
*   **`createTable(data: Array<Array<any>>, options?: Object): string`**
    *   Создает таблицу из двумерного массива `data`.
    *   **Опции:** `headers`, `columnWidths`, `showHeaders`, `showBorders`, `alignment`, `headerColor`, `borderColor`.

### `clige/components/menu.js`

Функции для создания интерактивных и статических меню.

*   **`createMenuOption(index: number, text: string, options?: Object): string`** (Вспомогательная)
    *   Форматирует одну опцию меню.
*   **`drawMenu(items: Array<string | Object>, options?: Object): string`**
    *   Рисует статическое меню в рамке. `items` могут быть строками или объектами `{ text, value?, disabled?, prefix?, suffix? }`.
    *   **Опции:** `title`, `selected`, `showNumbers`, `showIndicators`, `numbersColor`, `selectedColor`, `normalColor`, `disabledColor`, `boxOptions`.
*   **`createInteractiveMenu(items: Array<string | Object>, options?: Object): Promise<{ index: number, item: Object | string, value: any } | null>`**
    *   Создает интерактивное меню (навигация стрелками, ввод номера).
    *   **Опции:** `title`, `exitKey`, `enterKey`, `onSelect` (колбэк при выборе), `allowEscape`, `clearScreen`, `center`, `boxOptions`.
*   **`createSimplePrompt(items: Array<string | Object>, options?: Object): Promise<{ index: number, item: Object | string, value: any }>`**
    *   Создает меню, где пользователь вводит номер опции (без навигации).
    *   **Опции:** `title`, `showInstructions`.
*   **`createMultiPageMenu(allItems: Array<string | Object>, options?: Object): Promise<{ index: number, item: Object | string, value: any, globalIndex: number } | null>`**
    *   Создает интерактивное меню с пагинацией для большого количества `allItems`.
    *   **Опции:** `itemsPerPage`, `title`, `showPageInfo`.

### `clige/components/progress.js`

Функции для отображения индикаторов прогресса и анимаций.

*   **`drawProgressBar(current: number, total: number, options?: Object): string`**
    *   Рисует горизонтальную полосу прогресса.
    *   **Опции:** `width`, `fillChar`, `emptyChar`, `showPercentage`, `showNumbers`, `color`, `backgroundColor`, `brackets`.
*   **`drawSpinner(frame?: number, options?: Object): string`**
    *   Рисует один кадр анимации спиннера.
    *   **Опции:** `style` (`'dots'`|`'line'`|`'arrow'`|`'bounce'`|`'pulse'`), `color`, `text`.
*   **`drawMultiProgressBar(bars: Array<Object>, options?: Object): string`**
    *   Рисует несколько полос прогресса. `bars` - массив `{ label, current, total, color }`.
    *   **Опции:** `title`, `showTotal`, `spacing`, `maxWidth`.
*   **`drawLoadingAnimation(frame?: number, options?: Object): string`**
    *   Рисует простую текстовую анимацию загрузки с точками.
    *   **Опции:** `text`, `maxDots`, `color`.
*   **`createAnimatedProgress(total: number, options?: Object): Object`**
    *   Создает контроллер для управления анимированным прогрессом в фоновом режиме.
    *   **Методы контроллера:** `start()`, `stop()`, `update(value)`, `increment(step?)`, `getCurrent()`, `getTotal()`, `isRunning()`.
    *   **Опции:** `updateInterval`, `onUpdate` (колбэк), `onComplete` (колбэк), `autoComplete`.
*   **`drawStepProgress(steps: string[], currentStep?: number, options?: Object): string`**
    *   Рисует индикатор прогресса по шагам (последовательности).
    *   **Опции:** `completedChar`, `currentChar`, `pendingChar`, `connector`, `colors`, `showLabels`, `vertical`.


## III. Strings Modules

### `clige/strings/errors.js`

Предоставляет локализованные сообщения об ошибках для различных категорий.

*   **`errorMessages`**: `Object`
    *   Объект, содержащий предопределенные шаблоны сообщений об ошибках, сгруппированные по категориям (`validation`, `file`, `network`, `system`, `user`, `generic`).
    *   Каждое сообщение является функцией, принимающей соответствующие аргументы (`field`, `path`, `code` и т.д.) и возвращающей отформатированную строку с цветами.
*   **`formatError(category: string, type: string, ...args: any[]): string`**
    *   Форматирует сообщение об ошибке на основе `category` и `type`, передавая `args` в соответствующую функцию-шаблон.
    *   **Пример:** `formatError('validation', 'required', 'Имя пользователя')`.

### `clige/strings/formatters.js`

(Этот модуль является точкой входа для различных строковых форматеров и экспортирует их из других файлов).

*   Экспортирует: `formatError`, `formatSuccess`, `getPrompt`.

### `clige/strings/prompts.js`

Предоставляет локализованные текстовые подсказки для взаимодействия с пользователем.

*   **`prompts`**: `Object`
    *   Объект, содержащий предопределенные шаблоны подсказок для различных категорий (`input`, `choice`, `confirmation`, `progress`, `navigation`, `help`, `status`).
    *   Каждая подсказка является функцией, которая принимает контекстные аргументы (`field`, `action`, `key` и т.д.) и возвращает отформатированную строку с цветами.
*   **`getPrompt(category: string, type: string, ...args: any[]): string`**
    *   Получает отформатированную строку подсказки на основе `category` и `type`, передавая `args` в соответствующую функцию-шаблон.
    *   **Пример:** `getPrompt('input', 'enterValue', 'имя')`.

### `clige/strings/success.js`

Предоставляет локализованные сообщения об успешном выполнении операций.

*   **`successMessages`**: `Object`
    *   Объект, содержащий предопределенные шаблоны сообщений об успехе, сгруппированные по категориям (`operation`, `validation`, `authentication`, `network`, `installation`, `performance`, `celebration`).
    *   Каждое сообщение является функцией, принимающей соответствующие аргументы (`item`, `user`, `amount` и т.д.) и возвращающей отформатированную строку с цветами.
*   **`formatSuccess(category: string, type: string, ...args: any[]): string`**
    *   Форматирует сообщение об успешном выполнении на основе `category` и `type`, передавая `args` в соответствующую функцию-шаблон.
    *   **Пример:** `formatSuccess('operation', 'completed', 'установка')`.

## IV. Utils Modules

### `clige/utils/input.js`

Набор функций для получения различных типов ввода от пользователя в терминале.

*   **`readKey(): Promise<string>`**
    *   Считывает одиночное нажатие клавиши (без Enter).
*   **`readLine(prompt?: string, options?: Object): Promise<string>`**
    *   Считывает строку текста до нажатия Enter.
    *   **Опции:** `mask`, `defaultValue`, `validator` (функция `(value) => boolean`), `maxLength`, `allowEmpty`.
*   **`readPassword(prompt?: string, options?: Object): Promise<string>`**
    *   Считывает пароль (ввод скрывается символами `*`).
    *   **Опции:** `minLength`, `confirmPassword` (требовать повторный ввод для подтверждения).
*   **`readNumber(prompt?: string, options?: Object): Promise<number>`**
    *   Считывает число.
    *   **Опции:** `min`, `max`, `integer` (парсить как целое), `defaultValue`.
*   **`readBoolean(prompt?: string, options?: Object): Promise<boolean>`**
    *   Считывает булево значение (y/n, да/нет и т.д.).
    *   **Опции:** `trueValues` (массив строк для `true`), `falseValues` (массив строк для `false`), `defaultValue`.
*   **`readChoice(prompt: string, choices: string[], options?: Object): Promise<string>`**
    *   Предлагает выбор из списка `choices` и считывает введенный номер или текст выбора.
    *   **Опции:** `caseSensitive`, `showChoices`, `defaultValue`.
*   **`readMultiline(prompt?: string, options?: Object): Promise<string>`**
    *   Считывает многострочный текст до специального маркера `endMarker`.
    *   **Опции:** `endMarker` (`'END'`), `showInstructions`.
*   **`waitForEnter(message?: string): Promise<void>`**
    *   Ожидает нажатия клавиши Enter.
*   **`createProgressiveInput(fields: Array<Object>): Promise<Object>`**
    *   Позволяет последовательно запрашивать ввод для нескольких полей, собирая результаты.
    *   **Параметры `fields`:** `{ name: string, prompt: string, type?: 'text'|'password'|'number'|'boolean'|'choice'|'multiline', ...readOptions, onComplete?: Function }`.

### `clige/utils/text.js`

Утилиты для обработки и форматирования текстовых строк.

*   **`truncateText(text: string, maxLength: number, suffix?: string): string`**
    *   Обрезает `text` до `maxLength`, добавляя `suffix` (`...`).
*   **`wrapWords(text: string, width: number, options?: Object): string`**
    *   Переносит слова в `text` на новую строку, если они превышают `width`.
    *   **Опции:** `preserveIndent`, `breakLongWords`.
*   **`padText(text: string, width: number, char?: string, align?: 'left' | 'center' | 'right'): string`**
    *   Дополняет `text` до `width` символом `char` с заданным `align`ментом. (Аналогично `renderer.pad`, но здесь отдельный модуль для текста).
*   **`extractWords(text: string, minLength?: number): string[]`**
    *   Извлекает уникальные слова из `text`, игнорируя те, что короче `minLength`.
*   **`highlightText(text: string, searchTerm: string, options?: Object): string`**
    *   Выделяет `searchTerm` в `text` с помощью ANSI-цветов.
    *   **Опции:** `highlightColor`, `caseSensitive`, `wholeWord`.
*   **`countWords(text: string): number`**
    *   Подсчитывает количество слов в `text`.
*   **`countCharacters(text: string, includeSpaces?: boolean): number`**
    *   Подсчитывает количество символов в `text` (с/без пробелов).
*   **`generateSlug(text: string, options?: Object): string`**
    *   Генерирует URL-friendly "слаг" из `text` (транслитерация, замена спецсимволов).
    *   **Опции:** `maxLength`, `separator`.
*   **`formatBytes(bytes: number, decimals?: number): string`**
    *   Форматирует число байтов в читаемый формат (KB, MB, GB).
*   **`formatDuration(seconds: number): string`**
    *   Форматирует продолжительность в секундах в формат `HH:MM:SS` или `MM:SS`.
*   **`parseTemplate(template: string, variables?: Object): string`**
    *   Заменяет плейсхолдеры `{{key}}` в `template` значениями из `variables`.
*   **`similarity(str1: string, str2: string): number`**
    *   Вычисляет коэффициент схожести (на основе расстояния Левенштейна) между двумя строками.
*   **`levenshteinDistance(str1: string, str2: string): number`** (Вспомогательная)
    *   Вычисляет расстояние Левенштейна между двумя строками.
*   **`cleanText(text: string, options?: Object): string`**
    *   Очищает `text` от ANSI-кодов, лишних пробелов, табуляций, переносов строк.
    *   **Опции:** `removeAnsi`, `removeExtraSpaces`, `removeTabs`, `removeLineBreaks`, `trim`.
*   **`capitalizeWords(text: string, options?: Object): string`**
    *   Преобразует первую букву каждого слова в заглавную.
    *   **Опции:** `excludeWords` (массив слов, которые не капитализируются).

### `clige/utils/validation.js`

Набор функций для валидации различных типов данных.

*   **`validateEmail(email: string): boolean`**
    *   Проверяет формат email-адреса.
*   **`validateUrl(url: string): boolean`**
    *   Проверяет формат URL.
*   **`validateIPAddress(ip: string): boolean`**
    *   Проверяет формат IPv4 или IPv6 адреса.
*   **`validatePhoneNumber(phone: string, country?: string): boolean`**
    *   Проверяет формат номера телефона (поддерживает `RU`, `US`, `INTERNATIONAL`).
*   **`validatePassword(password: string, options?: Object): { isValid: boolean, errors: string[], strength: string }`**
    *   Валидирует пароль по требованиям сложности.
    *   **Опции:** `minLength`, `requireUppercase`, `requireLowercase`, `requireNumbers`, `requireSpecialChars`, `forbiddenChars`.
*   **`calculatePasswordStrength(password: string): string`** (Вспомогательная)
    *   Оценивает сложность пароля (`'weak'`, `'medium'`, `'strong'`, `'very_strong'`).
*   **`validateFilePath(path: string, options?: Object): { isValid: boolean, errors: string[] }`**
    *   Валидирует путь к файлу.
    *   **Опции:** `mustExist`, `allowedExtensions`, `forbiddenChars`.
*   **`validateRange(value: any, min: number | null, max: number | null, type?: 'number' | 'string'): { isValid: boolean, errors: string[] }`**
    *   Проверяет, находится ли `value` в заданном диапазоне (`min`, `max`) для чисел или длины для строк.
*   **`validateRequired(value: any, fieldName?: string): { isValid: boolean, errors: string[] }`**
    *   Проверяет, не является ли `value` пустым или `null`/`undefined`.
*   **`validateRegex(value: string, pattern: RegExp, errorMessage?: string): { isValid: boolean, errors: string[] }`**
    *   Валидирует `value` с использованием регулярного выражения `pattern`.
*   **`validateDate(dateString: string, options?: Object): { isValid: boolean, errors: string[], parsedDate: Date | null }`**
    *   Валидирует строку даты.
    *   **Опции:** `format` (не используется явно в коде, но подразумевает формат), `minDate`, `maxDate`.
*   **`validateJSON(jsonString: string): { isValid: boolean, errors: string[], parsed: Object | null }`**
    *   Проверяет, является ли строка корректным JSON.
*   **`validateCreditCard(cardNumber: string): { isValid: boolean, errors: string[], cardType: string | null }`**
    *   Валидирует номер кредитной карты с помощью алгоритма Луна и определяет тип карты.
*   **`luhnCheck(cardNumber: string): boolean`** (Вспомогательная)
    *   Выполняет проверку номера по алгоритму Луна.
*   **`createValidator(rules: Object): (data: Object) => { isValid: boolean, fields: Object, errors: string[] }`**
    *   Создает единый валидатор из объекта `rules`, где ключи - это имена полей, а значения - массивы функций-валидаторов для этого поля.
    *   Возвращает функцию, которая принимает объект `data` и возвращает результат валидации всех полей.

## V. Themes Modules

Система тем позволяет настраивать внешний вид CLI-приложения, определяя цвета, стили и настройки компонентов.

### `clige/themes/default.js`

*   **`defaultTheme`**: `Object`
    *   Объект, определяющий стандартную, светлую тему по умолчанию. Включает категории:
        *   `name`, `description`: Метаинформация о теме.
        *   `colors`: Основные и яркие цвета, цвета текста, фона, границ, акцентов.
        *   `styles`: Общие стили для текста (заголовки, акценты, код, ссылки).
        *   `components`: Настройки стилей для конкретных компонентов (`box`, `menu`, `progress`, `input`, `table`).
        *   `messages`: Префиксы и цвета для различных типов сообщений (успех, ошибка, предупреждение, информация).
*   **`applyTheme(theme?: Object): { get: (path: string) => any, colorize: (text: string, colorPath: string) => string, style: (text: string, stylePath: string) => string }`**
    *   Создает обертку для удобного доступа к свойствам `theme` и применения стилей.
    *   **Методы:**
        *   `get(path: string)`: Получает значение по пути (например, `'colors.primary'`).
        *   `colorize(text: string, colorPath: string)`: Применяет цвет из темы к тексту.
        *   `style(text: string, stylePath: string)`: Применяет стиль из темы к тексту.

### `clige/themes/dark.js`

*   **`darkTheme`**: `Object`
    *   Объект, определяющий тёмную тему. Структура аналогична `defaultTheme`, но с другими цветовыми схемами и настройками.

### `clige/themes/redblood.js`

*   **`redbloodTheme`**: `Object`
    *   Объект, определяющий агрессивную красно-чёрную тему. Включает уникальные цвета (`blood`, `crimson`, `fire`), специфические стили (`logo`, `danger`, `shadow`), а также дополнительные префиксы сообщений и ASCII-арты.

### `clige/themes/index.js`

Основной модуль для управления темами.

*   **`availableThemes`**: `Object`
    *   Объект, содержащий все доступные предопределенные темы по их именам (`default`, `dark`, `redblood`).
*   **`getTheme(themeName?: string): Object`**
    *   Возвращает обертку `applyTheme` для указанной `themeName`. Если тема не найдена, используется `defaultTheme` с предупреждением.
*   **`listThemes(): Array<{ name: string, description: string }>`**
    *   Возвращает массив объектов с именем и описанием всех доступных тем.
*   **`createCustomTheme(baseTheme: string, overrides: Object): Object`**
    *   Создает новую тему, наследуя от `baseTheme` (или `defaultTheme`, если не указана) и применяя `overrides`. Использует глубокое слияние объектов. Возвращает обертку `applyTheme` для новой темы.
*   **`applyTheme(theme: Object): Object`**
    *   (Переэкспортируется из `default.js`). См. описание выше.

Отлично, вот последняя мини-часть документации, посвященная файлу `index.js`.

***

# API Reference (заключение)

## VI. Main Entry Point

### `clige/index.js`

Основной файл библиотеки, который агрегирует и переэкспортирует все публичные функции и объекты из подмодулей. Это позволяет импортировать большинство функций напрямую из корневого модуля `clige`.

*   **Назначение:** Служит унифицированной точкой входа для использования всего функционала библиотеки, минимизируя количество `require()` операторов.
*   **Переэкспортирует:**
    *   Все экспорты из `clige/core/colors.js`
    *   Все экспорты из `clige/core/renderer.js`
    *   Все экспорты из `clige/core/terminal.js`
    *   Все экспорты из `clige/components/boxes.js`
    *   Все экспорты из `clige/components/forms.js`
    *   Все экспорты из `clige/components/layouts.js`
    *   Все экспорты из `clige/components/menu.js`
    *   Все экспорты из `clige/components/progress.js`
    *   Все экспорты из `clige/utils/input.js`
    *   Все экспорты из `clige/utils/text.js`
    *   Все экспорты из `clige/utils/validation.js`
    *   Все экспорты из `clige/strings/formatters.js`
    *   Все экспорты из `clige/themes/index.js`

*   **Пример использования:**
    ```javascript
    const clige = require('clige');

    // Вместо const { COLORS } = require('./core/colors');
    console.log(clige.COLORS.GREEN + 'Привет, Clige!' + clige.COLORS.RESET);

    // Вместо const { drawBox } = require('./components/boxes');
    console.log(clige.drawBox('Моя первая коробка', { color: clige.COLORS.BLUE }));

    // Вместо const { createForm } = require('./components/forms');
    async function runForm() {
        const result = await clige.createForm([{ name: 'username', label: 'Имя' }]);
        console.log(result.data);
    }
    runForm();
    ```