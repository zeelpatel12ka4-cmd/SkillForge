# SkillForge AI (Web Application)

This directory contains the primary Next.js web application for **SkillForge AI**.

For the complete architectural documentation, system diagrams, API references, environment configuration, and security notes, please see the root repository documentation:

👉 **[Root Repository README.md](../README.md)**

---

## Quick Start (Application Directory)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env.local
```
Add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret
GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build and Run Production Bundle
```bash
npm run build
npm start
```

---

## Route Health & Automated Tests
- Run HTTP production route audit:
  ```bash
  node scripts/audit_routes.js
  ```
- Run end-to-end data integrity tests:
  ```bash
  node scripts/test_candidate_and_competitions.js
  ```
