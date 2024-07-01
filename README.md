dotenv -e .env.development.local -- npx prisma migrate dev
dotenv -e .env.test.local -- npx prisma migrate dev 