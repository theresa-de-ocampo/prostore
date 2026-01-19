# 3. Database, Prisma, & Product Display

1. Once you've created that database in Vercel, don't copy the environment variables just yet because Prisma can handle it for you.
2. `npx prisma init` creates a schema file (`prisma/schema.prisma`) where we create all of our models. This also adds `DATABASE_URL` into `.env` with dummy values.
3. Define your models.
4. Add `postinstall: prisma generate` to `package.json` to make sure that the Prisma client has been generated after deployment. To generate a Prisma client locally, use `npx prisma generate`.
5. Run `npx prisma migrate dev --name init`. It's a database migration tool that automatically generates SQL migration files from changes in your declarative Prisma schema. This is the command that will create the actual tables. Failure to execute this will throw errors in the Studio: `Prisma Client Error. Unable to run script. No default workspace found.` You should run this command whenever you make changes to `schema.prisma`.
6. `npx prisma studio`
7. `npx tsx ./db/seed`

## 3.1. API Routes vs Server Actions

Mobile Apps

## 3.2. Fetching from the Prisma Database

- What the Prisma client returns initially is a Prisma object that's why you have to convert it first.
- By default, layouts and pages are server components which lets you fetch data and render parts of your UI on the server. That's why `getLatestProducts` was not placed inside a `useEffect`.

## 3.3. [Serverless Environment Configuration](https://neon.com/docs/serverless/serverless-driver)

Traditional databases maintain persistent TCP connections to handle requests. However, serverless environments (like Vercel) are designed to scale automatically and don’t maintain persistent connections between invocations. If you try to connect directly to a database from a serverless function (actions or `pages/api`), you might run into issues like:

- **Connection limits**: Serverless environments can spawn many instances simultaneously, exceeding database connection limits.
- **Cold starts**: Connections are slow to initialize in serverless environments.
- **Incompatibility with WebSockets**: Neon uses WebSockets for serverless compatibility, while Prisma assumes a traditional TCP setup.

The Neon adapter solves these problems by adapting Prisma’s behavior to Neon’s serverless architecture. It allows Prisma to manage connections using WebSockets and pooling, so that it works in a serverless context.

### Packages

- `npm i @neondatabase/serverless`
- `npm i @prisma/adapter-neon`
- `npm i ws`
- `npm i @types/ws --save-dev`
- `npm i bufferutil --save-dev`

### What happens if you don't use `.$extends`?

It will throw `Type 'Decimal' is not assignable to type 'string'`. Note that even if you change the type of the price to a number in the Zod schema, it will then throw `Type 'Decimal' is not assignable to type 'number'`. Keep in mind that Prisma uses **Decimal.js**.

## 3.4. Product Details Page

Aside from using `props.params`, you can also use `useRouter`.
