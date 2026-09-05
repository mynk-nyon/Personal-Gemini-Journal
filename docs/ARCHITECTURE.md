# System Architecture

## Overview
The Personal Gemini Journal is built as a monolithic Next.js application that conceptually acts as a decoupled frontend and backend. It leverages Google Cloud Platform services (Cloud Run, Secret Manager, Firestore) and Firebase Authentication to provide a secure, isolated AI-journaling experience.

## Components

### 1. Frontend (Next.js Client)
- **Framework**: React / Next.js (App Router).
- **Role**: Provides the UI for user authentication, chatting with Gemini, and displaying past journal entries.
- **Authentication**: Uses Firebase Client SDK to authenticate users via Email/Password or Google Sign-in, obtaining an ID token (JWT).
- **Security**: Contains **no secrets**. Communicates exclusively with the backend API.

### 2. Backend (Next.js API Routes / Server Actions)
- **Role**: Acts as the secure middleware bridging the user, Gemini API, and Firestore.
- **Auth Middleware**: Verifies the Firebase ID token using the Firebase Admin SDK on every protected request.
- **AI Service**: Pre-processes user queries, constructs a secure prompt, and communicates with the Google AI Studio / Gemini API.
- **Journal Intelligence Engine**: A subsystem responsible for parsing Gemini's structured output to extract themes, moods, and action items.

### 3. Data Tier (Cloud Firestore)
- **Role**: NoSQL document database storing user profiles, journal entries, and generated insights.
- **Isolation**: Enforces multi-tenant isolation via Firestore Security Rules where `request.auth.uid == userId` for the path `users/{userId}/...`

### 4. Secret Management & Execution (Google Cloud)
- **Secret Manager**: Securely stores the `GEMINI_API_KEY` and Firebase Admin credentials.
- **Cloud Run**: Hosts the Next.js Docker container. Attached to a dedicated IAM Service Account with minimal privileges.

## Architecture Diagram

```text
                 ┌───────────────────────┐
                 │       Browser         │
                 │  Personal Journal UI  │
                 └───────────┬───────────┘
                             │
                             │ Firebase Auth Token (JWT)
                             ▼
                 ┌───────────────────────┐
                 │      Cloud Run        │
                 │                       │
                 │ Auth Middleware       │
                 │ Authorization         │
                 │ Input Validation      │
                 │ Gemini Service        │
                 └───────┬───────┬───────┘
                         │       │
              ┌──────────┘       └────────────┐
              ▼                               ▼
       ┌──────────────┐                ┌──────────────┐
       │  Firestore   │                │   Gemini API │
       │ User-scoped  │                │              │
       │ journal data │                │              │
       └──────────────┘                └──────────────┘
              ▲
              │
       ┌──────────────┐
       │ Secret       │
       │ Manager      │
       └──────────────┘
```

## Data Flow (Chat to Journal)
1. User sends a message via UI.
2. Frontend attaches Firebase ID Token and POSTs to `/api/chat`.
3. Backend verifies ID token -> extracts `uid`.
4. Backend retrieves conversation context from Firestore (ensuring owner matches `uid`).
5. Backend fetches `GEMINI_API_KEY` from environment (injected via Secret Manager in Cloud Run).
6. Backend securely calls Gemini API with user message.
7. Backend streams/returns Gemini response to Frontend.
8. Upon conversation completion, Backend calls a specialized Gemini prompt to generate a JSON summary.
9. Backend writes the structured summary to Firestore at `users/{uid}/journalEntries/{entryId}`.
