Быстрый запуск
Требования
Java 17+ (JDK для backend)
Node.js 18+ (для frontend)
PostgreSQL 15+ (база данных)
Maven 3.8+ (сборка Java проекта)
Docker & Docker Compose (опционально, для контейнеризации)
 Вариант 1: Запуск через Docker (рекомендуется)
1. Клонируйте проект
git clone https://github.com/ваш-логин/flowersupply-java.git cd flowersupply-java
2. Запустите все сервисы одной командой
docker-compose up -d
3. Откройте в браузере:
Frontend: http://localhost:3000
Backend API: http://localhost:8080/api

Вариант 2: Ручная установка
Backend (Java Spring Boot)
1. Установите PostgreSQL
Для macOS:
brew install postgresql brew services start postgresql
Для Windows: скачайте с https://www.postgresql.org/download/windows/
2. Создайте базу данных
createdb flowersupply
3. Перейдите в папку backend
cd backend
4. Соберите проект
mvn clean package
5. Запустите приложение
java -jar target/flowersupply-backend-1.0.0.jar
Frontend (React)
1. Перейдите в папку frontend
cd frontend
2. Установите зависимости
npm install
3. Запустите разработческий сервер
npm start
4. Откройте http://localhost:3000
