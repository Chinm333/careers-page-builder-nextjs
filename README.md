# Careers Page Builder

A Next.js application that allows recruiters to build branded careers pages and enables candidates to explore open job roles with filtering capabilities.

## What You Built

This application provides:

1. **Recruiter Features**:
   - Login system with company slug and admin key
   - Brand customization (company name, logo, banner, brand color, culture video)
   - Content sections editor (add, edit, delete, reorder sections)
   - Preview functionality to see changes before publishing
   - Direct link to public careers page

2. **Candidate Features**:
   - Public careers page with company branding
   - Job listings with filtering (search by title, filter by location and job type)
   - Company information sections
   - Culture video link
   - SEO-optimized pages with structured data

3. **Technical Features**:
   - Server-side rendering for SEO
   - Responsive design (mobile, tablet, desktop)
   - Accessibility features (ARIA labels, semantic HTML)
   - MongoDB database with Mongoose ODM
   - Job data import from Excel/CSV files

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud like MongoDB Atlas)
- npm or yarn package manager

## Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database-name
   ```
   Or for local MongoDB:
   ```env
   DATABASE_URL=mongodb://localhost:27017/careers-page-builder
   DEFAULT_COMPANY_ADMIN_KEY=adminKey
   NODE_ENV=development
   ```

4. **Seed the database** (optional):
   ```bash
   npm run seed data/JobData.xlsx
   ```
   This will create a sample company "Acme Corp" with slug "acme" and admin key "acme123@"

## How to Run

### Development Mode

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed <file>` - Seed database with job data from Excel/CSV file

## Step-by-Step User Guide

### For Recruiters

#### 1. Access the Login Page

Navigate to [http://localhost:3000/login](http://localhost:3000/login)

#### 2. Login

Enter your company slug and admin key:
- **Company Slug**: The URL-friendly identifier for your company (e.g., "acme")
- **Admin Key**: Your company's admin password (e.g., "acme123@")

Click "Login" to access the editor.

#### 3. Edit Brand Theme

In the left column "Brand Theme" section:

- **Company Name**: Update your company's display name
- **Logo URL**: Enter a URL or base64 data URL for your company logo
- **Banner URL**: Enter a URL or base64 data URL for a banner image
- **Brand Color (hex)**: Enter a hex color code (with or without `#`) for your brand color
  - Example: `#26CCC2` or `26CCC2`
- **Culture Video URL**: Enter a URL to a culture video (e.g., YouTube link)

Changes are saved to state immediately but not persisted until you click "Save Changes".

#### 4. Edit Content Sections

In the right column "Content Sections" section:

- **Add Section**: Click the "Add Section" button to create a new content section
- **Section Type**: Select from dropdown (e.g., "About Us", "Life at Company")
- **Title**: Enter a section title
- **Content**: Enter the section content (supports multi-line text)
- **Reorder**: Use the up (↑) and down (↓) arrows to change section order
- **Delete**: Click the red "Delete" button to remove a section

#### 5. Preview Changes

Click the "Preview" button in the top right to see how your careers page will look to candidates. This opens in a new tab.

#### 6. Save Changes

Click the "Save Changes" button at the bottom left to persist all your edits to the database. You'll see a loading indicator while saving.

#### 7. View Public Page

Click the "Public Careers Page" button in the top right to view the live careers page that candidates will see.

### For Candidates

#### 1. Access Careers Page

Navigate to `http://localhost:3000/{company-slug}/careers`

For example: [http://localhost:3000/acme/careers](http://localhost:3000/acme/careers)

#### 2. Browse Company Information

- View the company logo and name
- Read content sections (About Us, Life at Company, etc.)
- Click "Watch culture video" if available

#### 3. Filter Jobs

Use the filter form to find relevant positions:

- **Search by job title**: Type keywords to search job titles
- **Filter by location**: Select a location from the dropdown
- **Filter by job type**: Select a job type (Full-time, Part-time, etc.)

Filters can be combined. The page automatically updates when you change filters.

#### 4. View Job Listings

Job listings show:
- Job title
- Location
- Job type

Click on a job listing to view more details (if implemented).

## Project Structure

```
careers-page-builder-nextjs/
├── app/                    # Next.js pages and API routes
│   ├── [company]/         # Dynamic company routes
│   ├── api/               # API endpoints
│   └── login/             # Login page
├── components/            # React components
├── lib/                   # Utilities and database code
│   ├── db.ts             # MongoDB connection
│   ├── db/               # Database operations
│   └── models/           # Mongoose schemas
├── scripts/              # Utility scripts
│   └── seed.ts          # Database seeding
└── data/                # Sample data files
```

## Key Features Explained

### Brand Customization

The brand color is automatically normalized to include a `#` prefix if missing. You can enter colors like `26CCC2` or `#26CCC2` - both will work.

### Content Sections

Sections are ordered by the `order` field. When you reorder sections using the arrows, the order is updated and saved.

### Job Filtering

Job filters use URL search parameters, so you can bookmark filtered views. The filters work on the server side for better performance.

### SEO Optimization

The careers page includes:
- Dynamic page titles and descriptions
- OpenGraph tags for social sharing
- Twitter card metadata
- JSON-LD structured data for job postings

## Database Seeding

To import job data from an Excel or CSV file:

```bash
npm run seed data/JobData.xlsx
```

The seed script will:
1. Connect to MongoDB
2. Create or update the company (Acme Corp by default)
3. Import jobs from the file
4. Link jobs to the company

**Excel/CSV Format**:
- Columns: `Title`, `Location`, `Job Type`, `Description` (optional)
- First row should be headers
- Each subsequent row is a job

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is set correctly in `.env`
- Check MongoDB connection string format
- Ensure MongoDB is running (if local)
- Check network/firewall settings (if cloud)

### Brand Color Not Showing

- Ensure color includes `#` prefix or is a valid hex code
- Check browser console for CSS errors
- Verify brand color was saved correctly

### Sections Not Saving

- Check browser console for errors
- Verify you clicked "Save Changes" button
- Check database connection

### Jobs Not Appearing

- Verify jobs were imported via seed script
- Check that jobs are linked to the correct company
- Verify company slug matches in URL

## Improvement Plan

### Short-term Improvements

1. **File Upload System**
   - Replace URL inputs with file upload for logos/banners
   - Store files in cloud storage (S3, Cloudinary)
   - Generate optimized image versions

2. **Enhanced Job Details**
   - Add job description pages
   - Add "Apply Now" functionality
   - Add job application form

3. **Better Error Handling**
   - User-friendly error messages
   - Loading states for all async operations
   - Retry mechanisms for failed requests

4. **Input Validation**
   - Client-side validation for forms
   - Server-side validation for API routes
   - Better error messages for invalid inputs

### Medium-term Improvements

1. **Authentication Enhancement**
   - JWT token-based authentication
   - Session management
   - Password reset functionality
   - Multi-user support per company

2. **Admin Dashboard**
   - Analytics (page views, job clicks)
   - User management
   - Bulk job import/export
   - Company settings management

3. **Rich Text Editor**
   - WYSIWYG editor for section content
   - Image embedding in sections
   - Formatting options (bold, italic, lists)

4. **Job Management**
   - Add/edit/delete jobs from editor
   - Job status (open, closed, draft)
   - Job expiration dates
   - Job categories/tags

### Long-term Improvements

1. **Multi-tenant Architecture**
   - Support for multiple companies
   - Company registration flow
   - Subscription/pricing tiers

2. **Advanced Features**
   - Email notifications for new applications
   - Integration with ATS (Applicant Tracking Systems)
   - Candidate application tracking
   - Interview scheduling

3. **Performance Optimization**
   - Image CDN integration
   - Caching strategy (Redis)
   - Database query optimization
   - API rate limiting

4. **Testing & Quality**
   - Unit tests for all functions
   - Integration tests for workflows
   - E2E tests with Playwright/Cypress
   - CI/CD pipeline

5. **Accessibility & Internationalization**
   - Full WCAG 2.1 AA compliance
   - Multi-language support
   - RTL language support
   - Screen reader optimization

6. **Security Enhancements**
   - Rate limiting on API routes
   - CSRF protection
   - Input sanitization
   - Security headers
   - Regular dependency updates

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Styling**: Tailwind CSS
- **File Parsing**: XLSX, PapaParse
- **Runtime**: Node.js (ES Modules)

## License

This project is private and proprietary.
