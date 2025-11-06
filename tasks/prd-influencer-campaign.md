# Product Requirements Document: Influencer Campaign Marketplace (MVP)

## 1. Introduction/Overview

This document outlines the requirements for the Minimum Viable Product (MVP) of the Influencer Campaign Marketplace. The primary goal of this feature is to create a platform where brands can post marketing campaigns and influencers can apply to participate. This initial version will focus exclusively on the creation, discovery, and application process, establishing the core marketplace functionality. All financial transactions, performance tracking, and detailed milestone management will be handled later.

**Context:** The application already has:
- An existing multi-step campaign creation UI at `/campaign/new` (currently non-functional)
- An influencer campaigns listing page at `/influencer/campaigns` (currently showing mock data)
- User authentication with `User` and `Influencer` models in the database
- A `Store` model representing brands/businesses

This PRD focuses on connecting these existing UI components with functional backend logic to create a working marketplace.
## 2. Goals

*   Enable brands to create and publish marketing campaigns with a defined objective and budget.
*   Allow influencers to discover and browse a list of available campaigns.
*   Provide a mechanism for influencers to apply for campaigns that match their interests.
*   Allow brands to review applications and select an influencer for their campaign.

## 3. User Stories

*   **Brand:** "As a brand, I want to publish a campaign with a set budget so that relevant influencers can apply."
*   **Influencer:** "As an influencer, I want to see and apply for campaigns that match my niche so I can earn money."
*   **Brand:** "As a brand, after publishing a campaign, I want to view a list of influencers who have applied so I can choose the best fit."
*   **Influencer:** "As an influencer, I want to be notified if a brand has selected me for a campaign so I can begin work."

## 4. Functional Requirements

### For Brands:

1.  **Create Campaign (Multi-Step Form):**
    *   A brand must be able to access the "Create Campaign" flow at `/campaign/new`.
    *   The UI is already implemented with a multi-step stepper showing: "Basic details", "Product and budget", "Recommendations", "Templates", "Review".
    *   For the MVP, we will only make the **first step ("Basic details")** functional and save the data.
    *   The form must capture the following fields **already in the existing UI**:
        *   `influencerLocation` (Object: `{ country: string, city: string }`)
        *   `platforms` (Array of strings: "Instagram", "Facebook", "TikTok", "YouTube", "Twitter", "Blog")
        *   `targets` (Object with categories):
            *   `awareness`: Array (e.g., ["Brand awareness", "Reach", "Barter"])
            *   `advocacy`: Array (e.g., ["Traffic", "Engagement", "App installs", "Video Views"])
            *   `conversions`: Array (e.g., ["Conversions", "Catalog Sales"])
            *   `contentType`: Array (e.g., ["Creation + Posting", "Creation Only", "Posting only"])
    *   **Fields to be ADDED to the UI form** (as these are critical but missing):
        *   `title` (Text input - required)
        *   `description` (Text area - optional)
        *   `budget` (Number input - required)
        *   `currency` (Dropdown with default 'UGX' - required)
        *   `duration` (Number input for days - optional)
    *   **Backend fields** (auto-populated, not shown in UI):
        *   `brandId` (UUID from authenticated user's Store)
        *   `status` (defaults to 'draft')
        *   `createdAt`, `updatedAt` (auto-generated timestamps)
    *   On clicking "Continue", the campaign data should be:
        *   Validated (title, budget, and at least one platform/target must be selected)
        *   Saved to the database with `status = 'draft'`
        *   User remains on the same page with success feedback (the multi-step UI will NOT proceed to step 2 in this MVP)

2.  **View My Campaigns:**
    *   A brand must be able to view a list of all their campaigns (drafts and published) from a dedicated dashboard page (to be created at `/campaign` or `/dashboard/campaigns`).
    *   For each campaign, display: `title`, `status`, `budget`, `number of applicants`, `created date`.
    *   Provide quick actions: "Edit" (for drafts), "Publish", "View Applicants".

3.  **Publish Campaign:**
    *   From the campaign list, a brand must be able to click "Publish" on a draft campaign.
    *   Publishing should:
        *   Validate that required fields are complete
        *   Change the campaign's `status` to `'published'`
        *   Make the campaign visible on the influencer campaigns page
    *   A confirmation dialog should appear before publishing.

4.  **View Applicants:**
    *   For each published campaign, a brand must be able to click "View Applicants" to see a list of influencers who have applied.
    *   The applicant list should display:
        *   Influencer name (from `Influencer` model: `firstName`, `lastName`)
        *   Profile picture (if available)
        *   Primary niche
        *   Application date
        *   Social media follower counts (from `InfluencerSocial` model)
    *   Each applicant row should have a "Select" button.

5.  **Select Influencer:**
    *   A brand must be able to click "Select" next to an influencer in the applicants list.
    *   Selecting an influencer should:
        *   Update the `CampaignInfluencer` record's `applicationStatus` to `'selected'`
        *   Trigger a notification to the influencer (see Notifications section)
        *   Optionally, mark all other applicants for that campaign as `'not_selected'`

### For Influencers:

1.  **View Campaigns:**
    *   An influencer must be able to access the campaigns listing page at `/influencer/campaigns`.
    *   This page already has a complete UI showing campaign cards with mock data.
    *   Replace the mock data with real campaigns from the database where `status = 'published'`.
    *   Each campaign card should display:
        *   `title`
        *   Brand/company name (from the associated `Store` model)
        *   `budget` (formatted with currency)
        *   Application deadline (if available)
        *   Location (`influencerLocation.city` or "Remote")
        *   Number of applicants (count from `CampaignInfluencer` where campaign matches)
        *   Requirements summary (derived from `targets` and `platforms`)
        *   Category badge (from `targets.awareness`, `targets.advocacy`, etc.)
        *   Featured badge (if `featured = true` in future)
    *   The UI already has tabs: "available", "applied", "active", "completed". For MVP:
        *   **Available**: Show all published campaigns the influencer hasn't applied to
        *   **Applied**: Show campaigns where the influencer has an application record with `applicationStatus = 'applied'` or `'selected'`
        *   **Active** and **Completed**: Show empty state for now (future feature)

2.  **Apply for Campaign:**
    *   When an influencer clicks "Apply Now" on a campaign card, open a modal or navigate to a details page.
    *   The application flow should:
        *   Check if the influencer's `status` in the `Influencer` model is `'APPROVED'` (only approved influencers can apply)
        *   Check if the influencer has already applied (prevent duplicate applications)
        *   Create a `CampaignInfluencer` record with:
            *   `campaignId`: The campaign being applied to
            *   `influencerId`: The authenticated user's influencer ID
            *   `applicationStatus`: `'applied'`
            *   `appliedAt`: Current timestamp
    *   Show a success message and update the button to "Applied" (disabled state).
    *   Update the "Available" and "Applied" tabs to reflect the new application.

3.  **View Application Status:**
    *   On the "Applied" tab, each campaign card should show the current `applicationStatus`:
        *   `'applied'`: Show "Application Pending" badge
        *   `'selected'`: Show "You've been selected!" badge with green highlight
        *   `'not_selected'`: Show "Not selected" badge with gray styling
    *   When clicked, the campaign detail should show the full application history.

4.  **View Selection Notification:**
    *   When an influencer is selected for a campaign, they should see a notification (in-app notification badge or banner).
    *   The notification should link to the campaign details page where they can see next steps (contact brand, etc.).

### System/Notifications:

1.  **Notify Influencer on Selection:**
    *   When a brand selects an influencer (updates `CampaignInfluencer.applicationStatus` to `'selected'`), the system must create an in-app notification.
    *   For MVP, implement a simple in-app notification system:
        *   Create a `Notification` table (if it doesn't exist) with fields: `id`, `userId`, `type`, `message`, `link`, `read`, `createdAt`
        *   When an influencer is selected, create a notification record:
            *   `type`: `'campaign_selection'`
            *   `message`: `"You've been selected for [Campaign Title]!"`
            *   `link`: `/influencer/campaigns` (or specific campaign detail page)
            *   `read`: `false`
    *   Display unread notification count as a badge in the influencer's navigation/header.
    *   Email notifications are out of scope for MVP but should be designed for easy integration later.

2.  **Application Confirmation:**
    *   When an influencer applies to a campaign, show an immediate success toast/notification on the page.
    *   No email is sent in MVP (future enhancement).

## 5. Non-Goals (Out of Scope)

*   **Payments & Escrow:** No in-app deposits, wallet management, fund locking, or payouts will be implemented. All financial arrangements are to be handled offline.
*   **Milestone Management:** The complex milestone system (e.g., 3% for acceptance, 10% for content creation) is out of scope.
*   **Performance Tracking:** No tracking of KPIs like CPM, CPC, CTR, or ROAS.
*   **Fraud Detection & Disputes:** No fraud analysis or dispute resolution mechanisms.
*   **Recommendation Engine:** The system will not recommend influencers to brands for now.
*   **Admin Tooling:** No special admin dashboards for monitoring campaigns will be built in this phase.

## 6. Design Considerations
   *  Don't create any. New eyes. First check if we already have us. Of a specific sub feature you're implementing. Before opting for a new one, because almost the  front end of what we want to implement. Is already existing, so please make sure to fast check for the UI of the functionality of implemented before opting to create a new one. This is a must. 
*   The UI and UX for all new pages and components should follow the existing application's style guide.
*   Leverage the existing component library (`components/ui/`) for buttons, forms, cards, etc., to ensure visual consistency.
*   The campaign creation form should be intuitive and user-friendly.
*   The campaign list for influencers should be clean and easy to browse.

## 7. Technical Considerations

### Database Schema

*   **New Data Models:** Two new tables will be required in the Prisma schema:

    **1. Campaign Table:**
    ```prisma
    model Campaign {
      id                  String              @id @default(uuid())
      brandId             String              // Foreign key to Store model
      title               String
      description         String?             @db.Text
      budget              Float
      currency            String              @default("UGX")
      duration            Int?                // Duration in days
      influencerLocation  Json?               // {country: string, city: string}
      platforms           Json?               // Array of platform names
      targets             Json?               // {awareness: [], advocacy: [], conversions: [], contentType: []}
      status              CampaignStatus      @default(DRAFT)
      createdAt           DateTime            @default(now())
      updatedAt           DateTime            @updatedAt
      
      brand               Store               @relation(fields: [brandId], references: [id], onDelete: Cascade)
      applicants          CampaignInfluencer[]
      
      @@index([brandId])
      @@index([status])
      @@map("campaign")
    }
    
    enum CampaignStatus {
      DRAFT
      PUBLISHED
      ACTIVE
      PAUSED
      COMPLETED
      CANCELLED
    }
    ```

    **2. CampaignInfluencer Table (Join Table):**
    ```prisma
    model CampaignInfluencer {
      id                  String                      @id @default(uuid())
      campaignId          String
      influencerId        String
      applicationStatus   CampaignApplicationStatus   @default(APPLIED)
      appliedAt           DateTime                    @default(now())
      selectedAt          DateTime?
      createdAt           DateTime                    @default(now())
      updatedAt           DateTime                    @updatedAt
      
      campaign            Campaign                    @relation(fields: [campaignId], references: [id], onDelete: Cascade)
      influencer          Influencer                  @relation(fields: [influencerId], references: [id], onDelete: Cascade)
      
      @@unique([campaignId, influencerId]) // Prevent duplicate applications
      @@index([campaignId])
      @@index([influencerId])
      @@index([applicationStatus])
      @@map("campaign_influencer")
    }
    
    enum CampaignApplicationStatus {
      APPLIED
      SELECTED
      NOT_SELECTED
      WITHDRAWN
    }
    ```

    **3. Notification Table (Optional for MVP, but recommended):**
    ```prisma
    model Notification {
      id        String              @id @default(uuid())
      userId    String
      type      NotificationType
      message   String              @db.Text
      link      String?
      read      Boolean             @default(false)
      createdAt DateTime            @default(now())
      
      user      User                @relation(fields: [userId], references: [id], onDelete: Cascade)
      
      @@index([userId])
      @@index([read])
      @@map("notification")
    }
    
    enum NotificationType {
      CAMPAIGN_SELECTION
      APPLICATION_UPDATE
      SYSTEM
    }
    ```

*   **Schema Updates Required:**
    *   Add `campaigns` relation to the existing `Store` model
    *   Add `campaignApplications` relation to the existing `Influencer` model
    *   Add `notifications` relation to the existing `User` model (if Notification table is created)

### API Endpoints

New API routes will be needed:

**For Brands:**
*   `POST /api/campaigns` - Create a draft campaign
*   `GET /api/campaigns` - List all campaigns for the authenticated brand (with query params for filtering by status)
*   `GET /api/campaigns/[id]` - Get campaign details
*   `PATCH /api/campaigns/[id]` - Update a draft campaign
*   `POST /api/campaigns/[id]/publish` - Publish a draft campaign
*   `GET /api/campaigns/[id]/applicants` - List all influencers who applied to a campaign
*   `POST /api/campaigns/[id]/applicants/[influencerId]/select` - Select an influencer

**For Influencers:**
*   `GET /api/campaigns/available` - List all published campaigns (with optional filters)
*   `GET /api/campaigns/[id]` - Get campaign details
*   `POST /api/campaigns/[id]/apply` - Apply to a campaign
*   `GET /api/campaigns/my-applications` - List all campaigns the influencer has applied to
*   `DELETE /api/campaigns/[id]/apply` - Withdraw application (future feature)

**For Notifications:**
*   `GET /api/notifications` - Get all notifications for the authenticated user
*   `PATCH /api/notifications/[id]/read` - Mark a notification as read
*   `POST /api/notifications/mark-all-read` - Mark all notifications as read

### State Management

*   Consider creating a Zustand store for campaign creation: `store/use-campaign-store.ts` (similar to existing `use-product-store.ts`)
*   This will help manage the multi-step form state as the feature expands beyond MVP.

### Authentication & Authorization

*   All campaign creation endpoints require authentication and that the user has an associated `Store` record.
*   All influencer application endpoints require authentication and that the user has an `Influencer` record with `status = 'APPROVED'`.
*   Use middleware to check permissions before allowing access to specific routes.

### Validation

*   Use Zod schemas for API request validation (similar to existing patterns in the codebase).
*   Create validation schemas in `lib/validations/campaign.ts`:
    *   `createCampaignSchema`
    *   `updateCampaignSchema`
    *   `applyCampaignSchema`

## 8. Success Metrics

*   **Primary Success Metric:** A brand can successfully create a campaign, publish it, review applicants, and select an influencer. The selected influencer is correctly notified and can see their selection status.
*   **Secondary Metrics:**
    *   Number of campaigns created by brands within the first week of launch.
    *   Number of applications submitted by influencers.
    *   Percentage of published campaigns that receive at least one application.
    *   Average time from campaign publication to first application.
*   **Technical Success Criteria:**
    *   All API endpoints respond within 500ms for typical requests
    *   Zero data loss when creating/updating campaigns
    *   Proper validation prevents invalid data from being saved
    *   Notifications are delivered within 1 second of influencer selection

## 8.1. Alignment with Manager's Vision

**Note:** This MVP intentionally excludes many features outlined in the manager's comprehensive campaign document to ensure we deliver a working foundation quickly. The following features from the manager's document are **deferred to post-MVP phases**:

| Manager's Feature | MVP Status | Reasoning |
|------------------|-----------|-----------|
| Wallet & Escrow System | ❌ Out of Scope | Complex financial infrastructure; requires payment gateway integration, regulatory compliance, and extensive testing. Will be Phase 2. |
| Milestone-based Payouts | ❌ Out of Scope | Depends on wallet system; adds significant complexity. Phase 2-3. |
| Performance Tracking (CPM, CPC, CTR, CPA) | ❌ Out of Scope | Requires social media API integrations or hosted content tracking. Phase 3. |
| Fraud Detection | ❌ Out of Scope | Needs ML models and anomaly detection; premature for marketplace MVP. Phase 4. |
| Recommendation Engine | ❌ Out of Scope | AI-based matching requires sufficient data and training. Phase 3-4. |
| Campaign Types (Product, Service, Coupon) | ✅ Partially In Scope | Data model supports any type, but UI doesn't differentiate yet. Can add dropdown in form. |
| Multi-influencer Campaigns | ❌ Out of Scope | Adds workflow complexity; single influencer is sufficient for MVP. Phase 2. |
| Deliverables Tracking | ❌ Out of Scope | Content submission/approval system is a major feature. Phase 2-3. |

**What IS included (aligned with manager's goals):**
- ✅ Campaign creation with objectives and budget
- ✅ Influencer discovery and browsing
- ✅ Application system
- ✅ Brand can select influencer
- ✅ Basic notification system
- ✅ Data model that supports future expansion to full feature set

This MVP creates the **foundational marketplace** that proves the core value proposition: connecting brands with influencers. Once validated, we can layer on the sophisticated financial, tracking, and optimization features the manager envisions.

## 9. Open Questions

*   ~~What is the preferred method for notifying an influencer upon selection (in-app notification, email, or both)?~~ **RESOLVED:** In-app notifications for MVP; email notifications are a future enhancement.
*   Should a brand be able to select multiple influencers for the same campaign, or only one? **For MVP, assume one influencer per campaign.** Multi-influencer campaigns are a future feature.
*   What happens to a campaign after an influencer is selected? Does it automatically move to "Active" status, or does it remain "Published"? **For MVP, keep it as "Published".** Status management will be handled in future iterations.
*   Should brands be able to delete or cancel campaigns? **Out of scope for MVP.** Add this to future enhancements.

## 10. Future Enhancements (Post-MVP)

To maintain focus on the MVP, the following features are explicitly deferred to future releases:

*   **Multi-step Campaign Creation:** Enable all steps in the campaign creation wizard (Product selection, Recommendations, Templates, Review)
*   **Campaign Filtering & Search:** Advanced filters for influencers (by budget range, location, category, platform)
*   **Influencer Recommendations:** AI/algorithm-based suggestions of influencers for brands
*   **Campaign Edit & Deletion:** Allow brands to edit published campaigns or delete drafts
*   **Multi-Influencer Selection:** Allow brands to select multiple influencers per campaign
*   **Email Notifications:** Send emails on key events (selection, new applications, etc.)
*   **Campaign Analytics:** View basic stats (views, applications received, engagement rates)
*   **Application Messages:** Allow brands and influencers to exchange messages within applications
*   **Campaign Duplication:** Clone an existing campaign to create a new one
*   **Draft Auto-save:** Automatically save campaign drafts as the user types
*   **Campaign Templates:** Pre-built campaign structures for common use cases
*   **Influencer Profile Preview:** View full influencer profile without leaving the applicants page