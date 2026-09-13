# BasaiKU listing flow

## Goal
Build a dedicated `/list` experience that opens from every “List your own” entry point and guides KU-area sellers from listing choice to a polished student-facing preview.

## What will be built

### 1. Listing choice screen
- Add a focused “What would you like to list?” page with Room, Furniture, Item, and Service cards.
- Give each card an icon, concise description, hover/focus feedback, selected state, and clear continuation.
- Keep the existing BasaiKU header/footer styling while making the page feel like a simple decision, not a dashboard.

### 2. Shared guided flow
- Create reusable progress, field, choice-card, photo-upload, preview, action-bar, and confirmation-dialog pieces.
- Keep entered values when moving between steps and back to the listing choice.
- Add direct field errors, accessible labels, focus states, loading feedback, and a success state after publishing.
- Warn before leaving after meaningful edits, with “Keep editing” and “Leave” choices.

### 3. Room listing
- Build five steps: Basics, Location, Details, Photos, Preview.
- Include rent/deposit inputs, room type, KU-area location selection, landmark, draggable map-style pin, automatically presented KU distance, furnishing, furniture, amenities, date picker, description counter, multi-photo upload/reordering/removal, and full listing preview.
- Require title, positive rent, room type, area, furnishing, minimum description length, availability, and at least one photo before publishing.

### 4. Furniture, item, and service listings
- Build compact three-step flows: Details, Photos, Preview.
- Tailor categories, labels, pricing, condition, location/service area, and previews to each listing type.
- Apply matching required-field, positive-price, description, and photo validation.

### 5. Navigation and responsive behavior
- Route the header button and home-page listing call-to-action to `/list`.
- Use a centered 900–1100px layout with a helpful side panel on larger screens.
- Use a nearly full-screen single column and sticky Back/Continue or Edit/Publish bar on mobile.
- Add unique page metadata for the new route.

## Technical details
- Use TanStack Router for `/list` and React state for this sample-data frontend; publishing will show a simulated loading and completion state without permanent storage.
- Use existing Button, Input, Select, Checkbox, Calendar, Popover, AlertDialog, Textarea, and Progress controls.
- Use Zod schemas for client-side validation and safe object URLs for local image previews.
- Use native pointer/drag interactions for the map pin and photo ordering, with keyboard-accessible reorder controls as a fallback.
- Verify the choice screen, room flow, one compact flow, validation, leave dialog, image handling, and desktop/mobile layouts in the running preview.
