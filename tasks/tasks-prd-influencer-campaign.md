# Task List: Influencer Campaign Marketplace MVP

**Based on:** `prd-influencer-campaign.md`

## Relevant Files

### Database & Schema
- `prisma/schema.prisma` - Main database schema file; add Campaign, CampaignInfluencer, and Notification models
- `prisma/migrations/` - Auto-generated migration files after running `npx prisma migrate dev`

### Validation Schemas
- `lib/validations/campaign.ts` - ✓ Created - Zod validation schemas for campaign creation, update, publish, and application requests

### API Routes (Brand)
- `app/api/campaigns/route.ts` - ✓ Created - POST (create draft campaign), GET (list brand's campaigns with filters)
- `app/api/campaigns/[id]/route.ts` - ✓ Created - GET (campaign details), PATCH (update draft campaign)
- `app/api/campaigns/[id]/publish/route.ts` - ✓ Created - POST (publish campaign with validation)
- `app/api/campaigns/[id]/applicants/route.ts` - ✓ Created - GET (list applicants with influencer details and social stats)
- `app/api/campaigns/[id]/applicants/[influencerId]/select/route.ts` - ✓ Created - POST (select influencer, update status, create notification)

### API Routes (Influencer)
- `app/api/campaigns/available/route.ts` - ✓ Created - GET (list published campaigns excluding already applied)
- `app/api/campaigns/[id]/apply/route.ts` - ✓ Created - POST (apply to campaign with validation for approved influencer status and duplicate check)
- `app/api/campaigns/my-applications/route.ts` - ✓ Created - GET (list influencer's applications with campaign details)

### API Routes (Notifications)
- `app/api/notifications/route.ts` - ✓ Created - GET (list user notifications with limit and filters), POST (mark all as read)
- `app/api/notifications/[id]/read/route.ts` - ✓ Created - PATCH (mark single notification as read with authorization)

### Server Actions
- `actions/campaign.ts` - Server actions for campaign CRUD operations
- `actions/notification.ts` - Server actions for notification operations (OPTIONAL - using API routes instead)

### UI Components (Brand)
- `app/(dashboard)/campaign/new/page.tsx` - ✓ Updated - Campaign creation form with title, description, budget, currency, duration, location, platforms, and targets
- `app/(dashboard)/campaign/page.tsx` - ✓ Created - Campaign list dashboard with stats, filters, campaign cards, View Applicants button, and applicant count badges
- `app/(dashboard)/campaign/[id]/applicants/page.tsx` - ✓ Created - Applicant list view with influencer details, social stats, Select button, confirmation dialog, and optimistic updates

### UI Components (Influencer)
- `app/influencer/campaigns/page.tsx` - Server component wrapper (existing, no changes)
- `app/influencer/campaigns/campaign.tsx` - ✓ Updated - Campaign discovery and application interface with real data fetching, tab filtering, apply functionality, optimistic UI updates
- `components/ui/notification-bell.tsx` - ✓ Created - Notification bell with dropdown, unread count badge, mark as read, real-time polling
- `components/ui/influencersidebar.tsx` - ✓ Updated - Integrated notification bell in header

### UI Components (Store)
- `app/(store)/[storeId]/campaign/page.tsx` - ✓ Updated - Store campaigns page; fixed "Create Campaign" button to route to `/${storeId}/createCampaign`
- `app/(store)/[storeId]/createCampaign/page.tsx` - ✓ Updated - Draft persistence via localStorage (per-store key), legacy key migration, clear draft safety, and persisted "Preferred Content Style" selections across steps

### State Management
- `store/use-campaign-store.ts` - Zustand store for campaign form state (optional for MVP)

### Types
- `types/campaign.ts` - ✓ Created - TypeScript interfaces for Campaign, CampaignInfluencer, form data, API responses, and type guards

### Utility Functions
- `lib/utils/campaign-helpers.ts` - Helper functions for campaign data formatting and calculations
- `lib/utils/notification-helpers.ts` - ✓ Created - Helper functions for notification CRUD operations (createNotification, markAsRead, getUserNotifications, etc.)

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `route.test.ts` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.
- For API routes in Next.js App Router, tests can be created as `route.test.ts` in the same directory.
- The existing UI at `/campaign/new` and `/influencer/campaigns` will be updated, not recreated.

## Tasks

- [✓] 1.0 Database Schema & Models Setup
  - [✓] 1.1 Add Campaign model to `prisma/schema.prisma` with all fields (id, brandId, title, description, budget, currency, duration, influencerLocation, platforms, targets, status, timestamps)
  - [✓] 1.2 Add CampaignStatus enum to schema (DRAFT, PUBLISHED, ACTIVE, PAUSED, COMPLETED, CANCELLED)
  - [✓] 1.3 Add CampaignInfluencer model to schema with fields (id, campaignId, influencerId, applicationStatus, appliedAt, selectedAt, timestamps)
  - [✓] 1.4 Add CampaignApplicationStatus enum to schema (APPLIED, SELECTED, NOT_SELECTED, WITHDRAWN)
  - [✓] 1.5 Add Notification model to schema with fields (id, userId, type, message, link, read, createdAt)
  - [✓] 1.6 Add NotificationType enum to schema (CAMPAIGN_SELECTION, APPLICATION_UPDATE, SYSTEM)
  - [✓] 1.7 Update Store model to add `campaigns Campaign[]` relation
  - [✓] 1.8 Update Influencer model to add `campaignApplications CampaignInfluencer[]` relation
  - [✓] 1.9 Update User model to add `notifications Notification[]` relation
  - [✓] 1.10 Run `npx prisma migrate dev --name add_campaign_system` to create and apply migration
  - [✓] 1.11 Run `npx prisma generate` to update Prisma client types
  - [✓] 1.12 Verify migration success by checking database tables in MySQL

- [✓] 2.0 Campaign Creation & Management (Brand Side)
  - [✓] 2.1 Create `lib/validations/campaign.ts` with Zod schemas: `createCampaignSchema`, `updateCampaignSchema`, `publishCampaignSchema`
  - [✓] 2.2 Create `types/campaign.ts` with TypeScript interfaces for Campaign, CampaignInfluencer, and form data types
  - [✓] 2.3 Update `app/(dashboard)/campaign/new/page.tsx` to add missing form fields (title, description, budget, currency, duration) above or below existing fields
  - [✓] 2.4 Add form state management in campaign creation page using React useState or react-hook-form
  - [✓] 2.5 Create `app/api/campaigns/route.ts` with POST handler to create draft campaign (validate with Zod, check user has Store, save to DB)
  - [✓] 2.6 Create `app/api/campaigns/route.ts` with GET handler to list campaigns for authenticated brand (filter by brandId from session)
  - [✓] 2.7 Wire up "Continue" button in campaign form to call POST /api/campaigns and show success/error feedback
  - [✓] 2.8 Add client-side validation before form submission (required fields, at least one platform/target selected)
  - [✓] 2.9 Create `app/(dashboard)/campaign/page.tsx` as campaign dashboard listing all brand's campaigns in a table/grid
  - [✓] 2.10 Display campaign cards/rows with title, status badge, budget, applicant count, created date, and action buttons
  - [✓] 2.11 Create `app/api/campaigns/[id]/route.ts` with GET handler for campaign details
  - [✓] 2.12 Create `app/api/campaigns/[id]/route.ts` with PATCH handler to update draft campaigns
  - [✓] 2.13 Create `app/api/campaigns/[id]/publish/route.ts` with POST handler to validate and change status to PUBLISHED
  - [✓] 2.14 Add "Publish" button to campaign dashboard with confirmation dialog before publishing
  - [✓] 2.15 Add "Edit" button for draft campaigns that redirects to campaign creation form with pre-filled data
  - [✓] 2.16 Create `actions/campaign.ts` with server actions: `createCampaign`, `updateCampaign`, `publishCampaign`, `getCampaigns` (optional alternative to API routes - SKIPPED: Using API routes directly)

- [ ] 3.0 Campaign Discovery & Application (Influencer Side)
  - [✓] 3.1 Create `app/api/campaigns/available/route.ts` with GET handler to list published campaigns (status=PUBLISHED, exclude campaigns influencer already applied to)
  - [✓] 3.2 Update `app/influencer/campaigns/campaign.tsx` to replace mock data with API call to fetch real campaigns
  - [✓] 3.3 Add useEffect hook to fetch campaigns on component mount and when tab changes
  - [✓] 3.4 Implement tab filtering logic: "available" shows unapplied campaigns, "applied" shows campaigns with influencer's applications
  - [✓] 3.5 Create `app/api/campaigns/my-applications/route.ts` with GET handler to fetch influencer's applications (join Campaign and CampaignInfluencer tables)
  - [✓] 3.6 Update campaign card rendering to display real data: title, brand name (from Store relation), budget with currency, location, platforms, targets
  - [✓] 3.7 Calculate and display applicant count by counting CampaignInfluencer records per campaign
  - [✓] 3.8 Format requirements summary from targets and platforms JSON data
  - [✓] 3.9 Add loading states (skeleton loaders) while fetching campaign data
  - [✓] 3.10 Add empty state message when no campaigns available ("No campaigns match your criteria")
  - [✓] 3.11 Create `app/api/campaigns/[id]/apply/route.ts` with POST handler to create CampaignInfluencer record
  - [✓] 3.12 Add validation in apply endpoint: check influencer status is APPROVED, check for duplicate applications (unique constraint)
  - [✓] 3.13 Wire up "Apply Now" button to call POST /api/campaigns/[id]/apply
  - [✓] 3.14 Show success toast notification after successful application
  - [✓] 3.15 Update button to "Applied" (disabled) state after application
  - [✓] 3.16 Optimistically update UI to move campaign from "available" to "applied" tab without page refresh
  - [✓] 3.17 Add application status badges on "applied" tab: "Application Pending" (yellow), "Selected" (green), "Not Selected" (gray)

- [✓] 3.0 Campaign Discovery & Application (Influencer Side)

- [ ] 4.0 Applicant Review & Selection (Brand Side)
  - [✓] 4.1 Create `app/(dashboard)/campaign/[id]/applicants/page.tsx` for viewing campaign applicants
  - [✓] 4.2 Create `app/api/campaigns/[id]/applicants/route.ts` with GET handler to fetch applicants (join CampaignInfluencer with Influencer and InfluencerSocial)
  - [✓] 4.3 Display applicant list with influencer name, profile picture, primary niche, application date, follower counts from social platforms
  - [✓] 4.4 Add "View Applicants" button on campaign dashboard that links to applicants page
  - [✓] 4.5 Show applicant count badge next to campaign title (e.g., "5 applicants")
  - [✓] 4.6 Create `app/api/campaigns/[id]/applicants/[influencerId]/select/route.ts` with POST handler to select influencer
  - [✓] 4.7 In select endpoint: update CampaignInfluencer.applicationStatus to SELECTED and set selectedAt timestamp
  - [✓] 4.8 Optionally mark other applicants as NOT_SELECTED when one is selected (SKIPPED: Keeping other applicants as APPLIED)
  - [✓] 4.9 Add "Select" button next to each applicant (only show if not already selected)
  - [✓] 4.10 Show confirmation dialog before selecting influencer ("Are you sure you want to select [Name]?")
  - [✓] 4.11 Update UI to show "Selected" badge after selection without page refresh
  - [✓] 4.12 Add loading state on "Select" button while processing request
  - [ ] 4.13 Link influencer name to their profile page for detailed view (if profile page exists - OPTIONAL)

- [✓] 4.0 Applicant Review & Selection (Brand Side)

- [ ] 5.0 Notification System Implementation
  - [✓] 5.1 Create `lib/utils/notification-helpers.ts` with helper function `createNotification(userId, type, message, link)`
  - [✓] 5.2 In the select influencer endpoint (`/api/campaigns/[id]/applicants/[influencerId]/select`), after updating applicationStatus, create a notification record
  - [✓] 5.3 Set notification fields: userId (influencer's userId), type=CAMPAIGN_SELECTION, message="You've been selected for [Campaign Title]!", link="/influencer/campaigns"
  - [✓] 5.4 Create `app/api/notifications/route.ts` with GET handler to fetch user's notifications (filter by userId, order by createdAt desc)
  - [✓] 5.5 Create `app/api/notifications/[id]/read/route.ts` with PATCH handler to mark notification as read (update read=true)
  - [✓] 5.6 Create `app/api/notifications/route.ts` with POST handler for mark-all-read functionality
  - [✓] 5.7 Add notification badge/icon to influencer navigation/header (check existing layout for notification area)
  - [✓] 5.8 Display unread notification count as a badge number (query count where read=false)
  - [✓] 5.9 Create notification dropdown/panel to display recent notifications with message, timestamp, and link
  - [✓] 5.10 Add click handler to mark notification as read when clicked
  - [✓] 5.11 Make notification message clickable to navigate to the linked page
  - [✓] 5.12 Add real-time notification updates using polling (fetch notifications every 30-60 seconds) or WebSocket (future enhancement)
  - [ ] 5.13 Create `actions/notification.ts` with server action `createNotification` for creating notifications (alternative to direct DB calls - OPTIONAL)

- [✓] 5.0 Notification System Implementation

- [✓] 7.0 Route Alignment & Cleanup
  - [✓] 7.1 Ensure "Create Campaign" links navigate to `/${storeId}/createCampaign` (updated store campaigns page)
  - [✓] 7.2 Update dashboard Edit navigation to store route `/${storeId}/campaign/${campaignId}/edit`
  - [✓] 7.3 Ensure draft persistence works on `/${storeId}/createCampaign` (guard on storeId, migrate legacy keys)

- [ ] 8.0 Draft Persistence & UX Fixes (Store Create Campaign)
  - [✓] 8.1 Persist "Preferred Content Style" checkbox selections across steps and reloads
  - [ ] 8.2 Replace any remaining `/campaign/new` references (e.g., profile test page) with store-scoped navigation logic
  - [✓] 8.3 Store campaigns list: remove dummy data and display real campaigns from API in `app/(store)/[storeId]/campaign/page.tsx`

- [ ] 6.0 Integration, Testing & Polish
  - [ ] 6.1 Test complete flow as Brand: Create campaign → Save as draft → Publish campaign → View on campaign dashboard
  - [ ] 6.2 Test complete flow as Influencer: View published campaigns → Apply to campaign → See application in "applied" tab
  - [ ] 6.3 Test selection flow: Brand views applicants → Selects influencer → Influencer receives notification → Influencer sees "Selected" status
  - [ ] 6.4 Test edge cases: Prevent duplicate applications, prevent unapproved influencers from applying, validate required fields on campaign creation
  - [ ] 6.5 Add proper error handling: Show user-friendly error messages for API failures, validation errors, authentication errors
  - [ ] 6.6 Add loading states to all async operations: Skeleton loaders for data fetching, spinners for form submissions, disabled buttons during processing
  - [ ] 6.7 Test responsive design: Verify all pages work on mobile, tablet, and desktop screen sizes
  - [ ] 6.8 Add TypeScript types for all API responses and ensure type safety across components
  - [ ] 6.9 Test with different user roles: Ensure brands can only see their campaigns, influencers can only apply if approved
  - [ ] 6.10 Write basic API route tests for critical endpoints: Create campaign, publish campaign, apply to campaign, select influencer
  - [ ] 6.11 Add input sanitization and XSS prevention for user-submitted content (title, description)
  - [ ] 6.12 Test error recovery: What happens if notification creation fails after selection? Add try-catch and logging
  - [ ] 6.13 Verify database indexes are working: Check query performance for campaign listing, applicant filtering
  - [ ] 6.14 Add console logging for debugging critical operations (can be removed or replaced with proper logging service later)
  - [ ] 6.15 Create a test checklist document with all test scenarios and expected outcomes
  - [ ] 6.16 Perform final code review: Check for code quality, consistency with existing codebase style, remove any console.logs or debug code