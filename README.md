# Store - CS 35L (Team: Handy) 
- Andy Alcazar, Gregory Weinrod, Hector Gil-Morales, Taewook Park

-----
## Project Overview 
- This project implements an online store website using Next.js. It provides basic functionality for users to view products and add them to the shopping cart.
- We are implementing the checkout process for products added to the shopping cart.
- We are integrating the login feature by utilizing a user authentication API.
- Utilized : JavaScript, TypeScript, Next.js, React, Vercel, Firebase

------
## Setup
- **Homebrew (macOS terminal)**:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

- **git (homebrew)**:
```
brew install git
```

- **node.js (homebrew)**:
```
brew install node
```

- **firebase (homebrew)**:
```
npm install firebase
```

- **ESLint and Prettier  (homebrew)**:
```
npm install eslint prettier -D
```

- **Prisma (local test) (homebrew)**:
```
npm install -D prisma
```
```
npx prisma init
```

------
## Project Start
```
npx create-next-app@latest ./
```
```
✔ Would you like to use TypeScript? … No / **Yes**
✔ Would you like to use ESLint? … No / **Yes**
✔ Would you like to use Tailwind CSS? … No / **Yes**
✔ Would you like your code inside a `src/` directory? … No / **Yes**
✔ Would you like to use App Router? (recommended) … No / **Yes**
✔ Would you like to use Turbopack for next dev? … No / **Yes**
✔ Would you like to customize the import alias (@/* by default)? … No / **Yes**
✔ What import alias would you like configured? … @/*
Creating a new Next.js app in /Users/teo/Desktop/store-cs35.
```

## Project Run
```
npx run dev
```
```
   - Local:  http://localhost:3535
```

## GitHub Pull Guide
```
git remote -v
```
- **Fetch**
```
git fetch origin
```
- **Pull**
```
git pull origin main
```
```
git status
```
