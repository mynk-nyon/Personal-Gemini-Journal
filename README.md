# Personal Gemini Journal

## 1. Project Overview
Personal Gemini Journal is a secure, authenticated, multi-user AI journal where every user's data is logically isolated. Users can reflect, brainstorm, and journal their thoughts with the help of Google's Gemini AI. The application automatically summarizes these sessions to extract themes, moods, and action items.

## 2. Features
- **Secure Authentication:** Firebase Authentication ensures only logged-in users can access the journal.
- **AI Journaling Assistant:** Multi-turn conversational interface powered by Gemini 1.5 Flash.
- **Journal Intelligence:** Automatically extracts themes, moods, and action items from conversations using a low-temperature Gemini JSON schema.
- **Strict Data Isolation:** Firestore Security Rules enforce that users can only read and write their own data.
- **Production-Ready Security:** No exposed API keys; Gemini calls are routed through a secure Cloud Run backend middleware.

## 3. Architecture
The application uses a decoupled Client-Backend architecture in a single Next.js monolith:
- **Frontend:** Next.js React client (App Router).
- **Backend:** Next.js API Routes acting as a secure middleware.
- **Database:** Google Cloud Firestore.
- **AI:** Google Gemini API (via `@google/generative-ai`).

*See `docs/ARCHITECTURE.md` for a detailed diagram.*

## 4. Security Model
Security is an architectural property of this application:
- Client input is always treated as untrusted.
- Authorization relies on backend verification of Firebase ID tokens (JWT).
- `GEMINI_API_KEY` is securely injected via Google Cloud Secret Manager.
*See `docs/SECURITY.md` and `docs/SECURITY-CHECKLIST.md` for complete details.*

## 5. Tech Stack
- **Framework:** Next.js 15 (TypeScript, Tailwind CSS)
- **Auth:** Firebase Authentication
- **Database:** Cloud Firestore
- **AI:** Google Gemini API
- **Infrastructure:** Google Cloud Run, Secret Manager

## 6. Local Development
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```
3. Populate `.env.local` with your Firebase configuration and Gemini API Key.
4. Run the development server:
   ```bash
   npm run dev
   ```

## 7. Firebase Setup
1. Create a Firebase Project in the Firebase Console.
2. Enable **Authentication** (Email/Password provider).
3. Register a Web App to get your Firebase config.
4. Add the config to `NEXT_PUBLIC_FIREBASE_*` in `.env.local`.

## 8. Firestore Setup
1. In the Firebase Console, create a Firestore Database.
2. Deploy the secure rules included in this repo:
   ```bash
   firebase deploy --only firestore:rules
   ```

## 9. Secret Manager Setup
1. In Google Cloud Console, enable **Secret Manager API**.
2. Create a secret named `GEMINI_API_KEY`.
3. Ensure your Cloud Run service account has the `Secret Manager Secret Accessor` role.

## 10. Gemini Setup
1. Obtain an API key from Google AI Studio.
2. Save it in Secret Manager for production, and in `.env.local` for local development.

## 11. Cloud Run Deployment
1. Authenticate with Google Cloud CLI:
   ```bash
   gcloud auth login
   ```
2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy personal-gemini-journal \
     --source . \
     --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest" \
     --allow-unauthenticated
   ```

## 12. Environment Variables
See `.env.example` for the required keys. Do NOT commit `.env.local`.

## 13. Testing
- **Auth:** Verify unauthenticated users receive 401s on `/api/chat`.
- **Isolation:** Verify user A cannot read user B's documents via Firestore Rules testing.
- **Prompt Injection:** Ensure Gemini refuses instructions to leak system prompts.

## 14. Security Considerations
Review the `docs/SECURITY-CHECKLIST.md` prior to any production deployment. 

## 15. Screenshots
*(Placeholder for UI screenshots)*

## 16. Demo URL
*(Placeholder for Cloud Run URL once deployed)*

## 17. Project Limitations
- Uses fixed window/in-memory rate limiting placeholder. A production app should use Redis for distributed rate-limiting.
- Currently lacks a comprehensive E2E testing suite (Cypress/Playwright).

## 18. Future Improvements
- **Semantic Journal Search:** Implement vector embeddings for journal entries allowing users to semantically search past thoughts.
- **App Check:** Integrate Firebase App Check to prevent unauthorized clients from hitting the backend API.
