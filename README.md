# Запуск проекта

## Требования к среде

- **Node.js**: `>=22 <23`
- **npm**: идёт вместе с Node 22
- ОС: macOS / Linux / Windows

---

## 1) Клиент (Vite + React)

### 1.1 Создать файл окружения

В корне клиентского проекта создайте файл **`.env`** со строкой:

```env
VITE_API_ORIGIN=http://localhost:3022
```

> При необходимости можно указать свой адрес API.

### 1.2 Установка зависимостей

Из ветки **`main`**:

```bash
npm install
```

### 1.3 Сборка и превью (production-like)

```bash
npm run build
npm run preview
```

Откройте в браузере: **http://localhost:4173/**

### (Опционально) Режим разработки

```bash
npm run dev
```

Обычно откроется **http://localhost:5173/**

---

## 2) Сервер (API)

Склонируйте и запустите тестовый сервер:

```bash
git clone https://github.com/maxbit-solution/frontend_technical_task
cd frontend_technical_task
npm install
npm run start
```

По умолчанию сервер поднимется на **http://localhost:3022**.

---

## 3) Тесты

В клиентском проекте:

```bash
npm run test
```

- Используется **Vitest** (+ Testing Library).
- Тесты ищутся по `*.test.ts` / `*.test.tsx`.

---

## Полезные заметки

- Переменные окружения клиента начинаются с `VITE_…`. В данном проекте используется:
  - `VITE_API_ORIGIN` — базовый URL API (например, `http://localhost:3022`).
- Если **сервер** поднят не на `http://localhost:3022`, обновите значение в `.env` и перезапустите клиент.
- Для корректной работы защищённых эндпоинтов потребуется авторизация (JWT). В интерфейсе предусмотрены страницы регистрации/логина.
- При ошибках CORS убедитесь, что сервер отвечает с корректными заголовками и что `VITE_API_ORIGIN` указывает на актуальный домен/порт.

---

## Краткий чек-лист запуска

1. Поднять **сервер**:
   ```bash
   git clone https://github.com/maxbit-solution/frontend_technical_task
   cd frontend_technical_task
   npm install
   npm run start
   ```
2. Подготовить **клиент**:
   ```bash
   # в корне клиента
   echo "VITE_API_ORIGIN=http://localhost:3022" > .env
   npm install
   npm run build
   npm run preview
   ```
3. Открыть **http://localhost:4173/** в браузере.
4. Запустить **тесты** (по желанию):
   ```bash
   npm run test
   ```
