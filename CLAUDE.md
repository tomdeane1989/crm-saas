# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev        # Development server with watch mode
npm run start:debug      # Debug mode with watch
npm run build           # Build for production
npm run start:prod      # Run production build
npm run lint            # ESLint with auto-fix
npm run format          # Prettier formatting
npm run test            # Unit tests
npm run test:watch      # Unit tests in watch mode
npm run test:cov        # Test coverage
npm run test:e2e        # End-to-end tests
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev             # Development server
npm run build           # Build for production
npm run lint            # ESLint
npm run preview         # Preview production build
```

### Database (Prisma)
```bash
cd backend
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema to database
npx prisma migrate dev  # Create and apply migration
npx prisma studio       # Open Prisma Studio
```

### Testing & Utilities
```bash
# Test authentication flow
./test-auth-flow.sh

# Seed sample data
cd backend && npx ts-node src/seed-data.ts
```

## Architecture Overview

### Monorepo Structure
- `backend/` - NestJS API server with Prisma ORM
- `frontend/` - React SPA with Vite, TailwindCSS, and React Query
- `prisma/` - Shared Prisma schema (symlinked in backend)

### Backend Architecture
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI/ML**: Pinecone vector database integration
- **Queue**: BullMQ with Redis for background jobs
- **Modules**: Companies, Contacts, Opportunities, Activities, Auth, AI, Jobs

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM
- **Components**: Functional components with hooks

### Database Schema
Core entities with relationships:
- **Company** → has many Contacts, Opportunities, Activities
- **Contact** → belongs to Company, has many Activities and Opportunities
- **Opportunity** → belongs to Company, optionally to Contact, has many Activities
- **Activity** → belongs to Company, optionally to Contact and Opportunity
- **Embedding** → stores vector embeddings for AI features
- **PromptLog** → tracks AI model usage and responses

All entities support:
- `customFields` (JSON) for user-defined data
- `externalId` for third-party integrations
- Standard timestamps (`createdAt`, `updatedAt`)

### AI/ML Integration
- **Vector Search**: Pinecone for semantic search capabilities
- **Background Processing**: BullMQ for embedding generation
- **Logging**: All AI interactions logged to `PromptLog` table
- **Components**: `AskDashboard` for natural language queries

## Key Implementation Patterns

### Backend Patterns
- **Complete CRUD APIs**: Full REST APIs with pagination, filtering, sorting, and bulk operations
- **Advanced Filtering**: Search by text, filter by categories, sort by any field
- **Bulk Operations**: Multi-select delete and update operations
- **Data Validation**: Class-validator with comprehensive DTO validation
- **Error Handling**: Proper HTTP status codes and error messages
- **Relationship Loading**: Optimized queries with counts and related data

### Frontend Patterns
- **Professional Data Tables**: Advanced DataTable component with sorting, pagination, selection
- **Modal Forms**: Reusable modal components for create/edit operations
- **Real-time Filtering**: Instant search and filter updates
- **Bulk Actions**: Select multiple items for batch operations
- **Optimistic Updates**: React Query for caching and optimistic UI updates
- **Responsive Design**: Mobile-first approach with TailwindCSS

### CRUD Implementation Features
- **Companies Module**: Complete CRUD with industry filtering, website validation
- **Advanced Search**: Full-text search across multiple fields
- **Pagination**: Server-side pagination with configurable page sizes
- **Sorting**: Client-controlled sorting on any column
- **Bulk Operations**: Select all, bulk delete, bulk update capabilities
- **Form Validation**: Real-time validation with user-friendly error messages

## Environment Setup

### Required Environment Variables
Backend requires:
- `DATABASE_URL` - PostgreSQL connection string
- `PINECONE_API_KEY` - Pinecone API key
- `PINECONE_INDEX` - Pinecone index name
- Redis connection (localhost:6379 by default)

### Development Dependencies
- Node.js and npm
- PostgreSQL database
- Redis server (for BullMQ)
- Pinecone account and index

## Testing Strategy

### Backend Testing
- Unit tests with Jest for services and controllers
- E2E tests for API endpoints
- Test coverage reporting available
- Supertest for HTTP testing

### Frontend Testing
- ESLint for code quality
- TypeScript for type safety
- No test framework currently configured

## Code Quality Tools

### Backend
- ESLint with TypeScript rules
- Prettier for formatting
- TypeScript strict mode
- NestJS CLI for code generation

### Frontend
- ESLint with React and TypeScript rules
- TypeScript strict mode
- Vite for fast development and building
- TailwindCSS for consistent styling

## Development Workflow

1. **Backend Development**: Use `npm run start:dev` for hot reloading
2. **Frontend Development**: Use `npm run dev` for Vite dev server
3. **Database Changes**: Create migrations with `npx prisma migrate dev`
4. **Code Quality**: Run linting before commits
5. **Testing**: Run tests before deploying changes

## AI Features

The application includes AI-powered features:
- **Semantic Search**: Query CRM data using natural language
- **Email Composition**: AI-assisted email writing
- **Dashboard Queries**: Ask questions about your data
- **Background Processing**: Automatic embedding generation for search

Vector embeddings are stored both in Pinecone (for fast similarity search) and PostgreSQL (for backup and metadata).