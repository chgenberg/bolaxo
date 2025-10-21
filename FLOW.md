# Bolagsplatsen User Flow Map

## 📍 Navigation Map

```
┌─────────────────────────────────────────────────────────────┐
│                         HERO PAGE (/)                        │
│  "Sälj ditt företag – tryggt och enkelt"                   │
│                                                              │
│  [Skapa annons] ──────────────┐                             │
│  [Så funkar det för säljare] ─┼──────────┐                  │
└───────────────────────────────┼──────────┼──────────────────┘
                                │          │
                    ┌───────────┘          │
                    ▼                       ▼
        ┌──────────────────┐   ┌──────────────────────┐
        │  /salja/start    │   │     /salja           │
        │  STEP 1/7        │   │  Info Page           │
        │  Grundinfo       │   │  - 4 steps           │
        └────────┬─────────┘   │  - Before/After NDA  │
                 │              │  - FAQ               │
                 ▼              └──────────────────────┘
        ┌──────────────────┐
        │  /salja/affarsdata│
        │  STEP 2/7        │
        │  Nyckeltal       │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  /salja/styrkor- │
        │      risker      │
        │  STEP 3/7        │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  /salja/media    │
        │  STEP 4/7        │
        │  Media & anonym  │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  /salja/nda      │
        │  STEP 5/7        │
        │  NDA-inställn.   │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  /salja/priser   │
        │  STEP 6/7        │
        │  Välj paket      │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  /salja/preview  │
        │  STEP 7/7        │
        │  Förhandsgranska │
        └────────┬─────────┘
                 │
                 │ [Publicera]
                 ▼
        ┌──────────────────┐
        │  /salja/klart    │
        │  ✅ SUCCESS      │
        │  Next steps      │
        └────────┬─────────┘
                 │
                 │ [Dashboard]
                 ▼
        ┌──────────────────┐
        │  /dashboard      │
        │  Din översikt    │
        └──────────────────┘
```

## 🎯 Step-by-Step Details

### Step 1: Grundinfo (`/salja/start`)
**Input Fields:**
- Företagstyp (dropdown)
- Ort/region (text)
- Omsättning (select: ranges)
- Antal anställda (select: ranges)
- Ägarens roll (text)

**Features:**
- Auto-save every 10 seconds
- Real-time validation
- [Spara utkast] button
- [Fortsätt] button

---

### Step 2: Affärsdata (`/salja/affarsdata`)
**Input Fields:**
- Omsättning år 1, 2, 3 (numbers)
- EBITDA (number)
- Prisidé min/max (numbers)
- Vad ingår (select)

**Features:**
- Tooltip on EBITDA
- Info box about multiplar
- Back button enabled

---

### Step 3: Styrkor & Risker (`/salja/styrkor-risker`)
**Input Fields:**
- Styrka 1, 2, 3 (text)
- Risk 1, 2, 3 (text)
- Varför säljer du? (textarea)

**Features:**
- Transparency message
- Encouraging microcopy
- Tips for honest answers

---

### Step 4: Media (`/salja/media`)
**Input Fields:**
- Anonym visning (checkbox)
- Logo upload (placeholder)
- Bilder (placeholder)

**Features:**
- Upload UI (not functional in MVP)
- NDA-locked fields explanation
- Info about what's protected

---

### Step 5: NDA (`/salja/nda`)
**Input Fields:**
- NDA-mall (radio: standard/egen)
- Kräv BankID (checkbox)

**Features:**
- Checklist of locked data
- Process explanation
- Recommendation badges

---

### Step 6: Priser (`/salja/priser`)
**Input Fields:**
- Package selection (3 cards)

**Packages:**
- Basic: 4,995 kr
- Featured: 9,995 kr (recommended)
- Premium: 19,995 kr

**Features:**
- Interactive cards
- Hover effects
- Feature comparison
- "No binding" info

---

### Step 7: Preview (`/salja/preview`)
**Features:**
- Before/After NDA tabs
- Validation checklist
- Selected package summary
- [Redigera] [Spara utkast] [Publicera]

**Validation:**
- Required fields check
- Visual checklist
- Warning if incomplete

---

### Success Page (`/salja/klart`)
**Features:**
- ✅ Success icon
- Status card (Live, paket, synlig till)
- Next steps buttons:
  - Dela annons
  - Bjud in rådgivare
  - Öppna datarum
- Email notification info

---

## 🔄 Auto-Save Flow

```
User types → Debounce 100ms → Update Zustand → Save to localStorage
                                                         ↓
                                                 Update timestamp
                                                         ↓
                                                 Show "Sparad..."
```

## 🎨 Design Patterns Used

### Cards
```tsx
<div className="card">
  // White background
  // Rounded corners (rounded-2xl)
  // Shadow (shadow-md)
  // Padding (p-8)
</div>
```

### Buttons
```tsx
// Primary
<button className="btn-primary">Text</button>

// Secondary
<button className="btn-secondary">Text</button>

// Ghost
<button className="btn-ghost">Text</button>
```

### Form Fields
```tsx
<FormField
  label="Label"
  name="fieldName"
  value={value}
  onChange={handler}
  required
  tooltip="Help text"
  error="Error message"
/>
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
  - Sticky bottom nav visible
  - Full-width cards
  - Stacked buttons

- **Tablet**: 768px - 1024px
  - 2-column grids
  - Side-by-side buttons

- **Desktop**: > 1024px
  - 3-column grids
  - Max-width containers
  - Spacious layouts

## 💾 Data Structure

```typescript
interface FormData {
  // Step 1
  foretagestyp: string
  ort: string
  omsattningIntervall: string
  antalAnstallda: string
  agarensRoll: string
  
  // Step 2
  omsattningAr1: string
  omsattningAr2: string
  omsattningAr3: string
  ebitda: string
  prisideMin: string
  prisideMax: string
  vadIngår: string
  
  // Step 3
  styrka1: string
  styrka2: string
  styrka3: string
  risk1: string
  risk2: string
  risk3: string
  varforSalja: string
  
  // Step 4
  anonymVisning: boolean
  logoUrl: string
  images: string[]
  
  // Step 5
  ndaTemplate: string
  requireBankId: boolean
  
  // Step 6
  selectedPackage: 'basic' | 'featured' | 'premium'
}
```

## 🎯 Key UX Decisions

1. **Progress Always Visible** - Sticky progress bar shows "Steg X av 7"
2. **Never Lose Data** - Auto-save every 10 seconds + manual save
3. **Instant Feedback** - Green checkmarks on valid fields
4. **Mobile First** - Bottom navigation on small screens
5. **Trust Indicators** - Stars, stats, security icons on hero
6. **Transparency** - Before/After NDA preview builds trust
7. **Clear Pricing** - No hidden fees, simple packages
8. **Helpful Tooltips** - Context help where needed
9. **Calm Design** - Blue tones, soft shadows, white space
10. **Professional Tone** - Swedish microcopy, formal but friendly

## 🎨 Brand Voice (Swedish)

- **Headline**: Direct, confident ("Sälj ditt företag – tryggt och enkelt")
- **Microcopy**: Helpful, professional ("Du kan vara anonym...")
- **CTAs**: Action-oriented ("Skapa annons", "Fortsätt", "Publicera")
- **Trust**: Specific numbers ("40 000+ köpare", "4,6/5")

