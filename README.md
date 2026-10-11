# 🛒 বাজার দর | BazarDor

A responsive Bengali market-price application for viewing daily
essential-product prices, price changes, and market comparisons.



## 🛠️ Technologies

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Better Auth
- MongoDB
- React Hot Toast

## ✨ Key Features

1. **Daily Market Prices**
   Browse essential products with Bengali prices, units, and change badges.

2. **Top Price Changes**
   View the top six price risers and fallers.

3. **Category Browsing and Sorting**
   Browse categories and sort prices numerically in ascending or descending order.

4. **Protected Product Details**
   Signed-in users can view minimum, maximum, average, and market-specific prices.

5. **Authentication**
   Email/password registration and login, plus Google and GitHub social login.

6. **Profile Updates**
   Update your name from a dedicated profile update page.

7. **Responsive Design**
   Layouts adapt to mobile, tablet, and desktop screens.

8. **Loading and Error States**
   Skeleton loaders, toast notifications, and friendly 404 pages.

## 📄 Routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Home and product lists | Public |
| `/category/[slug]` | Category products and sorting | Public |
| `/product/[slug]` | Product and market prices | Protected |
| `/signin` | Sign in | Public |
| `/signup` | Register | Public |
| `/profile` | User profile | Protected |
| `/profile/update` | Update name | Protected |

## 🚀 Local Setup

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root:

```dotenv
MONGODB_URI=
MONGODB_DB_NAME=bazar-dor-v2
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Use a valid MongoDB connection string and a strong, randomly generated
Better Auth secret of at least 32 characters.

Configure OAuth callback URLs:

```text
Google: http://localhost:3000/api/auth/callback/google
GitHub: http://localhost:3000/api/auth/callback/github
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

## 📦 Production Build

```bash
npm run build
npm start
```

For deployment, configure environment variables and set
`BETTER_AUTH_URL` to the production website URL.

Configure Google and GitHub OAuth callback URLs using the production
domain and their respective `/api/auth/callback/` paths.

Never commit `.env.local` or actual credentials.

## 🌐 Product API

The application tries these API providers in order:

1. https://openapi.programming-hero.com/api/bazardor
2. https://api.api-store.workers.dev/api/bazardor
3. https://api.abcz.workers.dev/api/bazardor

Endpoints:

- `/products`
- `/products?category=chal`
- `/products/:id`
- `/categories`
- `/categories/:slug`

## 📝 Price Information

Prices are indicative and may vary by market.

The average price is calculated by averaging the midpoint of each
market’s minimum and maximum prices.

## 👨‍💻 Author

**Md Asraful Islam**

GitHub: https://github.com/Asraful666