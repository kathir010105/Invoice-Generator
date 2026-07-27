# React Invoice Generator

A modern, browser-based invoice generator built with React and TypeScript. Create, manage, and export professional invoices as PDFs — all from your browser with no server required.

> Forked from [tuanpham-dev/react-invoice-generator](https://github.com/tuanpham-dev/react-invoice-generator) and enhanced with additional features.

![react-invoice-generator](https://raw.githubusercontent.com/tuanpham-dev/react-invoice-generator/master/screenshot.png)

## ✨ Features

- **PDF Export** — Generate and download invoices as PDF files
- **Live Preview** — See changes reflected instantly as you type
- **Invoice History** — All invoices are saved to browser local storage with a slide-out history panel to browse, load, duplicate, or delete past invoices
- **Auto-incrementing Invoice Numbers** — Each new invoice automatically gets the next number (e.g. `INV-1`, `INV-2`, `INV-3`…)
- **GSTIN Field** — Dedicated field for GST Identification Number (Indian tax ID)
- **Save as Default Template** — Save your current invoice layout as the default for all new invoices
- **Upload / Save Templates** — Export your invoice as a JSON template or import one
- **Editable Labels** — All field labels (Invoice#, Bill To, Notes, Terms, etc.) are fully editable
- **Logo Upload** — Add your company logo with adjustable width
- **Line Items** — Add, remove, and edit product/service line items with quantity, rate, and auto-calculated amounts
- **Tax Calculation** — Configurable tax rate with automatic calculation
- **Currency Support** — Defaults to ₹ (INR) but can be changed to any currency symbol
- **Indian Locale Defaults** — Country defaults to India

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/kathir010105/Invoice-Generator.git
cd Invoice-Generator
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.
The page will reload if you make edits.

### Build for Production

```bash
npm run build
```

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### Lint

```bash
npm run lint
```

Runs [Prettier](https://prettier.io/) to check code formatting.

## 🏗️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and builds
- **@react-pdf/renderer** for PDF generation
- **date-fns** for date formatting
- **Zod** for runtime type validation
- **SCSS** for styling
- **Local Storage** for persistence (no backend needed)

## 📁 Project Structure

```
src/
├── components/        # React components
│   ├── InvoicePage.tsx       # Main invoice form and PDF layout
│   ├── DownloadPDF.tsx       # Sidebar with save/export controls
│   ├── InvoiceHistory.tsx    # Slide-out history panel
│   ├── EditableInput.tsx     # Inline editable text input
│   ├── EditableTextarea.tsx  # Inline editable textarea
│   ├── EditableSelect.tsx    # Inline editable dropdown
│   ├── EditableCalendarInput.tsx  # Date picker input
│   ├── EditableFileImage.tsx # Logo upload with resize slider
│   ├── Document.tsx          # PDF document wrapper
│   ├── Page.tsx              # PDF page wrapper
│   ├── View.tsx              # PDF view wrapper
│   └── Text.tsx              # PDF text wrapper
├── data/
│   ├── types.ts              # TypeScript types and Zod schemas
│   ├── initialData.ts        # Default invoice values
│   ├── historyTypes.ts       # Invoice history record types
│   └── countryList.ts        # Country dropdown options
├── hooks/
│   └── useInvoiceHistory.ts  # History management hook (CRUD + localStorage)
├── scss/                     # SCSS stylesheets
└── App.tsx                   # Root component with state management
```

## 📝 Changes from Original

This fork includes the following enhancements over the [original project](https://github.com/tuanpham-dev/react-invoice-generator):

| Change | Description |
|--------|-------------|
| **GSTIN Field** | Added a dedicated GSTIN (GST Identification Number) field below the company name |
| **Invoice History** | Full invoice history system with local storage persistence, slide-out panel, load/delete/duplicate actions |
| **Auto-increment Invoice #** | New invoices automatically get the next sequential number based on history |
| **Default Template** | "Save as Default" button to persist your preferred invoice layout |
| **Removed Due Date** | Simplified the date section to only show Invoice Date |
| **Indian Defaults** | Currency set to ₹ (INR), country defaults to India |
| **Fixed Render Loop** | Resolved an infinite re-render loop between InvoicePage and App that caused input focus loss |
| **Fixed History Layout** | History panel is now a fixed overlay instead of being squished inside the narrow sidebar |
| **Migrated to Vite** | Uses Vite instead of Create React App for faster development |

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
