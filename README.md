# CampusID – Digital College ID Card Generator

> **"Your Identity. Your Campus. Your Future."**

CampusID is a modern, responsive, full-stack **MERN** web application that enables students and university administrators to enter student academic and personal profiles, upload photographs, and instantly generate, customize, preview in 3D, and export verified digital college identity cards.

---

## Key Features

1. **Instant ID Generation & Live 3D Synchronization**:
   - Zero-lag two-way synchronized form-to-card rendering.
   - Smooth 3D Flip animation with Front and Back sides.
   - Auto-save form progress to localStorage.
2. **5 Professional Collegiate Templates**:
   - **Classic Blue**: Royal navy with gold accents.
   - **Modern Purple**: High-tech violet & indigo polytechnic layout.
   - **Minimal White**: Architectural Scandinavian monochrome design.
   - **Premium Black**: Executive dark carbon with gold metallic foil.
   - **University Green**: Ivy League emerald green with traditional crest.
3. **Card Customization & Formats**:
   - Standard CR80 Portrait (Vertical, 85.6mm × 53.98mm) and Landscape Badge (Horizontal).
   - Dynamic typography (Modern Sans, Academic Serif, Tech Mono).
   - Custom college crest/logo upload or preset institutional seals.
4. **Export & Print**:
   - Download as high-resolution 300 DPI PNG (`html2canvas`).
   - Download as standardized CR80 credit-card sized PDF (`jsPDF`).
   - Direct Print styling with isolated ID card media query.
5. **Tamper-Evident QR Verification Authority**:
   - Unique cryptographic verification identifier generated per card (e.g. `CID-2026-8942A`).
   - Scanning or entering the code opens the verified credential portal, showing non-sensitive public student details and masking private personal info.
6. **Authentication & Student Vault**:
   - JWT session management with bcrypt-hashed passwords.
   - Multi-card management dashboard with live search, filters, preview modal, and instant export.
   - Quick one-click demo student login for technical evaluation.

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, HTML5 Canvas, Motion.
- **Backend**: Node.js, Express.js REST APIs, Multer file upload handler, JWT authentication, bcryptjs.
- **Database**: MongoDB & Mongoose schemas with persistent DocumentStore fallback ensuring zero downtime.
- **Export Engines**: `html2canvas`, `jspdf`, `qrcode`.

---

## Project Structure

```
campusid/
├── server.ts                    # Full-stack Express server + Vite dev middleware
├── package.json                 # Dependencies & scripts
├── data/
│   └── campusid_db.json         # Persistent JSON document database
├── uploads/                     # Multer static uploads folder
├── server/
│   ├── config/
│   │   ├── db.ts                # MongoDB & DocumentStore connection
│   │   └── seed.ts              # Demo student credentials & verified cards
│   ├── controllers/
│   │   ├── authController.ts    # Register, login, profile with JWT & bcrypt
│   │   ├── studentController.ts # Student record CRUD operations
│   │   └── idCardController.ts  # ID Card CRUD & QR verification lookup
│   ├── middleware/
│   │   └── auth.ts              # JWT token verification middleware
│   ├── models/
│   │   ├── User.ts              # User schema & model
│   │   ├── Student.ts           # Student schema & model
│   │   └── IDCard.ts            # ID Card schema & model
│   └── routes/
│       ├── authRoutes.ts
│       ├── studentRoutes.ts
│       ├── idCardRoutes.ts
│       └── uploadRoutes.ts
└── src/
    ├── types/                   # TypeScript interfaces
    ├── services/
    │   └── api.ts               # REST API client
    ├── context/
    │   └── AuthContext.tsx      # User authentication context
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx       # 3-Zone top navigation bar
    │   │   └── Footer.tsx       # Platform footer & standards
    │   ├── auth/
    │   │   └── AuthModal.tsx    # Sign In & Register modal with demo button
    │   ├── form/
    │   │   └── StudentForm.tsx  # Controlled 3-tab form with instant photo upload
    │   └── idcard/
    │       ├── IDCardPreview.tsx    # 3D Flip card container
    │       ├── IDCardFront.tsx      # Front side with 5 template themes
    │       ├── IDCardBack.tsx       # Back side with rules, emergency, signature
    │       ├── QRCodeCanvas.tsx     # Vector QR code renderer
    │       ├── TemplateSelector.tsx # Theme, layout, and logo customizer
    │       └── ExportActions.tsx    # PNG, PDF, and Print actions
    └── pages/
        ├── HomePage.tsx         # SaaS landing page with live sample
        ├── CreateCardPage.tsx   # Split-screen ID Studio & live preview
        ├── DashboardPage.tsx    # My ID Cards vault with search & actions
        ├── VerifyPage.tsx       # Official QR credential verification portal
        └── AboutPage.tsx        # Institutional standards & MERN specs
```

---

## Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run in development mode**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Production build**:
   ```bash
   npm run build
   npm run start
   ```

---

## Demo Credentials

For quick evaluation:
- **Email**: `student@campusid.edu`
- **Password**: `password123`
- Click **"Use Demo Student Login"** inside the Sign In modal to auto-populate.
