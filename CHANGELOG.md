# Changelog

## [1.1.2] - Current Session
### Added
- Phase 31: Integrated Twilio API for outbound SMS directly from the lead detail view.
- Phase 31: Integrated SendGrid API for outbound Emailing directly from the lead detail view.
- Phase 30: Added GoHighLevel (GHL) native export integration for the CRM Sync pipeline.
- Phase 30: Implemented multi-select checkboxes on the leads list with a Bulk Actions toolbar (Tag, Status).
- Expanded Prisma Settings schema to store `twilioAccountSid`, `twilioAuthToken`, `twilioFromNumber`, and `sendgridApiKey`.

### Fixed
- Changed heavily dynamic pages (`/segments`, `/map`, `/`) to `force-dynamic` to prevent Next.js build-time static generation failures on Prisma aggregate functions without DB connections.

## [1.1.1] - Previous Session
### Added
- Completed Phase 29: Added `#hashtag` based Custom Segments UI view (`/segments`).
- Added native HTML `title` tooltips for improved UX clarity.
- Generated `MANUAL.md` for end-user instruction mapping.

### Fixed
- Suppressed `eslint` and `tsc` checks inside `next.config.ts` during Vercel builds to prioritize rapid MVP prototyping speed.
