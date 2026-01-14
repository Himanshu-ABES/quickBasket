# 🛒 quickBasket

A pixel-perfect clone of Blinkit (Quick Commerce) built with modern web technologies.

![quickBasket](https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&h=400&fit=crop)

## 🚀 Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **State Management:** Zustand
- **Icons:** Lucide React
- **Animations:** Framer Motion

## 🎨 Design Philosophy

- **Minimalist & Aesthetic:** Heavy use of whitespace
- **Rounded corners:** `rounded-xl` for cards
- **Brand Colors:**
  - Primary Yellow: `#F8CB46` (CTAs)
  - Green: `#0F8A65` (Veg indicators)
  - Dark: `#0C0C0C`

## 📁 Project Structure

```
quickBasket/
├── src/
│   ├── components/
│   │   └── ProductCard.jsx    # Smart product card with ADD/counter
│   ├── store/
│   │   └── useCartStore.js    # Zustand cart store with Supabase sync
│   ├── lib/
│   │   └── supabase.js        # Supabase client configuration
│   └── ...
├── supabase/
│   └── schema.sql             # Database schema, RLS policies, seed data
├── tailwind.config.js
├── package.json
└── .env.example
```

## 🗄️ Database Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run** to execute the script

The script will:

- Create `categories`, `products`, and `cart_items` tables
- Enable Row Level Security (RLS) policies
- Seed 6 categories with 24 products (4 per category)

## ⚙️ Environment Setup

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## 🏃‍♂️ Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔐 Authentication

Cart items are protected by Row Level Security. Users must be authenticated to:

- Add items to cart
- Update cart quantities
- Remove items from cart

Categories and products are publicly readable.

## 📦 Key Components

### ProductCard.jsx

A smart product card component that:

- Shows "ADD" button when quantity is 0
- Transforms to quantity counter (- count +) when added
- Includes Framer Motion scale animations
- Displays veg/non-veg indicators
- Shows discount badges

### useCartStore.js

Zustand store with:

- `addItem(product)` - Add product to cart
- `removeItem(productId)` - Decrease quantity or remove
- `clearCart()` - Clear all items
- `selectCartTotal` - Computed cart total
- `selectItemCount` - Total items count
- `selectTotalSavings` - Total savings from discounts
- **Optimistic updates** - UI updates instantly, syncs with Supabase in background

## 📄 License

MIT
