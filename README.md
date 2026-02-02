# 🛒 ProStore — AI-Powered Ecommerce Platform

**ProStore** is a modern, full-stack ecommerce platform built with the latest Next.js and React features.  
It combines a production-ready shopping experience with **PayPal Payments** and an **AI-powered chatbot** to assist customers in real time.

## 🧱 Tech Stack

- React 19
- Next.js 16
- TypeScript
- Tailwind CSS
- ShadCN
- React Hook Form
- PostgreSQL
- Prisma ORM
- OpenAI API

## 🚀 Getting Started

### Pre-Requisites

- [Node 18+](https://nodejs.org/en/download)
- [PayPal Developer Account](https://developer.paypal.com/home/), and [Sandbox Accounts](https://developer.paypal.com/dashboard/accounts)
- [Neon Serverless Postgres from Vercel](https://vercel.com/marketplace/neon)
- [Vercel AI Gateway](https://vercel.com/ai-gateway)

### Environment Variables

1. Rename `.env.dist` to `.env`.
2. Set the value of `NEXTAUTH_SECRET` from `npx auth secret`.
3. `DATABASE_URL` - [Log into Vercel](https://vercel.com/login) > Storage > Create Database > Neon Serverless Postgres > Get the URL.
4. `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` - [Log into PayPal Developer](https://developer.paypal.com/home/) > Apps & Credentials > Create App > Merchant > Get the credentials.
5. `AI_GATEWAY_API_KEY` - [Log into Vercel](https://vercel.com/login) > AI Gateway > Create an API Key > Get the key.

### Run

1. `npm install`
2. Seed the database: `npx tsx ./db/seed`
3. `npm run dev`

## 📚 Project Background & Credits

Inspired by [Brad Traversy's Tutorial](https://www.traversymedia.com/nextjs-ecommerce).

ProStore began as a **framework upgrade exercise**, starting from a Next 15 course and leveraging prior hands-on experience with Next 13. This project was adopted to use the latest versions of the tools and extended its features.

## 🚧 Project Status

ProStore is **under active development**.  
The core architecture and integrations are in place, with ongoing improvements planned around features, polish, and scalability.
