# Comments Feature - Test Plan

## Pre-Testing Setup

1. **Run Database Migration**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Ensure you have at least one test account logged in**

## Test Cases

### Test 1: Open Comments Modal
- [ ] Navigate to main page with product cards
- [ ] Click the comment icon (💬) on any product card
- [ ] **Expected**: Modal opens with comments section
- [ ] **Verify**: Modal title shows "Comments"
- [ ] **Verify**: Product title appears below modal title

### Test 2: View Comments (Empty State)
- [ ] Open comments modal on a product with no comments
- [ ] **Expected**: Empty state message appears
- [ ] **Verify**: Shows "💬" emoji
- [ ] **Verify**: Shows "No comments yet. Be the first to comment!"

### Test 3: View Comments (With Data)
- [ ] Open comments modal on a product with existing comments
- [ ] **Expected**: All comments display in list
- [ ] **Verify**: Each comment shows:
  - User avatar (image or initials)
  - User name
  - Time ago (e.g., "2 hours ago")
  - Comment text
- [ ] **Verify**: Comments are sorted newest first

### Test 4: Add Comment (Logged In)
- [ ] Open comments modal while logged in
- [ ] Type a comment in the textarea at bottom
- [ ] Click Send button (or press Enter)
- [ ] **Expected**: Comment posts successfully
- [ ] **Verify**: New comment appears at top of list immediately
- [ ] **Verify**: Textarea clears after posting
- [ ] **Verify**: Your avatar/name shows correctly
- [ ] **Verify**: Time shows "just now" or similar

### Test 5: Add Comment (Not Logged In)
- [ ] Log out
- [ ] Open comments modal
- [ ] Try to post a comment
- [ ] **Expected**: Error message appears
- [ ] **Verify**: Shows "Unauthorized" or login prompt
- [ ] **Verify**: Comment does not post

### Test 6: Validation - Empty Comment
- [ ] Try to post empty comment (just spaces)
- [ ] **Expected**: Nothing happens or validation error
- [ ] **Verify**: Send button might be disabled
- [ ] **Verify**: No API call made for empty content

### Test 7: Loading States
- [ ] Open modal (watch for loading spinner)
- [ ] **Expected**: Shows spinner while fetching comments
- [ ] Post a comment (watch for loading on button)
- [ ] **Expected**: Send button shows spinner while posting

### Test 8: Long Comments
- [ ] Post a very long comment (multiple paragraphs)
- [ ] **Expected**: Comment displays properly
- [ ] **Verify**: Text wraps correctly (uses break-words)
- [ ] **Verify**: Scroll area handles overflow

### Test 9: Multiple Comments
- [ ] Post 5+ comments on same product
- [ ] **Expected**: All comments display
- [ ] **Verify**: Scroll area becomes scrollable
- [ ] **Verify**: Newest comments at top

### Test 10: Close and Reopen Modal
- [ ] Open modal, view comments
- [ ] Close modal (click X or outside)
- [ ] Reopen modal
- [ ] **Expected**: Comments refresh
- [ ] **Verify**: Same comments display
- [ ] **Verify**: Any new comments from others appear

### Test 11: Keyboard Shortcuts
- [ ] Open modal
- [ ] Type comment
- [ ] Press Enter (without Shift)
- [ ] **Expected**: Comment submits
- [ ] Type another comment
- [ ] Press Shift+Enter
- [ ] **Expected**: New line added (doesn't submit)

### Test 12: Multiple Products
- [ ] Open comments on Product A
- [ ] Post comment
- [ ] Close modal
- [ ] Open comments on Product B
- [ ] **Expected**: Different comments show
- [ ] **Verify**: Product B doesn't show Product A's comments

### Test 13: Click Outside to Close
- [ ] Open modal
- [ ] Click outside the modal (on backdrop)
- [ ] **Expected**: Modal closes
- [ ] **Verify**: Can reopen without issues

### Test 14: Prevent Navigation
- [ ] Click comment button
- [ ] **Expected**: Modal opens, product detail page doesn't open
- [ ] **Verify**: URL doesn't change
- [ ] Click elsewhere on card
- [ ] **Expected**: Navigates to product detail page

### Test 15: Mobile Responsiveness
- [ ] Open in mobile viewport (< 640px)
- [ ] Open comments modal
- [ ] **Expected**: Modal fits screen properly
- [ ] **Verify**: All elements visible and usable
- [ ] **Verify**: Can scroll comments
- [ ] **Verify**: Can type and submit

## API Endpoint Tests

### GET /api/comments/[productId]
```bash
# Test fetching comments
curl http://localhost:3000/api/comments/[PRODUCT_ID]

# Expected Response:
{
  "success": true,
  "comments": [
    {
      "id": "uuid",
      "content": "Great product!",
      "createdAt": "2024-...",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "image": "https://..."
      }
    }
  ],
  "count": 1
}
```

### POST /api/comments/[productId]
```bash
# Test posting comment (requires auth cookie)
curl -X POST http://localhost:3000/api/comments/[PRODUCT_ID] \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=..." \
  -d '{"content":"Test comment"}'

# Expected Response:
{
  "success": true,
  "comment": {
    "id": "uuid",
    "content": "Test comment",
    "createdAt": "2024-...",
    "user": { ... }
  }
}
```

## Database Verification

### Check Comments Table
```bash
npx prisma studio
```
- [ ] Open Prisma Studio
- [ ] Navigate to Comment model
- [ ] **Verify**: Comments table exists
- [ ] **Verify**: Columns: id, content, userId, productId, createdAt, updatedAt
- [ ] **Verify**: Relations to User and Product work

### SQL Query
```sql
SELECT c.*, u.name as user_name, p.title as product_title
FROM comment c
JOIN user u ON c.userId = u.id
JOIN product p ON c.productId = p.id
ORDER BY c.createdAt DESC;
```

## Performance Tests

### Load Time
- [ ] Open modal with 0 comments
- [ ] **Expected**: Opens in < 200ms
- [ ] Open modal with 50+ comments
- [ ] **Expected**: Opens in < 1 second

### Post Time
- [ ] Post a comment
- [ ] **Expected**: Appears in < 500ms
- [ ] **Verify**: Optimistic update (shows immediately)

## Error Handling Tests

### Network Error
- [ ] Disconnect internet
- [ ] Try to open modal
- [ ] **Expected**: Shows error message
- [ ] Reconnect and retry
- [ ] **Expected**: Works normally

### Invalid Product ID
```bash
curl http://localhost:3000/api/comments/invalid-id
```
- [ ] **Expected**: Returns error response

### Server Error
- [ ] Stop database
- [ ] Try to fetch comments
- [ ] **Expected**: Shows user-friendly error

## Acceptance Criteria

✅ All tests pass
✅ No console errors
✅ No TypeScript errors
✅ Comments persist in database
✅ UI matches design mockup from attachment
✅ Mobile responsive
✅ Accessible (keyboard navigation works)
✅ Performance acceptable (< 1s load time)

## Known Issues / Limitations

1. **TypeScript Server**: May need restart to recognize new Prisma types
2. **Real-time**: Comments don't auto-refresh (need manual refresh)
3. **Pagination**: All comments load at once (may be slow with 100+)
4. **Moderation**: No spam protection or content filtering yet

## Next Steps After Testing

If all tests pass:
1. ✅ Mark feature as complete
2. ✅ Deploy to staging/production
3. ✅ Monitor for errors in production
4. ✅ Gather user feedback
5. ✅ Plan next iteration (replies, likes, etc.)

If tests fail:
1. ❌ Document failing test cases
2. ❌ Create bug tickets
3. ❌ Fix issues
4. ❌ Re-test
5. ❌ Repeat until all pass
