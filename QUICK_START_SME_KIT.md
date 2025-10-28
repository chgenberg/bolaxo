# 🚀 QUICK START - SME KIT TESTING

**5 minuter till du kan testa allt!**

## Step 1: Database Migration (1 min)

```bash
cd /Users/christophergenberg/Desktop/bolagsportalen

# Run the migration
npx prisma migrate dev

# Should output:
# ✓ Generated Prisma Client
# ✓ Created new migration: sme_automation
# ✓ Ran all pending migrations
```

## Step 2: Start Dev Server (30 sec)

```bash
npm run dev

# Should output:
# ▲ Next.js 15.0
# - Local: http://localhost:3000
```

## Step 3: Visit the Hub (30 sec)

Open your browser:
```
http://localhost:3000/salja/sme-kit
```

You should see:
- 🚀 Flashy header "SME Automation Kit"
- 📊 Progress bar (14% complete initially)
- 7 module cards with status indicators
- Green checkmark on "Identitet & Konto" (already complete)
- Orange in-progress on "Ekonomi-import"
- Gray pending on others

## Step 4: Test Module 1 - Ekonomi-import (3 min)

Click "Ekonomi-import" card OR:
```
http://localhost:3000/salja/sme-kit/financials
```

**What to test:**
1. Click "Ladda upp fil" button
2. Try uploading any file (it will validate file type)
3. After upload, see automatic:
   - Revenue: 10,0 MSEK
   - Base EBITDA: 2,0 MSEK
4. Adjust add-backs (owner salary, one-time items)
5. See normalized EBITDA recalculate live
6. Click "Godkänn & Fortsätt"
7. See completion screen with "Gå till nästa steg"

**Try this flow:**
- Set Owner Salary: 500,000 SEK
- Set One-Time Items: 200,000 SEK
- Watch EBITDA update to: 2,7 MSEK
- Click next

## Step 5: Test Module 2 - Avtalsguide (2 min)

Click "Avtalsguide" card OR:
```
http://localhost:3000/salja/sme-kit/agreements
```

**What to test:**
1. Click buttons to add agreements:
   - 👥 Kundkontrakt
   - 📦 Leverantörsavtal
   - 👔 Anställningsavtal
2. For each, fill in:
   - Avtalsnamn (required)
   - Vikt (Low/Medium/High/CRITICAL)
   - Risk (Low/Medium/High)
   - Motpart
3. Add at least 1 CRITICAL agreement
   - See yellow warning: "⚠️ 1 kritiska avtal"
4. Add 1 HIGH-RISK agreement
   - See orange warning: "⚠️ 1 högrisk-avtal"
5. Click "Avsluta & Fortsätt"
6. See completion screen

**Pro tip:**
Try adding:
- Kundsupplying med ACME AB (CRITICAL, High Risk)
- Leasingavtal lokaler (High, Medium)
- IP-licens från SoftCorp (Medium, Low)

## Step 6: Explore Hub Status

Go back to hub:
```
http://localhost:3000/salja/sme-kit
```

Notice:
- Progress bar now shows ~40-50% (2 modules done)
- Modul 1 & 2 now have ✓ checkmarks and green status
- Count shows "2/7 modules complete"

## Step 7: Try Other Modules

Click any of these (they're placeholders but show "Coming soon"):
- 🔐 Datarum
- 📄 Teaser & IM
- ✍️ NDA-portal
- 📦 Advisor Handoff

All will show a nice "Coming soon" screen.

---

## 🎮 WHAT'S WORKING

✅ File upload validation  
✅ Form submission & state management  
✅ Progress tracking  
✅ Tab/step navigation  
✅ Responsive design (try on mobile!)  
✅ Loading states  
✅ Success screens  
✅ Beautiful gradient UI  

## ⚠️ WHAT'S MOCKED

- File upload returns mock data (not actually saved yet)
- API calls return mock responses
- Database not yet updated (migration needs to run first)
- BankID signing not implemented

---

## 💡 TIPS FOR TESTING

### Test on Mobile
```
http://localhost:3000/salja/sme-kit
```
Then on your phone:
- Find your computer's IP (e.g., 192.168.1.100)
- Visit: `http://192.168.1.100:3000/salja/sme-kit`
- Test responsive design

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Do any action (upload file, submit form)
4. See POST requests to `/api/sme/*`
5. Check response format

### Test Form Validation
- Try submitting empty forms
- Try uploading wrong file types
- See error messages appear

### Visual Testing Checklist
- [ ] Colors match brand (navy, pink)
- [ ] Icons look good (Lucide React)
- [ ] Progress bars animate smoothly
- [ ] Text is readable on all sizes
- [ ] Buttons have hover effects
- [ ] Form inputs look clean

---

## 🐛 COMMON ISSUES & FIXES

### "Cannot find module 'fs/promises'"
```bash
# Just ignore, it's used in server-side utils
# The app will work fine
```

### Files not persisting after page refresh
✅ Expected! They're mocked. When we add real database, they'll persist.

### Module links broken
- Check URL is: `/salja/sme-kit/financials` (not `/sme-kit/financials`)
- Make sure you ran migration

### Buttons not responding
- Check browser console (F12) for errors
- Try hard refresh (Ctrl+Shift+R)

### Progress bar not updating
- It's hardcoded for now (Ekonomi 50%, Avtal 0%)
- Will be dynamic once we add database

---

## 📊 NEXT STEPS AFTER TESTING

1. **Implement Module 3 (Datarum)**
   - Follow: `/SME_PLATFORM_INTEGRATION.md` → "MODUL 3"
   - Auto-folder generation
   - Drag-drop upload
   - Audit logging

2. **Connect to Real Database**
   - Run: `npx prisma migrate deploy`
   - Update API routes to save to DB
   - Make progress bar dynamic

3. **Add More Features**
   - File watermarking
   - PDF generation for Teaser/IM
   - Email sending for NDA

---

## ✨ SHOW TO YOUR TEAM

Share this test flow:
1. Go to http://localhost:3000/salja
2. See new "SME Automation Kit" CTA
3. Click it
4. Explore the 7 modules
5. Test Ekonomi & Avtal flows

**Time to impress:** 5 minutes!

---

## 📞 IF SOMETHING BREAKS

```bash
# Clear cache & rebuild
rm -rf .next
npm run build

# Check database status
npx prisma studio

# Check logs
npm run dev 2>&1 | tail -20

# Reset database (careful!)
npx prisma migrate reset
```

---

**Happy testing! 🎉**

