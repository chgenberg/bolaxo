# ⚡ Quick Start - No Magic Link Required!

**Status:** ✅ Ready to test full flow WITHOUT email verification

---

## 🚀 Setup (2 minutes)

```bash
# 1. Setup database
npx prisma db seed

# 2. Start server
npm run dev
```

**Open:** `http://localhost:3000`

---

## 📝 Complete Flow Test

### Step 1: Register as Buyer
1. Go to `http://localhost:3000/registrera`
2. Select "Köpare" (Buyer)
3. Click "Fortsätt med email"
4. Enter: `ch.genberg@gmail.com`
5. Fill profile info (name, phone)
6. Click "Skapa konto"
7. ✅ **Logged in directly - no email needed!**
8. You're now in `/kopare/start` dashboard

### Step 2: Search & Save Listing
1. Go to `/sok` (or click "Sök efter företag")
2. Click on any listing (e.g., "Tech Consulting AB")
3. Click "Spara" button
4. ✅ Button turns blue "Sparad"
5. Go back to dashboard `/kopare/start`
6. ✅ See your saved listing

### Step 3: Sign NDA
1. Click on saved listing or go back to `/sok`
2. On listing detail page
3. Click "Signera NDA" or go to "Ekonomi" tab
4. Read NDA text
5. Fill "Varför är du intresserad?" (optional)
6. ✅ Check "Jag har läst och förstår villkoren"
7. Click "Fortsätt till signering"
8. Choose "Signera med BankID" or "Signera manuellt"
9. ✅ "NDA skickad!" message
10. ✅ NDA saved to database with status "pending"

### Step 4: Login as Seller & Approve NDA
1. **New browser tab or incognito:**
   ```
   http://localhost:3000/registrera
   ```
2. Select "Säljare" (Seller)
3. Enter: `seller@example.com`
4. Fill seller profile (company name, org number)
5. ✅ Logged in directly!
6. Go to `/salja/start` dashboard
7. ✅ See "NDA förfrågningar" section
8. See your NDA from ch.genberg@gmail.com
9. Click "Godkänn"
10. ✅ Status changes to "approved"

### Step 5: Chat Between Buyer & Seller
1. **As Buyer (ch.genberg@gmail.com):**
   - Navigate to `/kopare/chat`
   - Or go to dashboard and click "Meddelanden"
   - Select conversation with seller
   - Type a message
   - Click "Skicka"
   - ✅ Message appears

2. **As Seller (seller@example.com):**
   - Go to `/salja/chat`
   - ✅ See buyer's message
   - Type reply
   - Click "Skicka"
   - ✅ Reply appears

3. **Back as Buyer:**
   - Go to `/kopare/chat`
   - ✅ See seller's reply
   - Reply again
   - ✅ Full conversation working!

---

## ✅ Success Checklist

- [ ] Register as buyer without email verification
- [ ] Search and see listings
- [ ] Save a listing
- [ ] Saved listing appears in dashboard
- [ ] Sign NDA as buyer
- [ ] NDA appears in database
- [ ] Register as seller without email
- [ ] Seller sees NDA request
- [ ] Seller approves NDA
- [ ] Status updates to "approved"
- [ ] Buyer sends message
- [ ] Seller receives message
- [ ] Seller replies
- [ ] Buyer sees reply
- [ ] No errors in console

---

## 🔑 Key Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/dev-login` | POST | Create user + session |
| `/api/auth/me` | GET | Get current user |
| `/api/nda-requests` | POST | Create NDA |
| `/api/messages` | GET/POST | Chat messages |
| `/api/saved-listings` | POST/DELETE | Save/unsave |

---

## 💾 What Happens Behind the Scenes

```
1. Register/Login
   ↓
   /api/auth/dev-login creates user in DB
   ↓
   Sets session cookies: bolaxo_user_id, bolaxo_user_email, bolaxo_user_role
   ↓
   AuthContext reads cookies via /api/auth/me
   ↓
   User logged in! Dashboard loads with user.id

2. Save Listing
   ↓
   POST /api/saved-listings { userId, listingId }
   ↓
   Saved in database with user.id from auth

3. Sign NDA
   ↓
   POST /api/nda-requests { listingId, buyerId, sellerId }
   ↓
   buyerId = current user.id from AuthContext
   ↓
   NDA created with status "pending"

4. Chat
   ↓
   Messages linked to currentUserId from auth
   ↓
   Messages checked for NDA permission
   ↓
   Only approved NDAs can chat
```

---

## 🔍 Verify Data in Database

```bash
# Open Prisma Studio
npx prisma studio
```

Navigate to these tables to see your data:

1. **User table**
   - See both ch.genberg@gmail.com and seller@example.com
   - role: "buyer" or "seller"
   - verified: true
   - bankIdVerified: true

2. **SavedListing table**
   - See your saved listings
   - userId linked to ch.genberg@gmail.com
   - listingId of the listings you saved

3. **NDARequest table**
   - See NDA request
   - status: "pending" → "approved"
   - buyerId: ch.genberg@gmail.com
   - sellerId: seller@example.com

4. **Message table**
   - See all chat messages
   - senderId and recipientId linked to users
   - createdAt timestamps

---

## 🐛 Troubleshooting

### Issue: Still asking for magic link
**Solution:** Make sure you're in development mode
- Check `process.env.NODE_ENV === 'development'`
- Restart server: `npm run dev`
- Check browser console for errors

### Issue: Login works but no user in dashboard
**Solution:** Check session cookies
1. Open DevTools → Application → Cookies
2. Look for: `bolaxo_user_id`, `bolaxo_user_email`, `bolaxo_user_role`
3. If missing: Check Network tab for `/api/auth/dev-login` response
4. If error: Check terminal for error logs

### Issue: NDA not saving
**Solution:** 
- Make sure user is logged in (check `/api/auth/me` response)
- Check browser console for errors
- Check Network tab for `/api/nda-requests` POST
- Verify user.id is defined

### Issue: Chat not working
**Solution:**
- Verify NDA is "approved" status in database
- Check that both users are logged in properly
- Check /api/messages endpoint response
- Verify seller sees buyer's message with correct senderId

---

## 📊 Test Results Template

After completing flow:

```
Test Date: [Date]
Tester: [Your name]
Duration: [How long it took]

✅ = Passed
❌ = Failed

- [ ] Register buyer without magic link
- [ ] Register seller without magic link
- [ ] Search listings
- [ ] Save listing (appears in DB)
- [ ] Sign NDA (appears in DB with status pending)
- [ ] Seller sees NDA request
- [ ] Seller approves (status → approved)
- [ ] Buyer can chat
- [ ] Seller receives message
- [ ] Seller can reply
- [ ] Buyer sees reply
- [ ] No console errors

Issues Found:
1. [Issue]: [Description] [Status: Open/Closed]

Performance Notes:
- Registration time: ___ seconds
- NDA submission time: ___ seconds
- Chat message delivery: ___ seconds
```

---

## 🎯 What Works Now

✅ Full E2E without magic links
✅ Database persistence
✅ Real user authentication
✅ NDA flow with approvals
✅ Chat between users
✅ Permission checking (NDA status)
✅ Saved listings sync

---

## ⏭️ Next: Add to Real System

When ready for production:
1. Remove dev-only `/api/auth/dev-login` endpoint
2. Implement real BankID integration
3. Setup email service for magic links
4. Add password-based auth as fallback
5. Deploy to staging/production

---

**Ready?** Follow the "Complete Flow Test" section above! 🚀

**Questions?** Check the troubleshooting section or console errors.

Good luck! 💪
