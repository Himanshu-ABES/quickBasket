# 🛒 quickBasket

A full-stack Blinkit clone - Modern grocery delivery web application built with React and Express.

![quickBasket](https://img.shields.io/badge/quickBasket-Grocery%20Delivery-green)

## 📁 Project Structure

```
quickBasket/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
├── backend/            # Express.js backend
│   ├── src/
│   │   └── index.js
│   ├── supabase/
│   │   └── schema.sql
│   └── package.json
├── package.json        # Root package.json
└── README.md
```

## 🚀 Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend

- **Express.js** - Node.js framework
- **Supabase** - Database & Authentication
- **CORS** - Cross-origin requests

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Himanshu-ABES/quickBasket.git
   cd quickBasket
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install all project dependencies
   npm run install:all
   ```

3. **Configure environment variables**

   Frontend (`frontend/.env`):

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Backend (`backend/.env`):

   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=5000
   ```

4. **Setup Supabase Database**

   - Go to your Supabase project
   - Run the SQL from `backend/supabase/schema.sql`

5. **Run the application**

   ```bash
   # Run both frontend and backend
   npm run dev

   # Or run separately
   npm run frontend   # Frontend on http://localhost:5173
   npm run backend    # Backend on http://localhost:5000
   ```

## 📦 Available Scripts

| Command               | Description                   |
| --------------------- | ----------------------------- |
| `npm run dev`         | Run both frontend and backend |
| `npm run frontend`    | Run frontend only             |
| `npm run backend`     | Run backend only              |
| `npm run install:all` | Install all dependencies      |
| `npm run build`       | Build frontend for production |

## ✨ Features

- 🏠 Beautiful Blinkit-style homepage
- 📦 Product categories with images
- 🛒 Shopping cart with Zustand
- 🔍 Animated search bar
- 📱 Fully responsive design
- ⚡ Fast Vite development
- 🎨 Tailwind CSS styling
- 🔄 Smooth animations with Framer Motion

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

---

Made with ❤️ by [Himanshu-ABES](https://github.com/Himanshu-ABES)
