### Cortex API Server
```
https://github.com/RHL-RWT-01/cortex-be
```

# Cortex Client

Frontend application for the Cortex Engineering Thinking Training Platform - a platform designed to help engineers develop structured thinking and architectural reasoning skills.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components with Lucide React icons
- **Animations**: Framer Motion
- **Diagramming**: Excalidraw
- **HTTP Client**: Axios

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- Running Cortex API server (see [cortex-server](https://github.com/RHL-RWT-01/cortex-server))

### 2. Installation

```bash
# Navigate to client directory
cd cortex-client

# Install dependencies
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, update the API URL to your deployed backend URL.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## Features

### 1. **Landing Page**
- Premium black and white design
- Feature showcase
- Solutions overview
- User testimonials
- Call-to-action sections

### 2. **Authentication**
- User registration and login
- JWT-based authentication
- Protected routes
- Persistent sessions

### 3. **Dashboard**
- Progress statistics (streaks, completion rates)
- Recent activity feed
- Quick access to tasks and drills
- Skill progress visualization

### 4. **Tasks System**
- Role-based engineering tasks (Backend, Frontend, Systems, Data)
- Difficulty filtering (easy, medium, hard)
- Random task picker
- Interactive workspace with Excalidraw integration
- Structured response submission (assumptions, architecture, trade-offs, failure scenarios)
- AI-powered scoring and feedback (time-gated)

### 5. **Thinking Drills**
- Quick thinking exercises
- Multiple-choice format
- Instant feedback
- Progress tracking
- Statistics dashboard

### 6. **Profile Management**
- Update user information
- Role selection
- Preference management
- Activity history

### 7. **Admin Panel**
- Task management (create, edit, delete)
- Drill management
- Search and filter capabilities
- Protected admin routes

### 8. **Response History**
- View all submitted responses
- Detailed response breakdown
- AI feedback and scores
- Markdown-rendered feedback

## Project Structure

```
cortex-client/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Landing page
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── dashboard/           # Dashboard page
│   ├── tasks/               # Tasks listing
│   ├── task/[id]/           # Individual task workspace
│   ├── drills/              # Thinking drills
│   ├── profile/             # User profile
│   ├── responses/           # Response history
│   │   └── [id]/           # Individual response detail
│   └── admin/               # Admin panel
├── components/              # Reusable components
│   ├── Navbar.tsx          # Navigation bar
│   ├── ProtectedRoute.tsx  # Route protection HOC
│   ├── TaskCard.tsx        # Task display card
│   ├── DrillCard.tsx       # Drill display card
│   └── Footer.tsx          # Footer component
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts          # Authentication hook
│   ├── useApi.ts           # API client hook
│   └── useToast.ts         # Toast notifications hook
├── lib/                     # Utility libraries
│   ├── api.ts              # Axios instance configuration
│   ├── auth.ts             # Auth utilities
│   └── utils.ts            # General utilities
├── public/                  # Static assets
│   ├── logo.svg
│   └── images/
└── package.json            # Dependencies and scripts
```

## Key Pages

### Landing Page (`/`)
- Hero section with CTA
- Features overview
- Solutions showcase
- Testimonials
- Footer with links

### Dashboard (`/dashboard`)
- Statistics cards (streak, completion, average score)
- Recent activity
- Quick actions
- Skill progress charts

### Tasks (`/tasks`)
- Filter by role and difficulty
- Task cards with metadata
- Random task picker
- Navigation to task workspace

### Task Workspace (`/task/[id]`)
- Task details and prompts
- Excalidraw canvas for diagramming
- Response form (assumptions, architecture, trade-offs, failures)
- Submit and view AI feedback

### Drills (`/drills`)
- Random drill picker
- Multiple-choice questions
- Instant feedback
- Statistics and history

### Profile (`/profile`)
- User information
- Role and preferences
- Update profile

### Admin (`/admin`)
- Task management
- Drill management
- Search and filter
- Create/Edit/Delete operations

## Authentication Flow

1. User signs up or logs in
2. JWT token stored in localStorage
3. Token included in all API requests via Axios interceptor
4. Protected routes check for valid token
5. Redirect to login if unauthenticated

## API Integration

The client communicates with the Cortex API server using Axios. All API calls are centralized in `lib/api.ts` with automatic token injection.

Example endpoints:
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/tasks` - Fetch tasks
- `POST /api/responses` - Submit response
- `GET /api/progress/stats` - Get statistics

See `api_spec.md` for complete API documentation.

## Styling

The application uses a custom black and white theme with:
- CSS variables for consistent theming
- Tailwind CSS for utility-first styling
- Framer Motion for smooth animations
- Responsive design for all screen sizes

## Development Notes

### Protected Routes
All routes except `/`, `/login`, and `/signup` are protected using the `ProtectedRoute` component.

### Admin Access
Admin routes are protected by checking the user's email against the `ADMIN_EMAIL` environment variable on the server.

### Time-Gated Feedback
AI feedback for task responses is only available 5 minutes after submission to encourage independent thinking.

### State Management
- Authentication state managed via custom `useAuth` hook
- API calls managed via `useApi` hook
- Toast notifications via Sonner

## License

Proprietary - Cortex Platform
