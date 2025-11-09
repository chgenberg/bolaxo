# Databas-koppling för Annonser - Status & Flöde

## ✅ JA - Allt är kopplat mot databasen!

### Hur det fungerar:

## 1. När en annons skapas

### Flöde:
```
Användare fyller i wizard → Klickar "Publicera" 
  ↓
POST /api/listings (med autoPublish: true)
  ↓
prisma.listing.create() → Sparas direkt i PostgreSQL
  ↓
status: 'active' (om autoPublish: true)
publishedAt: new Date() (sätts direkt)
  ↓
Trigger matching algorithm (hittar matchande köpare)
  ↓
Returnerar listing objekt → Annonsen är LIVE!
```

### Koden som gör det:
**`app/api/listings/route.ts` (rad 158-195):**
```typescript
const listing = await prisma.listing.create({
  data: {
    userId,
    companyName,
    anonymousTitle,
    // ... all data
    status: autoPublish ? 'active' : 'draft',  // ← Direkt 'active' om autoPublish
    publishedAt: autoPublish ? new Date() : null,  // ← Publiceringsdatum sätts direkt
    // ...
  }
})
```

**Viktigt:** Om `autoPublish: true` så blir annonsen **direkt aktiv** och synlig!

---

## 2. När annonser hämtas (för sökning)

### Flöde:
```
Användare går till /sok
  ↓
useEffect körs → fetch('/api/listings?status=active')
  ↓
GET /api/listings med status=active
  ↓
prisma.listing.findMany({ where: { status: 'active' } })
  ↓
Hämtar ALLA aktiva annonser från databasen
  ↓
Returnerar JSON → Visas i sökresultat
```

### Koden som gör det:
**`app/api/listings/route.ts` (rad 33-94):**
```typescript
export async function GET(request: NextRequest) {
  const status = searchParams.get('status') || 'active'  // ← Default 'active'
  
  const listings = await prisma.listing.findMany({
    where: { status },  // ← Hämtar direkt från DB
    orderBy: [
      { isNew: 'desc' },
      { publishedAt: 'desc' }
    ]
  })
  
  return NextResponse.json(listings)  // ← Returnerar direkt
}
```

**`app/[locale]/sok/search-page-content.tsx` (rad 82-138):**
```typescript
useEffect(() => {
  const fetchListings = async () => {
    const response = await fetch('/api/listings?status=active')  // ← Hämtar från DB
    if (response.ok) {
      const listings = await response.json()
      setAllObjects(transformedListings)  // ← Visas direkt
    }
  }
  fetchListings()
}, [profileChecked])
```

---

## 3. Status-hantering

### Annons-status:
- **`draft`** - Utkast, syns inte i sökning
- **`active`** - Aktiv, syns i sökning ✅
- **`paused`** - Pausad, syns inte i sökning
- **`sold`** - Såld, syns inte i sökning

### När annonsen blir synlig:
1. **Om `autoPublish: true`** → Direkt `active` när den skapas
2. **Om `autoPublish: false`** → `draft`, måste manuellt aktiveras senare

---

## 4. Real-time synlighet

### ✅ Annonsen syns direkt om:
- `autoPublish: true` när den skapas
- `status: 'active'` sätts direkt
- `publishedAt` sätts till nuvarande tid

### ⚠️ Annonsen syns INTE om:
- `autoPublish: false` → blir `draft`
- `status: 'paused'` → pausad av säljare
- `status: 'sold'` → markerad som såld
- `expiresAt` har passerat → utgången

---

## 5. Var annonser skapas

### Tre ställen där annonser skapas:

#### A. CreateListingWizard (`components/CreateListingWizard.tsx`)
```typescript
const response = await fetch('/api/listings', {
  method: 'POST',
  body: JSON.stringify({
    userId: user?.id,
    ...data,
    status: 'active',      // ← Direkt aktiv
    autoPublish: true      // ← Auto-publicera
  })
})
```

#### B. Klart-sidan (`app/[locale]/salja/klart/klart-page-content.tsx`)
```typescript
const response = await fetch('/api/listings', {
  method: 'POST',
  body: JSON.stringify({
    userId: user.id,
    ...formData,
    autoPublish: true      // ← Auto-publicera
  })
})
```

#### C. Direkt API-anrop
```typescript
POST /api/listings
{
  "userId": "...",
  "autoPublish": true,  // ← Måste vara true för att synas direkt
  // ... annonsdata
}
```

---

## 6. Cache & Real-time

### ❌ Ingen cache-problem:
- **Ingen server-side cache** - Varje request går direkt till databasen
- **Ingen client-side cache** - Sökfunktionen hämtar alltid ny data vid mount
- **Next.js ISR** - Används inte för listings (dynamiskt innehåll)

### ✅ Real-time:
- När en annons skapas med `autoPublish: true` → Syns direkt i sökning
- När en annons pausas → Försvinner direkt från sökning
- När en annons aktiveras → Syns direkt i sökning

---

## 7. Testa själv

### Steg för att verifiera:
1. **Skapa en ny annons:**
   ```
   Gå till /salja/start → Fyll i wizard → Publicera
   ```

2. **Kontrollera i databasen:**
   ```sql
   SELECT id, companyName, status, publishedAt 
   FROM "Listing" 
   WHERE status = 'active' 
   ORDER BY publishedAt DESC 
   LIMIT 5;
   ```

3. **Kontrollera i sökningen:**
   ```
   Gå till /sok → Din nya annons ska synas direkt!
   ```

---

## 8. Potentiella problem

### ⚠️ Om annonsen INTE syns direkt:

#### Problem 1: `autoPublish: false`
**Lösning:** Kontrollera att `autoPublish: true` skickas när annonsen skapas

#### Problem 2: `status: 'draft'`
**Lösning:** Aktivera manuellt i dashboard eller ändra till `status: 'active'`

#### Problem 3: Cache i webbläsaren
**Lösning:** Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

#### Problem 4: Database connection problem
**Lösning:** Kontrollera DATABASE_URL i environment variables

---

## 9. Sammanfattning

### ✅ Allt fungerar korrekt:
- ✅ Annonser sparas direkt i PostgreSQL
- ✅ Annonser hämtas direkt från PostgreSQL
- ✅ Om `autoPublish: true` → Syns direkt i sökning
- ✅ Ingen cache som blockerar
- ✅ Real-time synlighet

### 🔍 Verifiering:
1. Skapa en annons med `autoPublish: true`
2. Kontrollera databasen → `status: 'active'`
3. Gå till `/sok` → Annonsen ska synas direkt!

---

## 10. Förbättringar (valfritt)

### Om du vill ha ännu bättre real-time:
1. **WebSocket** - Push-notifikationer när nya annonser skapas
2. **Polling** - Uppdatera sökresultat var 30:e sekund
3. **Server-Sent Events** - Streama nya annonser till klienten

Men detta är **inte nödvändigt** - nuvarande lösning fungerar perfekt! ✅

