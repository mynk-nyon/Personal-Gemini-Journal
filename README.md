<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/YOUR_USERNAME/YOUR_REPO_NAME">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Personal Gemini Journal</h3>

  <p align="center">
    A secure, authenticated multi-tenant AI journaling app built for the <strong>Accelerate AI with Cloud Run Ideathon</strong>.
    <br />
    <a href="https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/tree/main/docs"><strong>Explore the architecture docs »</strong></a>
    <br />
    <br />
    <a href="YOUR_CLOUD_RUN_URL_HERE">View Live Demo</a>
    ·
    <a href="YOUR_DEMO_VIDEO_LINK_HERE">Watch Walkthrough Video</a>
  </p>
</div>

<!-- TECH STACK BADGES -->
<h3 align="center">🛠️ Tech Stack & Technologies</h3>
<div align="center">
  <p>
    <img src="https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Google Cloud" />
    <img src="https://img.shields.io/badge/Firebase-%23039BE5.svg?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
    <img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini API" />
    <img src="https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  </p>
  <p>
    <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  </p>
</div>

<br />

<!-- TABLE OF CONTENTS -->
<details>
  <summary>📖 Table of Contents</summary>
  <ol>
    <li>
      <a href="#-about-the-project">About The Project</a>
      <ul>
        <li><a href="#-ideathon-architecture">Ideathon Architecture</a></li>
      </ul>
    </li>
    <li>
      <a href="#-getting-started">Getting Started</a>
      <ul>
        <li><a href="#-prerequisites">Prerequisites</a></li>
        <li><a href="#-installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#-cloud-run-deployment">Cloud Run Deployment</a></li>
    <li><a href="#-security-model">Security Model</a></li>
    <li><a href="#-license">License</a></li>
    <li><a href="#-contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## 🚀 About The Project

[![Product Name Screen Shot][product-screenshot]](YOUR_DEMO_VIDEO_LINK_HERE)
*(Add a screenshot of your chat UI here and link it to your video)*

**Personal Gemini Journal** is a production-ready web application where users can reflect, brainstorm, and journal their thoughts with the help of Google's Gemini AI. 

Unlike standard demo apps, this project was built with a **Security-First** mindset. It features strict data isolation, zero-trust backend interactions, and protected API boundaries to ensure user data remains entirely private.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### 🏗️ Ideathon Architecture

This project strictly follows the requirements for the **Accelerate AI with Cloud Run Ideathon**:

* 🔐 **Firebase Authentication:** Handles secure user sign-ins and identity verification.
* ☁️ **Cloud Run:** Hosts the Next.js application in a scalable, serverless container, acting as a secure middleware that prevents API key leakage.
* 🧠 **Gemini API (AI Studio):** Powers both a multi-turn conversational reflection assistant and a background *Journal Intelligence engine* that extracts themes, moods, and action items via structured JSON.
* 🗄️ **Cloud Firestore:** Persists the structured journal entries, utilizing strict `firestore.rules` to guarantee cryptographic data isolation between users.
* 🔑 **Secret Manager:** Ensures the `GEMINI_API_KEY` is never hardcoded or exposed to the frontend.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## 💻 Getting Started

To get a local copy up and running, follow these simple steps.

### 📋 Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```
* A Google Cloud Project with billing enabled
* A Firebase Project
* A Gemini API Key from Google AI Studio

### 🔧 Installation

1. Clone the repo
   ```sh
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Set up your environment variables
   ```sh
   cp .env.example .env.local
   ```
4. Enter your API keys in `.env.local`
   ```env
   GEMINI_API_KEY="ENTER YOUR API KEY"
   NEXT_PUBLIC_FIREBASE_API_KEY="ENTER YOUR FIREBASE API KEY"
   # ... (fill in the rest of your Firebase config)
   ```
5. Run the development server
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- DEPLOYMENT -->
## ☁️ Cloud Run Deployment

To deploy this securely to Google Cloud Run:

1. **Create your secret in Secret Manager:**
   ```sh
   echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create GEMINI_API_KEY --data-file=-
   ```
2. **Deploy via gcloud CLI:**
   ```sh
   gcloud run deploy personal-gemini-journal \
     --source . \
     --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest" \
     --set-env-vars="NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_KEY,NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT" \
     --allow-unauthenticated \
     --region=us-central1
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- SECURITY MODEL -->
## 🔒 Security Model

Security is an architectural property of this application:
* **Zero-Trust Client:** Client input is always treated as untrusted.
* **Backend Token Verification:** Authorization relies on backend verification of Firebase ID tokens (JWT) via the Firebase Admin SDK.
* **Data Isolation:** `firestore.rules` enforce that `request.auth.uid == userId` for the path `users/{userId}/journalEntries/...`.

Please see the [`docs/`](https://github.com/mynk-nyon/Personal-Gemini-Journal?tab=security-ov-file) directory for the complete Threat Model and Security Checklist.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## 📫 Contact

Your Name - [Mynk-Nyon](https://twitter.com/your_twitter) - programming.gadget@gmail.com

Project Link: [Personal Gemini Journal](https://github.com/mynk-nyon/Personal-Gemini-Journal)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[product-screenshot]: https://via.placeholder.com/800x400.png?text=Add+Screenshot+Here
