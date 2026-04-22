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

## 🧠 Design Decisions & Trade-offs

### 1. Debounced Filtering
- **Decision**: Implemented a 800ms debounce on search and tag filters.
- **Trade-off**: Slightly delayed feedback (0.8s), but drastically reduces the number of API calls, saving server resources and preventing UI flickering during rapid typing.

### 2. Client-Side Validation
- **Decision**: Added record count validation (10k limit) directly in the browser before uploading to Cloudinary.
- **Trade-off**: Requires reading the file content on the client side (using `file.text()`), which could be memory-intensive for massive files, but provides instant feedback to the user without wasting bandwidth on an invalid upload.

### 3. Tailwind CSS & Vanilla CSS
- **Decision**: Used Tailwind for layout utility and Vanilla CSS for custom design tokens (glassmorphism, dark mode colors).
- **Trade-off**: Two different styling approaches, but it provides the best of both worlds: rapid layout development and a deeply customized, premium aesthetic.

### 4. Lucide Icons
- **Decision**: Used SVG-based Lucide icons.
- **Trade-off**: Adds a small bundle size, but ensures icons are crisp, themeable via CSS, and lightweight compared to icon fonts.

### 5. Infinite Scroll
- **Decision**: Used `IntersectionObserver` for auto-loading more contacts.
- **Trade-off**: More complex to implement than "Load More" buttons, but creates a seamless "premium" feel for the user.

---

## 🔗 Links
- **Backend API**: http://localhost:3000/api-docs
