# 📊 DEMO DATA SUMMARY - ALLA KOMPONENTER

**Status:** ✅ Färdigt för live demo av hela M&A-processen

---

## 1️⃣ Q&A CENTER (/kopare/qa/[listingId])

**Demo Data:** 5 realistic questions with full answers

```
Q1: "Vilka är era största kundsegment?"
├─ Status: ANSWERED (24h response)
├─ Answer: Financial (45%), Retail (35%), Manufacturing (20%)
└─ Top 2 = 28M SEK av 60M total

Q2: "Vilken är churn-raten för era två största kunder?"
├─ Status: PENDING
├─ SLA Deadline: 23 timmar kvar
└─ Priority: HIGH

Q3: "Vilka är era huvudsakliga konkurrenter?"
├─ Status: ANSWERED (18h response)
├─ Answer: Acme Corp, TechSolutions, Global Consulting
└─ Differentiation: 15% cheaper, faster implementation, dedicated support

Q4: "Vilka är era huvudsakliga kostnader?"
├─ Status: ANSWERED
└─ COGS 40%, OpEx 20%, Sales 15%, EBITDA 37%

Q5: "Vilka är säkerhetscertifieringarna?"
├─ Status: ANSWERED
└─ GDPR ✅, ISO 27001 ✅, SOC2 ✅, WCAG 2.1 AA ✅
```

---

## 2️⃣ LOI EDITOR (/kopare/loi/[listingId])

**Demo Data:** 3-version negotiation with final terms

```
VERSION 1 (2025-10-20, Buyer):
├─ Price: 60 MSEK
├─ Earnout: 3 MSEK
└─ Status: Buyer initial offer

VERSION 2 (2025-10-22, Seller):
├─ Price: 70 MSEK (counter!)
├─ Earnout: 2 MSEK
└─ Status: Seller counter-offer

VERSION 3 (2025-10-28, Buyer) ✅ CURRENT:
├─ Price: 65 MSEK (compromise)
├─ Earnout: 5 MSEK (3-year KPI-based)
├─ Cash at closing: 58 MSEK
├─ Escrow: 2 MSEK (18 months)
├─ Non-compete: 3 years
├─ Closing date: 2025-12-31
└─ Status: NEGOTIATION

KEY METRICS:
├─ Multiple: 4.3x EBITDA (22M SEK)
├─ Deal value: 65M enterprise value
├─ Earnout targets: Year1: 65M | Year2: 72M | Year3: 80M
└─ Exclusivity: 45 days
```

---

## 3️⃣ DD MANAGER (/kopare/dd/[listingId])

**Demo Data:** 15 tasks + 4 findings

### Tasks:

```
FINANCIAL (4 tasks):
├─ ✅ Review 3-year audited statements (COMPLETE)
├─ ✅ Analyze revenue recognition (COMPLETE)
├─ ⏳ Verify cash flow projections (IN PROGRESS)
└─ ⭕ Assess working capital (PENDING)

LEGAL (4 tasks):
├─ ✅ Review material contracts (COMPLETE)
├─ ✅ Search for litigation (COMPLETE)
├─ ⏳ Verify IP ownership (IN PROGRESS)
└─ ⭕ Review employment agreements (PENDING)

IT (3 tasks):
├─ ✅ Security assessment (COMPLETE)
├─ ⏳ Infrastructure audit (IN PROGRESS)
└─ ⭕ Disaster recovery test (PENDING)

COMMERCIAL (4 tasks):
├─ ✅ Customer concentration analysis (COMPLETE)
├─ ⭕ Churn analysis (PENDING)
├─ ⭕ Market competitive analysis (PENDING)
└─ ⭕ Sales pipeline validation (PENDING)

PROGRESS: 47% (7/15 completed)
```

### Findings:

```
🔴 FINDING 1 - HIGH SEVERITY:
├─ Customer Concentration Risk
├─ Top 2 customers = 45% of revenue (28M SEK)
├─ Mitigation: Long-term contracts, diversification plan
└─ Status: UNRESOLVED

🟡 FINDING 2 - MEDIUM SEVERITY:
├─ Technology Stack Modernization
├─ .NET Framework 4.x EOL 2026
├─ Migration cost: 2M SEK, Timeline: 6-9 months
└─ Status: UNRESOLVED

🔴 FINDING 3 - HIGH SEVERITY:
├─ Key Person Dependencies
├─ CEO & CTO critical, no retention agreements
├─ Mitigation: 2-3 year retention deals + key person insurance
└─ Status: UNRESOLVED

🟡 FINDING 4 - MEDIUM SEVERITY:
├─ IP Documentation & Patent Portfolio
├─ 3 patentable innovations not formalized
├─ Action: File 3 patent applications (300-400K SEK)
└─ Status: UNRESOLVED
```

---

## 4️⃣ SPA EDITOR (/kopare/spa/[listingId])

**Demo Data:** Version 3 with full terms

```
PURCHASE SUMMARY:
├─ Total: 65 MSEK
├─ Cash at closing: 58 MSEK (89%)
├─ Escrow holdback: 2 MSEK (3% for 18 months)
├─ Earnout: 5 MSEK (8% over 3 years)
└─ Version: 3

REPRESENTATIONS & WARRANTIES:
├─ Financial statements accurate & complete
├─ No undisclosed liabilities
├─ All material contracts disclosed
├─ No pending litigation
├─ All taxes paid & compliant
├─ IP ownership clear & registered
├─ Employment matters in order
└─ No other material matters

INDEMNIFICATION:
├─ Cap: 10% of price (6.5M SEK)
├─ Basket (deductible): 1% (650K SEK)
├─ Survival period: 24 months (standard)
├─ Exceptions:
│  ├─ Tax representations: 7 years
│  ├─ IP representations: Unlimited
│  └─ Fraud: Unlimited
└─ Insurance: Seller to obtain D&O coverage

VERSION HISTORY:
├─ V1: Buyer initial draft
├─ V2: Seller counter with adjusted indemnity
└─ V3: Buyer final (current)
```

---

## 5️⃣ DIGITAL SIGNING (/kopare/signing/[spaId])

**Demo Data:** 3-step signing flow

```
STEP 1: REVIEW DOCUMENT
├─ SPA Version 3 displayed
├─ Link: "Ladda ned PDF"
├─ Review section with all terms
└─ Button: "Fortsätt till signering"

STEP 2: AUTHENTICATE & SIGN
├─ "Signera nu med BankID"
├─ Redirect to eID provider (mock)
├─ Authentication with personal number
├─ Digital signature created
└─ Timestamp: 2025-10-29T14:30:00Z

STEP 3: COMPLETION
├─ ✅ Signering genomförd
├─ Both parties have signed status
├─ Legally binding confirmation
└─ Button: "Gå till stängningschecklistan"
```

---

## 6️⃣ CLOSING CHECKLIST (/kopare/closing/[listingId])

**Demo Data:** 14 tasks with 50% completion

```
KÖPARE TASKS (4/5 complete):
├─ ✅ Financing confirmed
├─ ✅ Final SPA review with counsel
├─ ⭕ Sign closing documents
└─ ⭕ Wire funds to escrow

SÄLJARE TASKS (3/5 complete):
├─ ✅ Shareholder resolution passed
├─ ✅ Tax clearance obtained
├─ ✅ Share certificates prepared
├─ ⭕ Sign closing documents
└─ ⭕ Employee notifications

JOINT TASKS (1/4 complete):
├─ ✅ Escrow instructions signed
├─ ⭕ Final coordination call
├─ ⭕ Share certificate transfer
└─ ⭕ Fund release & completion

PROGRESS: 50% (7/14 complete)

KEY DATES:
├─ -3 days: Shareholder approval ✅
├─ -2 days: Escrow instructions ✅
├─ -1 day: Final coordination call
└─ Closing day: All tasks execute
```

---

## 7️⃣ PAYMENT & CLOSING (/kopare/payment/[spaId])

**Demo Data:** Payment summary and execution

```
DEAL SUMMARY:
├─ Total Enterprise Value: 65 MSEK
├─ Less: Adjustments: -1.2 MSEK (working capital true-up)
└─ Net Amount Due: 63.8 MSEK

PAYMENT BREAKDOWN:
├─ Cash to seller: 58 MSEK
├─ Escrow (held 18 months): 2 MSEK
└─ Earnout escrow: 5 MSEK (due upon KPI achievement)

PAYMENT METHOD:
├─ Primary: Banköverföring (wire transfer)
├─ Secondary: Stripe payment gateway (corporate cards)
├─ Currency: SEK
├─ IBAN: SE45 5000 0000 0504 4000 7391
└─ Reference: SPA-2025-LISTING-001

EXECUTION CHECKLIST:
├─ ✅ Final SPA signed by both parties
├─ ✅ All closing conditions satisfied
├─ ✅ Escrow agent confirmed
├─ ⭕ Wire instructions confirmed
├─ ⭕ Buyer funds received
├─ ⭕ Share certificates transferred
└─ ⭕ Deal marked COMPLETED

POST-CLOSING:
├─ Escrow period: 18 months
├─ Earnout tracking: 3 years
├─ Tax reporting: Within 30 days
└─ Board registration: Within 5 business days
```

---

## 8️⃣ EARNOUT TRACKER (/salja/earnout/[listingId])

**Demo Data:** 3-year KPI tracking

```
EARNOUT STRUCTURE:
├─ Total earnout: 5 MSEK
├─ Period: 3 years (2025-2028)
├─ Metric: Revenue
├─ Payment frequency: Annual
└─ Status: ACTIVE (Post-closing)

YEAR 1 (2025 results):
├─ Target: 65 MSEK revenue
├─ Actual: (pending Year 1 close)
├─ Earned: (pending calculation)
├─ Payment due: 2026-02-28
└─ Status: IN PROGRESS

YEAR 2 (2026 results):
├─ Target: 72 MSEK revenue
├─ Actual: (pending Year 2 close)
├─ Earned: (pending calculation)
├─ Payment due: 2027-02-28
└─ Status: PENDING

YEAR 3 (2027 results):
├─ Target: 80 MSEK revenue
├─ Actual: (pending Year 3 close)
├─ Earned: (pending calculation)
├─ Payment due: 2028-02-28
└─ Status: PENDING

PAYMENT WATERFALL (example if all targets hit):
├─ Year 1: 1.5M SEK (if > 65M)
├─ Year 2: 1.8M SEK (if > 72M)
├─ Year 3: 1.7M SEK (if > 80M)
└─ Total potential: 5M SEK

ADJUSTMENT MECHANISMS:
├─ Add-backs: R&D, one-time costs
├─ Adjustments: Working capital changes
├─ Audit rights: Full revenue verification
└─ Disputes: Binding expert determination
```

---

## ✨ COMPLETE DEMO FLOW

Använd denna ordning för att visa hela processen:

```
1. Säljare: Mina försäljningar → SME Kit + Heat Map (2 min)
2. Köpare: Mina affärer → Q&A Center (2 min)
3. Köpare: LoI Editor (förhandling 3 versioner) (2 min)
4. Köpare: DD Manager (15 tasks + 4 findings) (3 min)
5. Köpare: SPA Editor (juridiskt avtal) (2 min)
6. Båda: Digital Signing (BankID) (1 min)
7. Båda: Closing Checklist (final verify) (1 min)
8. Köpare: Payment & Closing (överföring) (1 min)
9. Säljare: Earnout Tracker (3-år KPI) (1 min)

TOTAL DEMO TIME: ~15 minuter
```

---

## 🎯 KEY DEMO METRICS

```
✅ 5 Q&A frågor (2 answered, 1 pending, 2 answered)
✅ 3 LoI versioner (negotiation tracked)
✅ 15 DD tasks (47% complete)
✅ 4 DD findings (2 high, 2 medium severity)
✅ 65 MSEK deal value
✅ 5 MSEK earnout over 3 years
✅ 14 closing checklist items (50% complete)
✅ 3 SPA versions with history
✅ 100% complete digital signature flow
✅ 3 years earnout tracking ready
```

---

**ALLT KLART FÖR LIVE DEMO! 🚀**

