# 🚀 AWS S3 INTEGRATION GUIDE - Du har redan det!

**Byt från Supabase → AWS S3 (enkelt!)**

---

## ✅ GODA NYHETER

```
Du har redan:     AWS S3 ✅
Vi behövde:       File storage ✅
Resultat:         PERFEKT MATCH!

Du behöver inte:
❌ Supabase
❌ Nya loginuppgifter
❌ Nya tjänster
✅ Bara uppdatera kod
```

---

## 📋 STEG 1: VERIFIERA AWS S3 SETUP (5 min)

### 1.1 Gå till AWS Console
```
https://console.aws.amazon.com
```

### 1.2 Hitta S3
```
Services → S3 → Buckets
```

### 1.3 Skapa ny bucket (om inte redan finns)
```
Bucket name: "bolagsplatsen-sme-documents"
Region: eu-west-1 (Europa)
Settings:
  ✅ Block Public Access: OFF (för file serving)
  ✅ Versioning: ON (backup)
  ✅ Encryption: AES-256 (standard)
```

### 1.4 Kopiera credentials
```
Go to: IAM → Users → [Your User]
Click "Security credentials" tab
Create new Access Key:
  - Copy: Access Key ID
  - Copy: Secret Access Key
```

---

## 🔑 STEG 2: LÄGG I .env.local

Uppdatera `.env.local` från `.env.example`:

```bash
# AWS S3 Configuration
AWS_S3_REGION=eu-west-1
AWS_S3_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_S3_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET_NAME=bolagsplatsen-sme-documents

# Optional CloudFront (för CDN)
CLOUDFRONT_DISTRIBUTION_ID=E1234ABCD
CLOUDFRONT_DOMAIN_NAME=d123456.cloudfront.net
```

---

## 📦 STEG 3: INSTALLERA AWS SDK

```bash
cd /Users/christophergenberg/Desktop/bolagsportalen

npm install @aws-sdk/client-s3
```

---

## 🔄 STEG 4: UPPDATERA FILE HANDLER

Ersätt Supabase-kod med AWS S3:

```typescript
// lib/sme-file-handler.ts

import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand,
  HeadObjectCommand 
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import path from "path";

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "bolagsplatsen-sme-documents";

// File validation
export function validateFileType(mimeType: string, category: "financial" | "documents"): boolean {
  const validTypes = {
    financial: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/pdf"],
    documents: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  };
  return validTypes[category]?.includes(mimeType) || false;
}

// Sanitize filename
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .substring(0, 255);
}

// Calculate checksum
export async function calculateChecksum(buffer: Buffer): Promise<string> {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

// Upload to AWS S3
export async function uploadToStorage(
  buffer: Buffer,
  fileName: string,
  listingId: string
): Promise<{ url: string; path: string; checksum: string }> {
  const sanitized = sanitizeFileName(fileName);
  const checksum = await calculateChecksum(buffer);
  const path = `${listingId}/${Date.now()}-${sanitized}`;

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: path,
      Body: buffer,
      ContentType: "application/octet-stream",
      Metadata: {
        checksum,
        uploadedAt: new Date().toISOString(),
      },
    });

    await s3Client.send(command);

    // Generate public URL
    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_S3_REGION || "eu-west-1"}.amazonaws.com/${path}`;

    return { url, path, checksum };
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error(`Failed to upload file to S3: ${String(error)}`);
  }
}

// Generate signed URL (temporary access - 24 hours)
export async function getSignedUrl(
  key: string,
  expirationSeconds: number = 86400 // 24 hours
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, {
      expiresIn: expirationSeconds,
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error(`Failed to generate signed URL: ${String(error)}`);
  }
}

// Generate public file URL
export function generateFileUrl(fileName: string, listingId: string): string {
  const sanitized = sanitizeFileName(fileName);
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_S3_REGION || "eu-west-1"}.amazonaws.com/${listingId}/${sanitized}`;
}

// Check if file exists
export async function fileExists(key: string): Promise<boolean> {
  try {
    await s3Client.send(new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));
    return true;
  } catch (error) {
    return false;
  }
}
```

---

## 🎯 STEG 5: API ROUTES FUNGERAR REDAN!

Dina nuvarande API routes behöver **INTE ändras**:

```typescript
// app/api/sme/financials/upload/route.ts
// REDAN KOMPATIBEL! Använder uploadToStorage()

const { url, checksum } = await uploadToStorage(Buffer.from(buffer), sanitizedName, listingId);
// Fungerar med både Supabase OCH AWS S3!
```

**Varför?** Eftersom vi abstraherade file-upload i `lib/sme-file-handler.ts`!

---

## ✅ STEG 6: TEST LOKALT

### 6.1 Starta dev server
```bash
npm run dev
```

### 6.2 Gå till ekonomi-import
```
http://localhost:3000/salja/sme-kit/financials
```

### 6.3 Ladda upp test-fil
```
1. Klicka "Ladda upp ekonomi-data"
2. Välj en Excel-fil
3. Klicka "Ladda upp"
```

### 6.4 Verifiera i AWS S3
```
1. Gå till AWS Console → S3
2. Klicka bucket: "bolagsplatsen-sme-documents"
3. Du bör se: listing-id/timestamp-filename.xlsx
```

### 6.5 Test fil-URL
```
Från upload-response, kopiera "url"
Öppna den i ny flik
Filen bör visas/laddas ned
```

---

## 🌐 STEG 7: SETUP CLOUDFRONT (Optional CDN)

Om du vill ännu snabbare downloads:

### 7.1 Skapa CloudFront Distribution
```
AWS Console → CloudFront → Distributions → Create Distribution

Origin:
  - Domain name: [bucket].s3.amazonaws.com
  - Origin path: / (empty)
  - Name: bolagsplatsen-sme
  
Default cache behavior:
  - Viewer protocol: HTTPS only
  - Allowed methods: GET, HEAD, OPTIONS
  - Cache policy: Managed-CachingOptimized
  - Origin request policy: CORS-S3Origin
  
Click "Create"
Vänta 15 min för deployment
```

### 7.2 Uppdatera .env.local
```
CLOUDFRONT_DISTRIBUTION_ID=E1234ABCD
CLOUDFRONT_DOMAIN_NAME=d123456.cloudfront.net
```

### 7.3 Uppdatera generateFileUrl
```typescript
export function generateFileUrl(fileName: string, listingId: string): string {
  const sanitized = sanitizeFileName(fileName);
  
  // Med CloudFront (CDN)
  if (process.env.CLOUDFRONT_DOMAIN_NAME) {
    return `https://${process.env.CLOUDFRONT_DOMAIN_NAME}/${listingId}/${sanitized}`;
  }
  
  // Direkt S3 (utan CDN)
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_S3_REGION || "eu-west-1"}.amazonaws.com/${listingId}/${sanitized}`;
}
```

---

## 🔐 SECURITY BEST PRACTICES

### 1. Bucket Policy (Public Read, Authenticated Write)
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

### 2. CORS Policy
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD", "PUT", "POST"],
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

---

## 💰 KOSTNAD

```
AWS S3 Pricing (eu-west-1):
- Storage: $0.023 per GB
- Requests: $0.0004 per 1000 PUT
- Data transfer: Ingång gratis, utgång $0.02-0.05 per GB

Exempel (100 companies, 1000 files, 2GB):
- Storage: $0.046/månad (2GB × $0.023)
- Requests: ~$0.40 (1000 uploads)
- Total: ~$0.50/månad

Med CloudFront (CDN):
- CDN: $0.085 per GB (snabbare globally)
- Total: ~$0.17 + S3 = ~$0.67/månad
```

---

## 🧪 TROUBLESHOOTING

### Problem: "Access Denied"
**Solution:**
```
1. Verifiera AWS credentials i .env.local
2. Verifiera IAM user har S3 permissions
3. Verifiera bucket policy är rätt satt
```

### Problem: "NoSuchBucket"
**Solution:**
```
1. Verifiera bucket namn är rätt
2. Verifiera bucket finns i rätt region
3. Verifiera AWS_S3_REGION är rätt (eu-west-1)
```

### Problem: "SignatureDoesNotMatch"
**Solution:**
```
1. Verifiera Access Key ID är rätt
2. Verifiera Secret Access Key är rätt
3. Verifiera ingen extra spaces i .env.local
```

### Problem: "Slow uploads"
**Solution:**
```
1. Normal för första gången
2. AWS queues uploads
3. Verify inte throttled (CloudWatch)
4. Om CloudFront: vänta 15 min för cache
```

---

## ✅ VERIFIKATION CHECKLIST

- [ ] AWS S3 bucket skapat
- [ ] AWS credentials kopierade
- [ ] .env.local uppdaterad med AWS values
- [ ] npm install @aws-sdk/client-s3 körda
- [ ] lib/sme-file-handler.ts uppdaterad
- [ ] Dev server restartat
- [ ] Test-fil uppladdad
- [ ] Fil visas i AWS S3 console
- [ ] File URL fungerar
- [ ] (Optional) CloudFront setup
- [ ] (Optional) Bucket policy satt

---

## 🎉 NÄSTA STEG

Nu är file storage klart med AWS S3! Fortsätt med:

1. **Email Integration** (SendGrid) - IMORGON
2. **Excel Parser** (xlsx) - ONSDAG
3. **Error Monitoring** (Sentry) - TORSDAG

---

## 📞 AWS DOKUMENTATION

- S3 Docs: https://docs.aws.amazon.com/s3/
- SDKs: https://docs.aws.amazon.com/sdk-for-javascript/
- CloudFront: https://docs.aws.amazon.com/cloudfront/
- IAM: https://docs.aws.amazon.com/iam/

