# Security Checklist

Before deploying to production on Cloud Run, ensure the following criteria are met:

### Secrets
- [ ] No secrets (API keys, service account JSONs) are committed to Git.
- [ ] No privileged Gemini API key is exposed in the frontend client code.
- [ ] Google Cloud Secret Manager is configured to hold `GEMINI_API_KEY` and any backend Firebase credentials.
- [ ] Cloud Run is configured to inject secrets at runtime as environment variables.
- [ ] The runtime service account uses Least Privilege IAM (`roles/secretmanager.secretAccessor`).

### Authentication
- [ ] Firebase Authentication is properly configured (Email/Password, optionally Google).
- [ ] Backend strictly verifies the Firebase ID token (JWT) using the Firebase Admin SDK on all protected routes.
- [ ] Unauthenticated API requests are immediately rejected with `401 Unauthorized`.

### Authorization
- [ ] The `uid` used in all backend operations is derived EXCLUSIVELY from the verified backend token, never from a client-provided parameter.
- [ ] Firestore Security Rules are deployed and enforce ownership (`request.auth.uid == userId`).
- [ ] Ownership fields on Firestore documents are immutable (cannot be updated via patch requests).
- [ ] IDOR (Insecure Direct Object Reference) tests pass: User A cannot read, modify, or delete User B's journal entries.

### AI & Prompt Security
- [ ] User input is treated strictly as untrusted data.
- [ ] Prompts are centralized in a `src/prompts` directory.
- [ ] The system instruction clearly tells Gemini to reject attempts to reveal its instructions or hallucinate other users' data (Prompt Injection mitigation).
- [ ] No secrets, PII, or internal credentials are sent to Gemini in the system prompt.
- [ ] Output from Gemini (especially structured summarization) is validated against a strict schema (e.g., Zod) before database insertion.
- [ ] Token usage and output generation are bounded to prevent Denial-of-Wallet abuse.

### Application Security
- [ ] Input validation is applied to all incoming requests (e.g., maximum message length, valid UUID format).
- [ ] The frontend utilizes React's built-in XSS protections. If `dangerouslySetInnerHTML` is used, it is accompanied by a robust HTML sanitizer (e.g., DOMPurify).
- [ ] HTTP Security headers (CSP, HSTS, X-Content-Type-Options) are configured via Next.js `headers()` configuration.
- [ ] Error handling is safe: stack traces and internal errors are suppressed in the API response, returning generic error messages instead.
- [ ] CORS is restricted to the application's intended domain(s) for the backend API.

### Cloud & Deployment
- [ ] Cloud Run deployment succeeds and the container runs as a non-root user (where possible).
- [ ] Dedicated service account `personal-gemini-journal-runtime` is attached to the Cloud Run service.
- [ ] Cloud Logging is configured but DOES NOT log sensitive user journal content, Firebase tokens, or Gemini API keys.
- [ ] `.dockerignore` prevents `.env` files from being copied into the container image.
