# Vignan ID Card Generator (Pixel-Exact Reference Match)

Transform the application into the official **Vignan ID Card Generator**, matching the user-uploaded reference physical ID card photos with pixel precision. The interface will feature the authentic Vignan university logo, default official institution details, student-fillable fields (starting blank), Day Scholar (horizontal) vs Hosteler (vertical front, horizontal back) layouts, and an exact linear Code-128 barcode on the reverse side.

## User Review & Critical Decisions

> [!IMPORTANT]
> - **Visual Reference Match**: The card styling directly reproduces the user's uploaded reference card:
>   - **Front**: Official Vignan logo banner (`/public/assets/aistudio/LOGO_d66eb575.jpg`), blue divider line, student photo, vertical "STUDENT" typography along the photo edge, Student Name in bold uppercase, Registration Number in large font, Course & Section (`B.TECH CSE Sec - 15`), Batch Years (`2024 - 2028`), cursive "Registrar" signature, and the watermark wheel seal in the lower-right corner.
>   - **Back**: Father's Name, Student Address, Phone Number, solid black stripe with centered white `www.vignan.ac.in`, institution return address in Vadlamudi, Guntur, and high-contrast linear Code-128 barcode with student registration number.
> - **Default vs. Student-Filled Fields**:
>   - *Pre-filled Defaults*: College Name (`Vignan's Foundation for Science, Technology & Research`) and Institution Address (`Vadlamudi(Post), Chebrolu(MD), Guntur(Dist) - 522213, Tel: 0863-2344700`).
>   - *Student Inputs (Blank by default)*: Full Name, Registration Number, Branch/Course & Section, Batch / Academic Years, Father's Name, Student Permanent Address, Phone Number, and Student Photograph. A "Sample Student" button remains available for 1-click preview.
> - **Orientation & Layout Rules**:
>   - **Day Scholar**: Horizontal front (CR80 landscape) + Horizontal back.
>   - **Hosteler**: Vertical front (CR80 portrait) + Horizontal back.
> - **Navbar Clean-Up**: Removed the top-right "Print Card" button from the header navbar as requested, leaving the print and high-res PNG/PDF downloads on the export panel beside the preview card.

---

## 1. Overview & Core Concept

### What It Does
Generates authentic physical-grade digital ID cards for **Vignan's Foundation for Science, Technology & Research (Deemed to be University)**. Students upload their passport photo, enter their details (Name, Reg No, Branch & Section, Batch, Father's Name, Address, Contact No), toggle between Day Scholar and Hosteler, and instantly download or print their front and back ID cards directly in the website.

### Key Details Captured from Reference:
1. **Header**: High-resolution Vignan crest logo (`LOGO_d66eb575.jpg`).
2. **Student Section**:
   - Photo in rectangular portrait frame.
   - Text "STUDENT" printed vertically along the right border of the photo frame.
   - Student Name, Reg No (e.g. `241FA04350`), Course & Section (e.g. `B.TECH CSE Sec - 15`), Batch (e.g. `2024 - 2028`).
   - Cursive Registrar signature with title label.
   - Subtle semi-transparent watermark emblem in bottom-right corner.
3. **Back Side**:
   - `Father Name`: [Student input]
   - `Address`: [Student permanent address]
   - `Phone No`: [Student phone number]
   - Solid black ribbon: `www.vignan.ac.in`
   - Return address: `If Found Please return to Vignan's Foundation For Science, Technology & Research, Vadlamudi(Post), Chebrolu(MD), Guntur(Dist) - 522213, Tel: 0863-2344700`
   - Exact linear barcode encoding the student's registration number.

---

## 2. Technical Architecture & Component Mapping

```
┌────────────────────────────────────────────────────────┐
│             Navbar: "Vignan ID Card Generator"        │
│          (Top-right print button removed)              │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
 ┌──────────────────────┐       ┌──────────────────────┐
 │  src/components/     │       │  src/components/     │
 │  form/StudentForm    │       │  idcard/             │
 │  - Photo upload      │       │  - IDCardPreview     │
 │  - Day Scholar /     │       │    (Flip 3D Stage)   │
 │    Hosteler switch   │       │  - IDCardFront       │
 │  - Student inputs    │       │    (Exact Vignan)    │
 │    (Blank defaults)  │       │  - IDCardBack        │
 │  - Pre-filled Vignan │       │    (Black stripe,    │
 │    college address   │       │     linear barcode)  │
 └──────────────────────┘       │  - ExportActions     │
                                │    (PNG, PDF, Print) │
                                └──────────────────────┘
```

### Planned Source Code Modifications:
1. **`src/types/index.ts`**:
   - Add `fatherName?: string` and `section?: string` to `StudentData`.
2. **`src/components/form/StudentForm.tsx`**:
   - Update fields to match the reference card:
     - Student Name, Registration Number, Course & Section, Academic Batch.
     - Father's Name, Permanent Address, Phone Number.
     - Default college name and address locked to Vignan University.
     - Student fields start blank by default.
3. **`src/components/idcard/IDCardFront.tsx`**:
   - Render the exact Vignan layout from the user's reference image:
     - Header using `/public/assets/aistudio/LOGO_d66eb575.jpg`.
     - Blue accent divider rule.
     - Photo box with rotated vertical "S T U D E N T" label.
     - Clean typography matching the reference card.
     - Registrar signature and bottom-right watermark wheel seal.
     - Hosteler mode formats the front in vertical layout while retaining the authentic Vignan branding.
4. **`src/components/idcard/IDCardBack.tsx`**:
   - Exact layout from reference photo: Father Name, Address, Phone No, black `www.vignan.ac.in` bar, Vadlamudi institution return info, and high-resolution linear Code-128 barcode with student registration number.
   - Always formatted horizontally for both Day Scholar and Hosteler.
5. **`src/components/layout/Navbar.tsx`**:
   - Change brand title to **Vignan ID Card Generator**.
   - Remove the top-right "Print Card" button as requested.
6. **`index.html` & `metadata.json`**:
   - Synchronize document title to **Vignan ID Card Generator**.
7. **Verification**:
   - Co-run `compile_applet` and `lint_applet` to ensure 0 build errors.

---

## 3. Photo Cropper & Export Simplification (Completed)

- [x] **Photo Cropping Tool (`src/components/form/ImageCropModal.tsx`)**:
  - Modal with 4:5 aspect ratio crop boundary matching standard physical passport photo frames.
  - Interactive mouse/touch dragging, pan, and zoom slider controls.
  - Alignment grid (rule-of-thirds) and portrait face guide.
  - High-resolution canvas rendering producing sharp 480x600 data URLs.
  - Seamlessly wired into `StudentForm.tsx` on image upload and with an "Adjust / Crop" button.
- [x] **Print Option Removal**:
  - Removed "Print Card" buttons from `ExportActions.tsx`, `HomePage.tsx`, and `App.tsx`.
  - Streamlined download actions strictly to:
    1. **Complete PDF (2 Pages)**: Front and Back sides combined.
    2. **Both Sides (PNGs)**: High-resolution PNGs of both front and back.

