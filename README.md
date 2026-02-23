# 💬 Tars — Real-Time Chat Application

A sleek, real-time chat application built with **Next.js 16**, **Convex**, and **Clerk**. Features instant messaging, typing indicators, online presence, and a responsive dark-mode UI.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Convex](https://img.shields.io/badge/Convex-Backend-ff6b35?logo=convex)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

---

## ✨ Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Authentication** | Secure sign-in/sign-up via Clerk with JWT-based auth |
| 2 | **User Search** | Find users by name or email to start conversations |
| 3 | **1:1 Conversations** | Create and manage direct message threads |
| 4 | **Real-Time Messaging** | Instant message delivery powered by Convex subscriptions |
| 5 | **Empty States** | Reusable empty state components for better UX |
| 6 | **Responsive Layout** | Mobile-first design with sidebar toggle on small screens |
| 7 | **Online/Offline Presence** | Live green dot indicators with 30s heartbeat |
| 8 | **Typing Indicators** | See when the other person is typing (with throttle) |
| 9 | **Unread Message Badges** | Numeric unread count badges on conversations |
| 10 | **Smart Auto-Scroll** | Auto-scrolls on new messages + "New messages" button |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Backend / Database** | [Convex](https://convex.dev/) (real-time reactive backend) |
| **Authentication** | [Clerk](https://clerk.com/) (JWT + session management) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://radix-ui.com/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Language** | TypeScript 5 |

---

## 📁 Project Structure

```
tars/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing → redirect to /chat or /sign-in
│   ├── chat/
│   │   ├── layout.tsx          # Chat layout (sidebar + main)
│   │   ├── page.tsx            # Welcome screen (no conversation selected)
│   │   └── [conversationId]/
│   │       └── page.tsx        # Active conversation view
│   ├── sign-in/[[...sign-in]]/ # Clerk sign-in page
│   └── sign-up/[[...sign-up]]/ # Clerk sign-up page
├── components/
│   ├── chat/
│   │   ├── ChatHeader.tsx      # Conversation header with user info
│   │   ├── ChatInput.tsx       # Message input with typing detection
│   │   ├── MessageBubble.tsx   # Individual message bubble
│   │   ├── MessageList.tsx     # Scrollable message list with auto-scroll
│   │   ├── NewMessageButton.tsx # "New messages" floating button
│   │   └── TypingIndicator.tsx # Animated typing dots
│   ├── sidebar/
│   │   ├── Sidebar.tsx         # Main sidebar wrapper
│   │   ├── ConversationList.tsx # List of conversations with badges
│   │   └── UserSearch.tsx      # User search dropdown
│   ├── providers/
│   │   ├── ConvexClerkProvider.tsx # Auth + DB provider setup
│   │   └── UserSync.tsx        # Syncs Clerk user → Convex DB
│   ├── shared/
│   │   └── EmptyState.tsx      # Reusable empty state component
│   └── ui/                     # shadcn/ui components
├── convex/
│   ├── schema.ts               # Database schema (5 tables)
│   ├── auth.config.ts          # Clerk JWT configuration
│   ├── users.ts                # User upsert, search, get
│   ├── conversations.ts        # Create, list, mark-as-read
│   ├── messages.ts             # Send, get messages
│   ├── presence.ts             # Heartbeat, set offline
│   └── typing.ts               # Set, clear, get typing status
├── hooks/
│   ├── usePresence.ts          # Presence heartbeat hook
│   └── useTyping.ts            # Typing indicator hook
├── lib/
│   ├── formatTime.ts           # Date formatting utilities
│   └── utils.ts                # cn() utility
└── proxy.ts                    # Clerk middleware (route protection)
```

---

## 🗄 Database Schema

```
users              → clerkId, name, email, imageUrl, isOnline, lastSeen
conversations      → lastMessageId, lastMessageTime
conversationMembers → conversationId, userId, lastReadTime
messages           → conversationId, senderId, content
typingIndicators   → conversationId, userId, lastTypedAt
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Clerk](https://clerk.com/) account
- A [Convex](https://convex.dev/) account

### 1. Clone the repository

```bash
git clone https://github.com/kartikv-04/tars.git
cd tars
npm install
```

### 2. Set up environment variables

Create a `.env` file in the root:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 3. Configure Convex

```bash
npx convex dev
```

This will prompt you to log in and link your project. Then set the Clerk JWT issuer domain on Convex:

```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN https://your-clerk-domain.clerk.accounts.dev
```

### 4. Configure Clerk

1. Go to **Clerk Dashboard** → **JWT Templates** → Create a new **Convex** template
2. Under **User & Authentication**, set **Name** to **Required**

### 5. Run the development server

```bash
# Terminal 1 — Convex backend
npx convex dev

# Terminal 2 — Next.js frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting.

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com/)
3. Add environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CONVEX_URL`
4. Set build command: `npm run build`
5. Deploy!

---

## 📄 License

This project is part of an internship assessment. All rights reserved.
