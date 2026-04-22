# Campaign Management System - Frontend

A modern, responsive user interface built with Next.js for managing contacts and marketing campaigns.

## ✨ Features

- **Contacts Directory**: Infinite scrolling list of contacts with search, tag filtering, and sorting.
- **CSV Bulk Upload**: High-speed contact ingestion with real-time validation for record limits (10k max).
- **Campaign Dashboard**: Create, monitor, and execute marketing campaigns.
- **Responsive Design**: Mobile-first approach using Tailwind CSS.
- **Micro-animations**: Smooth transitions and loading states using Lucide icons.

## 🛠 Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in `.env`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## 🧠 Design Decisions

### 1. Debounced Filtering
Implemented a 800ms debounce on search and tag filters to reduce API load and prevent UI flickering.

### 2. Client-Side Validation
Record count validation (10k limit) is performed directly in the browser using a **memory-efficient streaming approach**, allowing for validation without loading the entire file into memory.

### 3. Styling System
Combined Tailwind CSS for layout efficiency with Vanilla CSS for premium design tokens and glassmorphism.

### 4. Lucide Icons
Used SVG-based Lucide icons for crisp, themeable, and lightweight iconography.

### 5. Infinite Scroll
Implemented `IntersectionObserver` for seamless auto-loading of contacts to provide a premium user experience.

---

## 🔗 Links
- **Backend API**: http://localhost:3000/api-docs
