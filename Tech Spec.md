# Tech Spec

## Assumptions

1. **Database**: MongoDB is used as the primary database.

2. **Authentication**: Simple admin key-based authentication. No JWT tokens or session management - authentication is stateless per request.

3. **File Format**: Job data can be imported from Excel (.xlsx, .xls) or CSV files. The seed script handles both formats.

4. **URL Structure**: Company pages are accessed via slug-based routing: `/{company-slug}/careers`, `/{company-slug}/edit`, `/{company-slug}/preview`.

5. **Image Storage**: Logo, banner, and culture video URLs are stored as strings (base64 data URLs or external URLs). No file upload system - URLs must be provided.

6. **Color Format**: Brand colors are stored as hex strings (with or without `#` prefix, normalized on save/display).

7. **Next.js Version**: Using Next.js 16 with App Router. API route params are Promises and must be awaited.

8. **Environment**: Node.js environment with ES modules (`"type": "module"` in package.json).

9. **Styling**: Tailwind CSS for all styling. No CSS-in-JS or styled-components.

10. **SEO**: Server-side rendering with metadata generation and JSON-LD structured data for job postings.

## Architecture

### High-Level Overview

The application follows a **Next.js App Router** architecture with:
- **Server Components** for public-facing pages (careers page, preview)
- **Client Components** for interactive editor pages
- **API Routes** for data mutations and authentication
- **Mongoose ODM** for database operations
- **MongoDB** as the database

### Directory Structure

```
careers-page-builder-nextjs/
├── app/                          # Next.js App Router pages
│   ├── [company]/               # Dynamic route for company pages
│   │   ├── careers/            # Public careers page (Server Component)
│   │   ├── edit/               # Recruiter editor page (Client Component)
│   │   └── preview/            # Preview page (Server Component)
│   ├── api/                    # API routes
│   │   ├── auth/login/         # Authentication endpoint
│   │   └── companies/[slug]/   # Company data endpoints
│   ├── login/                  # Login page
│   └── page.tsx                # Homepage
├── components/                 # React components
│   ├── BrandForm.tsx          # Brand customization form
│   ├── JobFilters.tsx         # Job filtering UI (Client Component)
│   ├── JobsList.tsx           # Job listings display
│   └── SectionsEditor.tsx     # Content sections editor
├── lib/                        # Utility libraries
│   ├── db.ts                  # MongoDB connection utility
│   ├── db/                    # Database operation functions
│   │   ├── company.ts         # Company CRUD operations
│   │   └── jobs.ts           # Job query operations
│   └── models/                # Mongoose schemas
│       ├── Company.ts
│       ├── Job.ts
│       └── Section.ts
└── scripts/
    └── seed.ts                # Database seeding script
```

### Component Architecture

#### Server Components
- `app/[company]/careers/page.tsx`: Public careers page with SEO metadata
- `app/[company]/preview/page.tsx`: Preview page for recruiters
- `app/login/page.tsx`: Login page

#### Client Components
- `app/[company]/edit/EditorPage.tsx`: Main editor interface
- `components/BrandForm.tsx`: Brand customization form
- `components/SectionsEditor.tsx`: Content sections editor
- `components/JobFilters.tsx`: Job filtering form

#### API Routes
- `POST /api/auth/login`: Authenticate recruiter with slug and adminKey
- `GET /api/companies/[slug]/config`: Fetch company configuration
- `PUT /api/companies/[slug]/config`: Update company configuration
- `GET /api/companies/[slug]/jobs`: Fetch filtered job listings

### Data Flow

1. **Public Careers Page**:
   - Server Component fetches company config and jobs
   - Applies filters from URL search params
   - Renders SEO metadata and structured data
   - Client Component (`JobFilters`) handles form interactions

2. **Editor Page**:
   - Server Component loads initial config
   - Client Component manages state and handles saves
   - API calls update database via PUT endpoint

3. **Authentication Flow**:
   - Login page submits slug and adminKey
   - API validates against database
   - Redirects to editor page on success

### Database Connection

- **Connection Pattern**: Singleton pattern with global caching to prevent multiple connections in development
- **Connection String**: Stored in `DATABASE_URL` environment variable
- **Connection Utility**: `lib/db.ts` exports `connectDB()` function

## Schema

### Company Schema

```typescript
{
  _id: ObjectId (auto-generated)
  name: string (required)
  slug: string (required, unique)
  logoUrl: string (optional, default: "")
  bannerUrl: string (optional, default: "")
  brandColor: string (required, default: "#2563eb")
  cultureVideoUrl: string (optional, default: "")
  adminKey: string (required)
  sections: ObjectId[] (references to Section documents)
  jobs: ObjectId[] (references to Job documents)
}
```

### Section Schema

```typescript
{
  _id: ObjectId (auto-generated)
  companyId: ObjectId (required, references Company)
  type: string (required) // e.g., "About Us", "Life at Company"
  title: string (required)
  content: string (required)
  order: number (required) // For sorting sections
}
```

### Job Schema

```typescript
{
  _id: ObjectId (auto-generated)
  companyId: ObjectId (required, references Company)
  title: string (required)
  location: string (required)
  jobType: string (required) // e.g., "Full-time", "Part-time"
  description: string (optional)
}
```

### Relationships

- **Company → Sections**: One-to-many (Company.sections array contains Section ObjectIds)
- **Company → Jobs**: One-to-many (Company.jobs array contains Job ObjectIds)
- **Section → Company**: Many-to-one (Section.companyId references Company)
- **Job → Company**: Many-to-one (Job.companyId references Company)

### Indexes

- `Company.slug`: Unique index for fast lookups
- No explicit indexes defined (MongoDB creates default `_id` index)

## Test Plan

### Unit Tests (Recommended)

1. **Database Functions** (`lib/db/company.ts`, `lib/db/jobs.ts`)
   - Test `getCompanyConfig()` with valid/invalid slugs
   - Test `updateCompanyBrand()` with various inputs
   - Test `replaceCompanySections()` with empty and populated arrays
   - Test `getFilteredJobs()` with different filter combinations

2. **Models** (`lib/models/*.ts`)
   - Test schema validation (required fields, types)
   - Test default values

3. **API Routes** (`app/api/**/route.ts`)
   - Test authentication endpoint with valid/invalid credentials
   - Test GET endpoints return correct data
   - Test PUT endpoint updates correctly
   - Test error handling (404, 500, validation errors)

4. **Components** (`components/*.tsx`)
   - Test form state management
   - Test user interactions (add/remove sections, reorder)
   - Test brand color normalization

### Integration Tests (Recommended)

1. **Authentication Flow**
   - Login with correct credentials → redirect to editor
   - Login with incorrect credentials → error message
   - Access editor without authentication → redirect to login

2. **Editor Workflow**
   - Load company config
   - Update brand settings → save → verify changes
   - Add/edit/delete sections → save → verify changes
   - Reorder sections → save → verify order

3. **Public Careers Page**
   - Load careers page → verify company data displays
   - Apply job filters → verify filtered results
   - Test SEO metadata generation
   - Test structured data output

4. **Job Filtering**
   - Filter by location → verify results
   - Filter by job type → verify results
   - Search by title → verify results
   - Combine multiple filters → verify results

### End-to-End Tests (Recommended)

1. **Complete Recruiter Workflow**
   - Login → Edit brand → Add sections → Save → Preview → Verify changes

2. **Complete Candidate Workflow**
   - Visit careers page → Filter jobs → View job details

3. **Data Seeding**
   - Run seed script → Verify data in database
   - Test with Excel and CSV files

### Manual Testing Checklist

1. **Setup**
   - [ ] Environment variables configured
   - [ ] Database connection successful
   - [ ] Seed script runs without errors

2. **Authentication**
   - [ ] Login page loads
   - [ ] Valid credentials redirect to editor
   - [ ] Invalid credentials show error
   - [ ] Editor page requires authentication

3. **Editor Functionality**
   - [ ] Brand form updates state correctly
   - [ ] Sections can be added/removed/reordered
   - [ ] Save button persists changes
   - [ ] Preview link shows updated content
   - [ ] Public careers page link works

4. **Public Careers Page**
   - [ ] Company information displays correctly
   - [ ] Logo and banner images load
   - [ ] Brand color applies to header
   - [ ] Sections display in correct order
   - [ ] Job listings display correctly
   - [ ] Job filters work (search, location, type)
   - [ ] Culture video link works

5. **Responsive Design**
   - [ ] Mobile view renders correctly
   - [ ] Tablet view renders correctly
   - [ ] Desktop view renders correctly

6. **SEO**
   - [ ] Page title includes company name
   - [ ] Meta description present
   - [ ] OpenGraph tags present
   - [ ] Twitter card tags present
   - [ ] JSON-LD structured data present

7. **Accessibility**
   - [ ] Semantic HTML used
   - [ ] ARIA labels present
   - [ ] Keyboard navigation works
   - [ ] Screen reader compatible

### Performance Tests (Recommended)

1. **Database Queries**
   - Test query performance with large datasets
   - Verify connection pooling works correctly
   - Test concurrent requests

2. **Page Load Times**
   - Test careers page load time
   - Test editor page load time
   - Test API response times

3. **Image Loading**
   - Test with large base64 images
   - Test with external image URLs
   - Verify lazy loading if implemented

### Security Tests (Recommended)

1. **Authentication**
   - Test SQL injection (N/A - using MongoDB)
   - Test NoSQL injection in adminKey field
   - Test unauthorized access to editor

2. **Input Validation**
   - Test XSS in section content
   - Test invalid brand color formats
   - Test very long input strings

3. **API Security**
   - Test rate limiting (if implemented)
   - Test CORS headers
   - Test input sanitization

### Test Data

- **Sample Company**: "Acme Corp" with slug "acme" and adminKey "acme123@"
- **Sample Jobs**: Imported from `data/JobData.xlsx`
- **Sample Sections**: Created via editor interface

