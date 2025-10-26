# SORA VIDEO CONTENT STRATEGY - BOLAGSPLATSEN

## 🎬 VISION
Skapa visuell storytelling som illustrerar Bolagsplatsens värdeförslag genom AI-genererade videor som:
- Följer varumärket strikt (minimalist, skandinavisk, modern)
- Berättar historier om köp/försäljning av företag
- Är autentiska och mänskliga (inte robotiska)
- Fungerar på mobil och desktop
- Kan integreras som hero-videor och animations

---

## 📋 CONTENT PILLARS

### PILLAR 1: HERO VIDEOS (Landing Pages)
**Mål**: Skapa visuell hook för besökare
**Längd**: 15-30 sekunder
**Platser**: Homepage hero, /salja, /kopare

#### Video 1.1: "The Journey - Seller"
**Prompt för Sora**:
"Professional minimalist video showing a Swedish entrepreneur's journey selling their business. 
Opens with a woman at her desk in a modern Scandinavian office, looking thoughtful. 
She decides to sell. Visual montage of business documents, growth charts in clean typography (navy blue and pink accents).
Shows secure handshake, digital signatures, successful transaction complete.
Color palette: White background, navy blue (#001f3f), accent pink (#FF1493), clean sans-serif fonts.
Modern, hopeful tone. No people faces visible, focus on emotions and actions.
Shot in 4K, cinematic lighting, minimal color grading."

**Expected Use**: Homepage hero background video (muted, looping)

#### Video 1.2: "The Discovery - Buyer"
**Prompt för Sora**:
"Minimalist video of a Swedish investor discovering perfect business opportunity.
Starts with dark office, investor at computer. Screen shows search interface with filters (animated, clean design).
Businesses appear one by one like a deck of cards (each with icons: revenue, employees, growth potential).
Investor finds the perfect match - screen lights up with green confirmation.
Color palette: Navy blue (#001f3f), orange accents (#FF8C00), pink highlights.
Modern, professional tone. Clean UI elements. 4K quality."

**Expected Use**: /kopare hero background (muted, looping)

---

### PILLAR 2: EDUCATIONAL ANIMATIONS (Process Pages)

#### Video 2.1: "Seller Process - Step by Step"
**Prompt för Sora**:
"Clean animated explainer video showing the 5-step seller process.
Each step appears as a numbered card with icons (minimize motion sickness):
1. Create listing (document icon, keyboard typing)
2. Receive inquiries (notification bell, message bubbles)
3. NDA process (handshake, lock icon)
4. Share information (folder, documents)
5. Close deal (checkmark, celebration)
Smooth transitions between steps. Color transitions from navy to pink to orange.
All text is clean sans-serif, white background. Minimalist Danish/Swedish design aesthetic."

**Expected Use**: /salja/page.tsx process section, autoplay muted

#### Video 2.2: "Buyer Process - Discover & Close"
**Prompt för Sora**:
"Clean animated video showing buyer's 7-step journey:
1. Profile setup (user icon animation)
2. Preferences selection (checkboxes, filters)
3. Smart matching (algorithm visualization)
4. Business discovery (briefcases appearing)
5. Request NDA (document sign)
6. Due diligence (magnifying glass, documents)
7. Close deal (handshake, confetti)
Minimalist style, navy/pink/orange palette, smooth animations between steps."

**Expected Use**: /kopare/page.tsx process section

---

### PILLAR 3: VALUE PROP VIDEOS (Feature Highlights)

#### Video 3.1: "Anonymity & Security"
**Prompt för Sora**:
"15-second video showing business anonymity and security.
Opens with office building shrouded in privacy - animated privacy shield appears.
Show sensitive information (contracts, financials) being protected by moving digital locks.
Information only reveals when NDA is approved (visual unlock).
Color palette: Navy blue, with green security indicators.
Minimalist geometric shapes, no people."

**Expected Use**: /priser or /for-maklare as feature demonstration

#### Video 3.2: "AI Matching Technology"
**Prompt för Sora**:
"20-second video showing intelligent matching algorithm.
Abstract visualization: seller profile on left, buyer profile on right.
AI lines connecting compatible characteristics (arrows, nodes, network visualization).
Final match appears with percentage score (92%, 87%, etc).
All in minimalist style, navy/pink color scheme.
Modern, tech-forward but trustworthy tone."

**Expected Use**: Homepage features, /kopare page

#### Video 3.3: "Real-Time Analytics"
**Prompt för Sora**:
"15-second dashboard animation showing real-time statistics updating.
Dashboard with key metrics appearing and updating:
- Views: 2,341 → 2,392
- NDA Requests: 12 → 13
- Messages: 45 → 47
All in beautiful UI with navy/pink color scheme.
Smooth number transitions, professional tone."

**Expected Use**: /dashboard hero, /salja page

---

### PILLAR 4: TESTIMONIAL VIDEOS (Social Proof)

#### Video 4.1: "Success Story - Seller Montage"
**Prompt för Sora**:
"20-second success montage showing multiple seller perspectives (no faces visible).
Scene 1: Hands signing digital document on tablet
Scene 2: Calendar marking successful closing date
Scene 3: Celebration moment (blurred background, focus on hands toasting)
Scene 4: Text overlay appearing: 'Closed in 45 days' with checkmark
All professional, minimal, trustworthy. Navy/pink aesthetic."

**Expected Use**: /success-stories page, homepage testimonials

#### Video 4.2: "Buyer Success"
**Prompt för Sora**:
"20-second video showing buyer acquiring perfect business.
Scene 1: Buyer at desk, looking at business profile with matching percentage
Scene 2: Handshake (animated, digital)
Scene 3: Keys being handed over (metaphorical)
Scene 4: New owner at desk of their acquired business
Text: 'Found the right fit in 3 weeks'
Professional, aspirational tone."

**Expected Use**: /success-stories page

---

### PILLAR 5: SYSTEM VIDEOS (Operations)

#### Video 5.1: "Secure Document Room"
**Prompt för Sora**:
"15-second visualization of secure document storage.
Shows digital vault/safe being unlocked.
Documents uploading and organizing into folders.
Files being accessed securely (timestamp, verification).
Lock icons throughout. Clean UI visualization.
Navy blue, security-focused aesthetic."

**Expected Use**: /objekt/[id]/datarum explanation

#### Video 5.2: "NDA Process"
**Prompt för Sora**:
"20-second animation showing NDA signing and approval.
1. Document appears on screen
2. Digital signature applied (smooth animation)
3. Checkmark confirms signature
4. Status changes from 'Pending' to 'Approved'
5. Information unlock animation
Clean, professional, all in brand colors."

**Expected Use**: Onboarding/educational content

---

## 🎨 DESIGN SPECIFICATIONS FOR SORA PROMPTS

### Visual Style Guide to Include in ALL Prompts
```
"Visual Style:
- Minimalist Scandinavian design aesthetic
- Color Palette: Navy Blue (#001f3f), Accent Pink (#FF1493), Accent Orange (#FF8C00), 
  Neutral White (#FFFFFF), Neutral Off-White (#FDFBF9)
- Typography: Clean, modern sans-serif (think: Inter, Circular)
- No cluttered elements, lots of whitespace
- Geometric shapes where possible
- Smooth, professional animations
- 4K resolution (3840x2160 or 1920x1080 minimum)
- Professional lighting, cinematic quality
- Swedish/Scandinavian setting when appropriate
"
```

### TECHNICAL SPECS PER VIDEO TYPE

**Hero Videos (Background)**
- Format: MP4 (H.264)
- Resolution: 1920x1080 or 3840x2160
- Duration: 20-30 seconds
- Frame Rate: 30fps (smooth)
- Audio: None (muted autoplay)
- File Size: <50MB (for web optimization)
- Loop: Yes (seamless)

**Explainer Videos**
- Format: MP4
- Resolution: 1920x1080
- Duration: 15-25 seconds
- Frame Rate: 30fps
- Audio: Optional (can add voiceover)
- File Size: <30MB
- Loop: Optional

**Testimonial Videos**
- Format: MP4
- Resolution: 1920x1080
- Duration: 15-30 seconds
- Frame Rate: 30fps
- Audio: Optional (testimonial audio overlay)
- File Size: <30MB
- Aspect Ratio: 16:9 (primary), 9:16 (mobile)

---

## 📍 INTEGRATION PLAN

### Phase 1: HERO VIDEOS (Week 1)
- Generate 2 hero videos (Seller, Buyer)
- Create compressed versions for web
- Integrate into HeroSection.tsx
- Test on mobile/desktop

### Phase 2: PROCESS VIDEOS (Week 2)
- Generate 4 educational videos
- Add subtitle overlays (in editing)
- Integrate into /salja, /kopare pages
- Add playback controls

### Phase 3: VALUE PROP VIDEOS (Week 3)
- Generate 3 feature videos
- Create thumbnail previews
- Integrate into feature sections
- Add call-to-action overlays

### Phase 4: TESTIMONIALS (Week 4)
- Generate 2 testimonial videos
- Create carousel component
- Integrate into /success-stories
- Add credibility elements

---

## 🛠️ IMPLEMENTATION CHECKLIST

### Infrastructure
- [ ] S3 bucket for video storage (videos/)
- [ ] CloudFront CDN for video delivery
- [ ] Video compression pipeline (FFmpeg)
- [ ] Thumbnail generation for each video
- [ ] Video player component (HLS support)

### Code Components Needed
```typescript
// VideoHero.tsx - For hero background videos
// VideoPlayer.tsx - For controlled playback
// VideoCarousel.tsx - For testimonial videos
// VideoOptimizer.ts - Video compression & optimization
```

### SEO & Performance
- [ ] Video sitemap
- [ ] Schema markup (VideoObject)
- [ ] Thumbnail images for SEO
- [ ] Alt text for all videos
- [ ] Captions/subtitles for accessibility

---

## 💰 COST ESTIMATION

### Sora Generation
- ~20 videos × $0.06/second average = ~$12,000-15,000 total
- OR use Runway, Pika, or D-ID for alternatives

### Post-Production
- Compression & optimization: 10-15 hours
- Editing (overlays, subtitles): 20-30 hours
- Integration & testing: 15-20 hours

### Hosting & Delivery
- S3 storage: ~$50/month (for 100GB)
- CloudFront delivery: ~$0.085/GB
- Budget: ~$200/month ongoing

---

## 🎯 SUCCESS METRICS

### Track
- Video completion rate (% watched)
- Engagement increase on pages with videos
- Bounce rate reduction
- Conversion rate lift
- Average session duration

### Targets
- 70%+ video completion rate
- 25% increase in engagement
- 10% conversion rate lift
- 2x average session duration on video pages

---

## 🔄 ITERATION STRATEGY

### Month 1: MVP Video Content
- 6-8 core videos
- Hero + Process focus
- Basic integration

### Month 2: Expansion
- Add testimonials
- Create feature videos
- Add subtitles/captions

### Month 3: Optimization
- A/B test video styles
- Analyze engagement
- Refine & refresh based on data

---

## ⚠️ IMPORTANT NOTES

### What Sora Is Great For
✅ Hero background videos
✅ Process explainers
✅ System visualizations
✅ Aspirational content
✅ B2B storytelling

### What Sora Is NOT Great For
❌ Testimonials with real faces (use real video)
❌ Detailed product demos (too chaotic)
❌ Complex multi-step processes
❌ Brand spokesperson content

### Quality Assurance
- Always review first generation
- May need 2-3 prompts to get right style
- Consider supplementing with real video for testimonials
- Test across browsers/devices

