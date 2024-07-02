IMPORTANT NOTE:
This is only for academic purposes, don't ever commit .env files/sqlite files to your repositories.

SETTING UP FOR DEV:
1. npm install (node 18+)
2. npm i -g dotenv
3. dotenv -e .env.development.local -- npx prisma migrate dev
4. npm run start:dev

