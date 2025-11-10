# 📦 AUTOMATISKA DATABASBACKUPS - GUIDE

## Översikt

Detta dokument beskriver hur du konfigurerar automatiska backups för Bolaxo-databasen.

---

## 🚀 ALTERNATIV 1: Railway Inbyggda Backups (Rekommenderat)

Railway erbjuder automatiska backups för PostgreSQL-databaser på Pro-planen.

### Steg 1: Aktivera Railway Backups

1. Gå till ditt Railway-projekt
2. Välj din PostgreSQL-databas
3. Gå till "Backups" fliken
4. Aktivera "Automatic Backups"
5. Konfigurera:
   - **Frequency:** Daglig (rekommenderat)
   - **Retention:** 30 dagar (eller längre)
   - **Storage:** Railway's managed storage

### Steg 2: Verifiera Backups

- Backups visas i Railway dashboard
- Du kan återställa från valfri backup-punkt
- Backups är krypterade och säkra

**Fördelar:**
- ✅ Enkelt att konfigurera
- ✅ Automatiska backups
- ✅ Enkel återställning via Railway UI
- ✅ Ingen extra kod behövs

**Nackdelar:**
- ⚠️ Kräver Railway Pro plan (~$20/månad)
- ⚠️ Backups lagras endast på Railway

---

## 🔧 ALTERNATIV 2: GitHub Actions (Gratis & Automatisk)

Automatiska backups via GitHub Actions som körs dagligen.

### Steg 1: Skapa Backup Script

Skriptet finns redan i `scripts/backup-database.ts`

### Steg 2: Skapa GitHub Actions Workflow

Skapa `.github/workflows/backup-database.yml`:

```yaml
name: Database Backup

on:
  schedule:
    # Kör varje dag kl 02:00 UTC (03:00 svensk tid)
    - cron: '0 2 * * *'
  workflow_dispatch: # Tillåt manuell körning

jobs:
  backup:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install PostgreSQL client
        run: |
          sudo apt-get update
          sudo apt-get install -y postgresql-client
      
      - name: Create backup
        env:
          # Use DATABASE_PUBLIC_URL for external connections
          DATABASE_URL: ${{ secrets.DATABASE_PUBLIC_URL || secrets.DATABASE_URL }}
          BACKUP_DIR: ./backups
        run: npm run backup:database
      
      - name: Upload backup to GitHub Releases
        uses: actions/upload-artifact@v3
        with:
          name: database-backup-${{ github.run_number }}
          path: backups/*.sql.gz
          retention-days: 30
      
      - name: Upload to S3 (optional)
        if: env.AWS_ACCESS_KEY_ID != ''
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_S3_BUCKET: ${{ secrets.AWS_BACKUP_BUCKET }}
        run: |
          aws s3 cp backups/*.sql.gz s3://$AWS_S3_BUCKET/backups/ --recursive
```

### Steg 3: Lägg till Secrets i GitHub

1. Gå till ditt GitHub-repo
2. Settings → Secrets and variables → Actions
3. Lägg till:
   - **`DATABASE_PUBLIC_URL`** - Din Railway PostgreSQL PUBLIC connection string (viktigt!)
     - Hitta denna i Railway dashboard → PostgreSQL service → Variables
     - Detta är den externa URL:en som fungerar från GitHub Actions
     - Alternativt: `DATABASE_URL` om du kopierar den publika URL:en manuellt
   - `AWS_ACCESS_KEY_ID` (valfritt, för S3)
   - `AWS_SECRET_ACCESS_KEY` (valfritt, för S3)
   - `AWS_BACKUP_BUCKET` (valfritt, för S3)

**⚠️ VIKTIGT:** Railway har två olika URL:er:
- `DATABASE_URL` - För interna anslutningar (inom Railway)
- `DATABASE_PUBLIC_URL` - För externa anslutningar (från GitHub Actions, lokalt, etc.)

För GitHub Actions måste du använda **`DATABASE_PUBLIC_URL`**!

### Steg 4: Lägg till Script i package.json

```json
{
  "scripts": {
    "backup:database": "tsx scripts/backup-database.ts"
  }
}
```

**Fördelar:**
- ✅ Gratis
- ✅ Automatiska backups
- ✅ Backups lagras i GitHub
- ✅ Kan laddas upp till S3

**Nackdelar:**
- ⚠️ Kräver GitHub Actions minutes (gratis tier har 2000 min/månad)
- ⚠️ Backups exponeras i GitHub (men kan krypteras)

---

## 🔄 ALTERNATIV 3: Cron Job på Server (Railway Cron)

Kör backup-scriptet direkt på Railway via cron job.

### Steg 1: Skapa Cron Service

Skapa en ny Railway service som kör backup-scriptet:

1. I Railway dashboard, skapa ny service
2. Välj "Cron Job"
3. Konfigurera:
   - **Schedule:** `0 2 * * *` (varje dag kl 02:00 UTC)
   - **Command:** `npm run backup:database`

### Steg 2: Konfigurera Environment Variables

Sätt följande i Railway:
- `DATABASE_URL` - Din PostgreSQL connection string
- `BACKUP_DIR` - Var backups ska sparas (t.ex. `/app/backups`)
- `RETENTION_DAYS` - Hur många dagar att behålla (default: 30)

### Steg 3: Ladda upp Backups till S3

Uppdatera `scripts/backup-database.ts` för att ladda upp till S3:

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

async function uploadToS3(backupFile: string) {
  if (!process.env.AWS_S3_BACKUP_BUCKET) return

  const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION || 'eu-west-1',
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
    },
  })

  const fileContent = fs.readFileSync(backupFile)
  const fileName = path.basename(backupFile)

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BACKUP_BUCKET,
      Key: `backups/${fileName}`,
      Body: fileContent,
      ContentType: 'application/gzip',
    })
  )

  console.log(`✅ Uploaded to S3: ${fileName}`)
}
```

**Fördelar:**
- ✅ Kör direkt på Railway
- ✅ Kan ladda upp till S3
- ✅ Full kontroll över backup-processen

**Nackdelar:**
- ⚠️ Kräver extra Railway service
- ⚠️ Kan kosta extra (beroende på användning)

---

## 📋 REKOMMENDATION: Hybrid-lösning

**För produktion, rekommenderar jag:**

1. **Railway Inbyggda Backups** (om du har Pro plan)
   - Primär backup-lösning
   - Enkel återställning

2. **GitHub Actions Backup** (som backup av backup)
   - Körs dagligen
   - Laddar upp till S3
   - Ger extra säkerhet

3. **Manuell Backup Script** (för on-demand backups)
   - Körs före större ändringar
   - Kan triggas manuellt

---

## 🔐 SÄKERHET

### Backup Encryption

Backups bör krypteras innan lagring. Lägg till i backup-scriptet:

```typescript
import crypto from 'crypto'

function encryptBackup(data: Buffer, key: string): Buffer {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv)
  
  const encrypted = Buffer.concat([
    iv,
    cipher.update(data),
    cipher.final()
  ])
  
  return encrypted
}
```

### Backup Storage

- ✅ Lagra backups på separata platser (S3 + Railway)
- ✅ Använd versioning på S3 bucket
- ✅ Testa återställning regelbundet (minst månadsvis)
- ✅ Säkerställ att backups inte exponeras publikt

---

## 🧪 TESTA BACKUP & ÅTERSTÄLLNING

### Testa Backup

```bash
# Kör backup manuellt
npm run backup:database

# Verifiera att backup-filen skapades
ls -lh backups/
```

### Testa Återställning

```bash
# Återställ från backup (VIKTIGT: Testa på test-databas först!)
gunzip < backups/backup_YYYYMMDD_HHMMSS.sql.gz | psql $DATABASE_URL

# Eller via Railway UI:
# 1. Gå till PostgreSQL service
# 2. Välj "Backups"
# 3. Välj backup att återställa från
# 4. Klicka "Restore"
```

---

## 📊 MONITORING

### Backup Status Notifications

Lägg till email-notifikationer när backup körs:

```typescript
import { sendEmail } from '@/lib/email'

async function notifyBackupStatus(success: boolean, backupFile?: string) {
  await sendEmail({
    to: 'admin@bolaxo.se',
    subject: success 
      ? `✅ Database Backup Successful - ${new Date().toLocaleDateString('sv-SE')}`
      : `❌ Database Backup Failed - ${new Date().toLocaleDateString('sv-SE')}`,
    html: success
      ? `<p>Backup completed successfully.</p><p>File: ${backupFile}</p>`
      : `<p>Backup failed. Please check logs.</p>`,
  })
}
```

---

## ✅ CHECKLISTA

- [ ] Backup-strategi vald (Railway/GitHub Actions/Cron)
- [ ] Backup-script testat manuellt
- [ ] Automatiska backups konfigurerade
- [ ] Backup-lagring konfigurerad (S3/Railway)
- [ ] Återställning testad (på test-databas)
- [ ] Backup-notifikationer konfigurerade
- [ ] Backup-retention policy satt (30 dagar)
- [ ] Dokumentation uppdaterad

---

## 🆘 ÅTERSTÄLLNING VID KRIS

### Snabb Återställning (Railway)

1. Gå till Railway dashboard
2. Välj PostgreSQL service
3. Gå till "Backups"
4. Välj backup-punkt
5. Klicka "Restore"
6. Vänta på bekräftelse

### Manuell Återställning

```bash
# 1. Hämta backup från S3 eller GitHub
aws s3 cp s3://bucket/backups/backup_YYYYMMDD_HHMMSS.sql.gz ./

# 2. Återställ databas
gunzip < backup_YYYYMMDD_HHMMSS.sql.gz | psql $DATABASE_URL

# 3. Verifiera återställning
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"User\";"
```

---

**Rekommendation:** Börja med Railway's inbyggda backups om du har Pro plan, annars använd GitHub Actions med S3-upload.
