# ✅ AWS S3 SETUP CHECKLIST - Gör detta idag

**Fullständig steg-för-steg guide för att integrera dina befintliga AWS S3 med SME-kit**

---

## 🎯 ÖVERSIKT

```
Du har redan:  AWS Account + S3 ✅
Du behöver:    Uppdatera kod + Setup bucket
Tid:           30 min (setup) + 10 min (test)
Resultat:      Real file storage klar! 🚀
```

---

## 📋 FÖRE DU BÖRJAR

### Vad du behöver:
- ✅ AWS Console access
- ✅ IAM user med S3 permissions
- ✅ Access Key ID + Secret Access Key
- ✅ Texteditor (kod redan uppdaterad)

---

## 🔧 STEG 1: VERIFIERA AWS S3 BUCKET (5 min)

### 1.1 Logga in på AWS Console
```
https://console.aws.amazon.com
```

### 1.2 Gå till S3
```
Services → S3 → Buckets
```

### 1.3 Kolla om du redan har en bucket för dokumenter
```
Om JA:
  ✅ Notera bucket-namn
  ✅ Gå till steg 2

Om NEJ:
  1. Klicka "Create bucket"
  2. Bucket name: "bolagsplatsen-sme-documents"
  3. Region: eu-west-1 (Europa - samma som din databas)
  4. Klicka "Create bucket"
```

### 1.4 Verifiera bucket settings
```
Klicka på bucket namn
Gå till "Properties" tab

Verifiera:
☑ Versioning: ENABLED (så du kan recovery gamla versioner)
☑ Encryption: AES-256 (default)
☑ Block Public Access: 
   - Block all: OFF (vi behöver public read för filer)
```

---

## 🔑 STEG 2: HÄMTA AWS CREDENTIALS (5 min)

### 2.1 Gå till IAM
```
Services → IAM → Users
```

### 2.2 Klicka på din user (eller skapa ny)
```
Behöver en IAM user med S3 permissions

Om du redan har:
  1. Klicka på username
  2. Gå till "Security credentials" tab
  
Om du behöver skapa ny:
  1. Klicka "Create user"
  2. Username: "bolagsplatsen-sme-app"
  3. Klicka "Next"
  4. Permissions: Add "AmazonS3FullAccess" (eller custom)
  5. Klicka "Create user"
```

### 2.3 Skapa Access Key
```
I "Security credentials" tab:

1. Scrolla ner till "Access keys"
2. Klicka "Create access key"
3. Use case: "Application running outside AWS"
4. Klicka "Next"
5. Klicka "Create access key"

KOPIERA och SPARA:
✅ Access Key ID
✅ Secret Access Key

⚠️ OBS: Du kan bara se Secret Key en gång!
   Spara den säkert!
```

---

## 📝 STEG 3: LÄGG I MILJÖVARIABLER (5 min)

### 3.1 Öppna `.env.local` i ditt projekt
```bash
# Gå till projektroot
cd /Users/christophergenberg/Desktop/bolagsportalen

# Öppna .env.local (eller skapa den)
nano .env.local
```

### 3.2 Lägg till AWS S3 variabler
```bash
# AWS S3 Configuration
AWS_S3_REGION=eu-west-1
AWS_S3_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_S3_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET_NAME=bolagsplatsen-sme-documents

# Optional: CloudFront CDN (setup senare)
CLOUDFRONT_DISTRIBUTION_ID=
CLOUDFRONT_DOMAIN_NAME=
```

**Byt ut värdena med dina egna AWS credentials!**

### 3.3 Spara filen
```
Ctrl+X → Y → Enter (om nano)
```

---

## ⚙️ STEG 4: INSTALLERA AWS SDK (10 min)

### 4.1 Öppna terminal
```bash
cd /Users/christophergenberg/Desktop/bolagsportalen
```

### 4.2 Installera paketen
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

**Vänta på installation...**

### 4.3 Verifiera installation
```bash
npm list @aws-sdk/client-s3
```

Du bör se något som:
```
└── @aws-sdk/client-s3@3.x.x
```

---

## 🔄 STEG 5: UPPDATERA KOD

### ✅ Redan gjort!

Vi har redan uppdaterat:
- ✅ `lib/sme-file-handler.ts` - AWS S3 integration
- ✅ `app/api/sme/financials/upload/route.ts` - använder S3
- ✅ `app/api/sme/agreements/upload/route.ts` - använder S3

**Du behöver inte ändra någon kod - det är redan klart!**

---

## 🚀 STEG 6: STARTA OCH TESTA (10 min)

### 6.1 Starta dev server
```bash
npm run dev
```

Du bör se:
```
> next dev
  ▲ Next.js 15.x
  ✓ Ready in 2.5s
```

### 6.2 Testa ekonomi-import
```
1. Öppna browser: http://localhost:3000
2. Logga in som säljar
3. Gå till: /salja/sme-kit/financials
4. Klicka "Ladda upp ekonomi-data"
5. Välj en Excel-fil
6. Klicka "Ladda upp"
```

### 6.3 Verifiera upload i AWS
```
1. Gå till AWS Console → S3
2. Klicka bucket: "bolagsplatsen-sme-documents"
3. Du bör se en mapp med listing-ID
4. Inuti: dina uploadade filer
```

### 6.4 Testa fil-URL
```
1. Från upload-response, kopiera "url"
2. Öppna URL i ny flik
3. Filen bör laddas ned eller visas
```

---

## 🔐 STEG 7: SETUP SECURITY (15 min)

### 7.1 Bucket Policy - Tillåt public read
```
AWS S3 Console:
1. Klicka bucket
2. Gå till "Permissions" tab
3. Scrolla ner till "Bucket policy"
4. Klicka "Edit"
5. Paste denna policy:
```

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bolagsplatsen-sme-documents/*"
    },
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::bolagsplatsen-sme-documents",
        "arn:aws:s3:::bolagsplatsen-sme-documents/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

**OBS: Byt "bolagsplatsen-sme-documents" mot ditt bucket-namn!**

### 7.2 Klicka "Save"
```
Policy är nu aktiverad!
```

### 7.3 CORS Policy (för uploads från browser)
```
1. I "Permissions" tab
2. Scrolla ner till "CORS"
3. Klicka "Edit"
4. Paste denna CORS config:
```

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://bolagsplatsen.se",
      "https://www.bolagsplatsen.se"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

**OBS: Uppdatera med dina domains!**

### 7.4 Klicka "Save"
```
CORS är nu aktiverad!
```

---

## 🧪 STEG 8: FULL TEST FLOW (5 min)

### Test 1: Finansiell data
```
1. /salja/sme-kit/financials
2. Ladda upp Excel-fil
3. Verifiera i AWS S3 console
4. Verifiera fil-URL fungerar
```

### Test 2: Avtal
```
1. /salja/sme-kit/agreements
2. Ladda upp PDF
3. Verifiera i AWS S3 console
4. Verifiera fil-URL fungerar
```

### Test 3: Felhantering
```
1. Prova ladda upp ogiltig filtyp
2. Bör få error
3. Prova igen med rätt format
4. Bör lyckas
```

---

## 🎯 OPTIONAL: CLOUDFRONT CDN (15 min)

För ännu snabbare downloads globalt:

### Setup CloudFront Distribution
```
1. AWS Console → CloudFront → Distributions
2. Klicka "Create distribution"
3. Origin domain: [ditt-bucket].s3.amazonaws.com
4. Origin path: / (lämna tomt)
5. Name: bolagsplatsen-sme
6. Viewer protocol: HTTPS only
7. Allowed methods: GET, HEAD, OPTIONS
8. Cache policy: CachingOptimized
9. Klicka "Create distribution"
10. Vänta 15 min för deployment
```

### Uppdatera .env.local
```
CLOUDFRONT_DISTRIBUTION_ID=E1234ABCDEF
CLOUDFRONT_DOMAIN_NAME=d123456.cloudfront.net
```

### Fördelar:
```
✅ Globalt CDN (snabbare för alla users)
✅ Auto-caching av filer
✅ Reduced bandwidth costs
✅ DDoS protection
```

---

## ⚠️ TROUBLESHOOTING

### Problem: "AWS_S3_ACCESS_KEY_ID is undefined"
```
Lösning:
1. Verifiera .env.local är sparad
2. Verifiera värdena är rätt
3. Restart dev server: Ctrl+C, npm run dev
4. Verifiera inga spaces i värdena
```

### Problem: "Access Denied"
```
Lösning:
1. Verifiera IAM user har S3 permissions
2. Verifiera Access Key ID är rätt
3. Verifiera Secret Access Key är rätt
4. Prova skapa ny Access Key
```

### Problem: "NoSuchBucket"
```
Lösning:
1. Verifiera bucket namn är rätt
2. Verifiera bucket finns
3. Verifiera region är rätt (eu-west-1)
```

### Problem: "Slow uploads"
```
Normalt! Första upload är långsam.
AWS queuer och processerar uploads.
Vänta 5-10 sekunder.
```

### Problem: "403 Forbidden när jag öppnar fil-URL"
```
Lösning:
1. Verifiera bucket policy är satt (Steg 7.1)
2. Verifiera "Block Public Access" är OFF
3. Verifiera CORS policy är satt
4. Test med curl: curl -I [file-url]
```

---

## ✅ SLUTLIG CHECKLIST

- [ ] AWS S3 bucket skapat
- [ ] AWS credentials skapat (Access Key ID + Secret)
- [ ] .env.local uppdaterad med AWS values
- [ ] npm install @aws-sdk/client-s3 körda
- [ ] npm install @aws-sdk/s3-request-presigner körda
- [ ] Dev server restartat
- [ ] Test-fil uppladdat (financials)
- [ ] Fil visas i AWS S3 console
- [ ] File URL fungerar (kan ladda ned/öppna)
- [ ] Test-avtal uppladdat (agreements)
- [ ] Bucket policy satt (public read)
- [ ] CORS policy satt
- [ ] (Optional) CloudFront setup

---

## 🎉 GÖR DU ALLT DETTA ÄR DU KLAR!

```
✅ AWS S3 integrerat
✅ File storage fungerar
✅ Säkerhet konfigurerad
✅ Redo för nästa steg

NÄSTA STEG: Email Integration (SendGrid)
```

---

## 📞 HELP & SUPPORT

**AWS Dokumentation:**
- S3: https://docs.aws.amazon.com/s3/
- IAM: https://docs.aws.amazon.com/iam/
- CloudFront: https://docs.aws.amazon.com/cloudfront/

**Vanliga fel:**
- Access Denied: Verifiera IAM permissions
- Bucket not found: Verifiera bucket namn + region
- CORS error: Verifiera CORS policy i bucket

