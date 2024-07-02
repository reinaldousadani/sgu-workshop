IMPORTANT NOTE:
This is only for academic purposes, DO NOT ever commit .env files/sqlite files to your repositories.

SETTING UP FOR DEV:
1. npm install (node 18+)
2. npm i -g dotenv
3. dotenv -e .env.development.local -- npx prisma migrate dev
4. npm run start:dev

A lot of things can be improved on this project such as:
1. Continue to implement the full e2e tests & unit tests till it fully complete(currently not fully complete yet)
2. Hash the password of users using strong algo like bcrypt
3. Implement HATEOAS
4. Use a proper secret key for JWT. (For example RS256 or SHA256)
5. Implement a access & refresh token mechanism.
6. And many many more

If you have any question regarding this codebase, feel free to contact me at:
- reinaldobbu.work@gmail.com
- https://www.linkedin.com/in/reinaldo-usadani/