# Quiipi - Client Management Software

Quiipi is a comprehensive client management solution designed for agencies, freelancers, and small businesses to manage clients, projects, subscriptions, and invoices in one place.

## 🚀 Features

### 👥 Client Management
- Create and manage client profiles
- Track client contact information and addresses
- View client financial summaries and pending balances
- Monitor client projects and subscriptions

### 📊 Dashboard
- Real-time overview of business metrics
- Revenue charts and analytics
- Expiring subscriptions alerts
- Upcoming project deadlines
- Pending balances overview

### 📋 Project Management
- Create and track projects
- Set project deadlines and priorities
- Monitor project budgets and actual costs
- Track project milestones
- Associate subscriptions with projects

### 💳 Subscription Management
- Track domains, hosting, SSL certificates, and other subscriptions
- Monitor expiry dates with configurable alerts
- Track renewal costs and billing cycles
- Store login credentials securely
- Filter by type (domains, hosting, etc.)

### 💰 Invoice Management
- Create and send professional invoices
- Track payment status (draft, sent, paid, overdue)
- Add multiple line items with quantities and discounts
- Record partial payments
- Generate invoice numbers automatically
- View payment history

### 🔔 Notifications
- Real-time alerts for expiring subscriptions
- Project deadline reminders
- Overdue invoice notifications
- Unread count badge in header

### 🌓 Theme Support
- Light and dark mode
- System preference detection
- Persistent theme selection

### 📱 Mobile Responsive
- Fully responsive design
- Mobile-optimized layouts
- Touch-friendly interfaces
- Bottom sheets for mobile dialogs

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Recharts** - Data visualization
- **date-fns** - Date manipulation
- **Axios** - HTTP client

### UI Components
- Custom shadcn/ui inspired component library
- Responsive dialog with bottom sheets on mobile
- Toast notifications
- Dropdown menus
- Tabs
- Cards
- Tables

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── clients/         # Client-related components
│   ├── dashboard/       # Dashboard widgets
│   ├── invoices/        # Invoice components
│   ├── layout/          # Layout components (Sidebar, Header)
│   ├── notifications/   # Notification components
│   ├── projects/        # Project components
│   └── subscriptions/   # Subscription components
├── contexts/            # React contexts (Theme, Auth)
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── pages/               # Page components
├── services/            # API service layers
├── store/               # Zustand stores
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd quiipi-ui
```

2. Install dependencies
```bash
pnpm install
```

3. Create a `.env` file
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

4. Start development server
```bash
pnpm dev
```

## 🔌 API Integration

Key endpoints:
- `POST /auth/login` - User login
- `GET /clients` - List all clients
- `POST /projects` - Create project
- `GET /subscriptions/expiring` - Get expiring subscriptions
- `GET /dashboard/summary` - Get dashboard summary

## 📱 Mobile Features

- Responsive sidebar that collapses on mobile
- Bottom sheet dialogs instead of modals
- Touch-optimized buttons (44px minimum)
- Mobile-specific card views

## 🔒 Authentication

JWT-based authentication with:
- Access token (short-lived)
- Refresh token (long-lived)
- Automatic token refresh
- Protected routes

## 🧪 Development Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm type-check   # Run TypeScript type checking
```

---

Built with ❤️ by jjenus