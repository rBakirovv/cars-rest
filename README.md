# Каталог автомобилей

Full-stack приложение для управления каталогом автомобилей на React + Node.js + PostgreSQL.

## Требования

- Node.js v18+
- Docker (рекомендуется) или PostgreSQL 14+
- npm

## Технологии

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Hook Form
- React Router DOM

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT Authentication
- bcryptjs

## Быстрый запуск (авто-режим)

```bash
# Установить зависимости
npm run install:all

# Запустить всё автоматически
npm run dev:auto
```

**Авто-режим** (`npm run dev:auto`) сделает всё сам:
1. Проверит, запущен ли Docker
2. Поднимет контейнер с PostgreSQL (если не запущен)
3. Дождётся готовности базы
4. Применит Prisma-миграции
5. Заполнит тестовыми данными (если база пустая)
6. Запустит фронтенд и бэкенд

После запуска:
- Фронтенд: [http://localhost:5173](http://localhost:5173)
- Бэкенд: [http://localhost:3001](http://localhost:3001)

## Ручная настройка

### 1. Установка зависимостей

```bash
npm run install:all
```

### 2. Переменные окружения

```bash
cp backend/.env.example backend/.env
```

Отредактировать `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/car_catalog
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3001
```

### 3. База данных

#### Вариант А: Docker (рекомендуется)

```bash
docker compose up -d
```

Поднимет PostgreSQL на `localhost:5432`:
- База: `car_catalog`
- Пользователь: `postgres`
- Пароль: `password`

#### Вариант Б: Локальный PostgreSQL

```bash
# macOS
brew install postgresql@16
brew services start postgresql@16
createdb car_catalog
```

### 4. Миграции и тестовые данные

```bash
cd backend

npm run db:migrate   # создать таблицы
npm run db:seed      # заполнить тестовыми данными

# или сразу всё
npm run db:setup
```

Создаст:
- Таблицы `users` и `cars`
- 30 тестовых автомобилей
- 2 тестовых пользователя

### 5. Запуск

```bash
# Из корня — фронт + бэк одновременно
npm run dev

# Или раздельно
npm run dev:backend
npm run dev:frontend
```

## Тестовые пользователи

| Email | Пароль |
|-------|--------|
| admin@example.com | password123 |
| test@example.com | password123 |

## Функциональность

- Регистрация и авторизация (JWT)
- Список автомобилей с пагинацией
- Поиск по марке, модели или VIN
- Сортировка по любой колонке
- Изменение ширины колонок таблицы
- Добавление автомобиля
- Просмотр карточки автомобиля
- Редактирование
- Удаление с подтверждением
- Защищённые маршруты
- Страница 404
- Адаптивный дизайн

## API

### Авторизация
- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход
- `GET /api/auth/me` — текущий пользователь (защищён)

### Автомобили (все защищены)
- `GET /api/cars` — список (пагинация, поиск, сортировка)
- `GET /api/cars/:id` — один автомобиль
- `POST /api/cars` — создать
- `PUT /api/cars/:id` — обновить
- `DELETE /api/cars/:id` — удалить

## Структура проекта

```
cars-rest/
├── frontend/
│   └── src/
│       ├── api/          # API-клиент
│       ├── components/   # React-компоненты
│       ├── context/      # Auth context
│       ├── pages/        # Страницы
│       └── types/        # TypeScript-типы
├── backend/
│   └── src/
│       ├── db/           # Подключение к БД, миграции, seed
│       ├── middleware/   # Auth middleware
│       ├── routes/       # Роуты API
│       └── types/        # TypeScript-типы
└── package.json          # Корневые скрипты
```

## Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `DATABASE_URL` | Строка подключения к PostgreSQL | — |
| `JWT_SECRET` | Секрет для JWT-токенов | — |
| `JWT_EXPIRES_IN` | Время жизни токена | `7d` |
| `PORT` | Порт бэкенда | `3001` |
| `FRONTEND_URL` | URL фронтенда для CORS | `http://localhost:5173` |
