# G.R.A.C.E.

**Guided Responsive Assistant for Companionship & Engagement**

## Overview

GRACE is a real-time voice companion application designed to reduce loneliness and improve well-being for **older adults, socially-isolated people, and their caregivers**. The app provides an engaging conversational experience through an on-screen avatar, wellness features, and caregiver insights to support both users and their support networks.

## Purpose & Mission

Loneliness and social isolation are significant challenges, particularly for older adults and individuals with limited social connections. GRACE addresses this by offering:

- **24/7 Companionship**: A responsive AI companion that's always available for conversation
- **Accessible Design**: Built with accessibility in mind, featuring large text, high contrast modes, and full keyboard navigation
- **Caregiver Support**: Tools and insights to help caregivers monitor and support their loved ones
- **Privacy-First**: Audio is never stored, with automatic chat deletion and crisis escalation protocols

## Key Features

### 🗣️ Core Conversation

- **Ultra-low latency** (<1 second response time)
- **Live captions** for accessibility
- **Adjustable speech speed** to match user preferences
- **Offline text fallback** when voice isn't available

### 👤 Avatar Experience

- **3D Ready Player Me avatars** or **photoreal Tavus replicas**
- **Instantly switchable** avatar options
- **Expressive animations** that respond to conversation

### ♿ Accessibility Features

- **Large text and high contrast modes**
- **Full keyboard navigation**
- **Screen reader compatibility**
- **Adjustable interface elements**

### 🧠 Personal Memory

- **Remembers names, preferences, and recent topics**
- **Session summaries** for continuity
- **Personalized conversation flow**

### 🎯 Engagement & Wellness

- **Interactive trivia games**
- **Guided breathing exercises**
- **Music moments and photo slideshows**
- **Mood check-ins and medication reminders**
- **Chair stretches and wellness activities**

### 👥 Caregiver Dashboard

- **Mood trend analysis**
- **Usage statistics** (minutes spoken, engagement levels)
- **AI-generated highlights** of important conversations
- **Alert system** for concerning patterns

## Technical Architecture

### Frontend (Web)

- **Next.js** - Modern React framework with App Router
- **React Three Fiber** - 3D avatar rendering and animations
- **Tailwind CSS** - Utility-first styling with custom theming
- **Redux** - Predictable state management with React Redux
- **SWR** - Data fetching and caching
- **Progressive Web App (PWA)** - Offline capabilities and mobile optimization

### Backend (API)

- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - Database ORM with Alembic migrations
- **Pydantic** - Data validation and serialization
- **JWT Authentication** - Secure user authentication
- **WebSocket & gRPC** - Real-time communication protocols

### Voice Processing Pipeline

- **Deepgram SDK** - Speech-to-text conversion
- **OpenAI/Gemini** - Large language model for conversation
- **Cartesia** - Text-to-speech synthesis
- **Tavus API** - Photoreal avatar integration
- **Web Audio API** - Client-side audio processing

### Database & Storage

- **PostgreSQL** - Primary database with ACID compliance
- **pgvector** - Vector storage for semantic search and memory
- **Supabase** - Authentication and real-time subscriptions

## Project Structure

```
GRACE/
├── web/                    # Next.js frontend application
│   ├── src/app/           # App router pages and layouts
│   ├── src/components/    # Reusable UI components
│   └── src/lib/          # Utilities and API clients
└── api/                   # FastAPI backend application
    ├── routes/           # API endpoint definitions
    ├── services/         # Business logic layer
    ├── database/         # Models and database setup
    └── migrations/       # Database schema migrations
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Python 3.12+ and pip
- PostgreSQL 16+
- Git

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd GRACE
   ```

2. **Install dependencies**

   ```bash
   # Frontend
   cd web && npm install

   # Backend
   cd ../api && pip install -r requirements.txt
   ```

3. **Set up environment variables**

   - Copy `.env.example` files in both `web/` and `api/` directories
   - Configure database, API keys, and other required settings

4. **Run database migrations**

   ```bash
   cd api && python scripts/migrate.py
   ```

5. **Start development servers**

   ```bash
   # Terminal 1 - Backend
   cd api && python run.py

   # Terminal 2 - Frontend
   cd web && npm run dev
   ```

## Contributing

This project follows a milestone-based development approach with an 8-week roadmap covering prototyping, service development, voice integration, persistence, and production deployment.

## License

See [LICENSE](LICENSE) for details.

---

_Built with ❤️ to bring companionship and connection to those who need it most._
