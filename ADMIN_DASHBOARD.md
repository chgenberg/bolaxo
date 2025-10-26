# ADMIN DASHBOARD - BOLAGSPLATSEN

## 📊 OVERVIEW

The admin dashboard provides real-time monitoring and analytics for the Bolagsplatsen platform. It tracks visitor behavior, content activity, revenue, and platform health at a glance.

**URL**: `/admin` (admin-only)

---

## 🎯 KEY METRICS

### Top Stats Section (4-Card Layout)

#### 1. **Today's Visitors**
- **Shows**: Total visitors + unique visitors
- **Breakdown**: Percentage of unique sessions
- **Purpose**: Track daily traffic volume
- **Icon**: Eye (pink)

#### 2. **Real vs Bot Detection**
- **Shows**: Percentage of bot traffic vs real users
- **Breakdown**: 
  - Real count
  - Bot count
  - Percentage with progress bar
- **Purpose**: Identify and track bot activity
- **Icon**: Flag (orange)
- **Use Case**: Prevent fraud, understand genuine engagement

#### 3. **Revenue Today**
- **Shows**: Daily revenue in SEK
- **Growth**: Percentage change from previous day
- **Purpose**: Monitor monetization
- **Icon**: Shopping Cart (orange)

#### 4. **Active Content**
- **Shows**: 
  - Active listings count
  - NDA requests count
  - Messages count
- **Purpose**: Platform activity overview
- **Icon**: Activity (pink)

---

## 📈 SECONDARY METRICS

### Session & Conversion (3-Card Layout)

1. **Average Session Duration**
   - Format: Minutes and seconds (e.g., "4m 32s")
   - Purpose: Engagement indicator
   - Target: >3 minutes ideal

2. **Bounce Rate**
   - Format: Percentage (e.g., "35.2%")
   - Purpose: Page quality indicator
   - Target: <40% is good

3. **Conversion Rate**
   - Format: Percentage (e.g., "2.34%")
   - Purpose: Revenue/signup indicator
   - Target: >1.5% is strong for B2B

---

## 🔍 ANALYTICS SECTIONS

### Top Searches
- **Shows**: Most common search queries from users
- **Ranking**: Sorted by frequency
- **Visualization**: Horizontal progress bars
- **Purpose**: Understand what buyers/sellers look for
- **Example Results**:
  - "it-konsult stockholm" - 342 searches
  - "e-handel företag" - 287 searches
  - "saas startup" - 215 searches

**Use Cases**:
- SEO optimization
- Featured listings strategy
- Content planning
- Category improvements

### Top Pages
- **Shows**: Most visited pages on platform
- **Ranking**: Sorted by view count
- **Purpose**: Understand user journey
- **Example Results**:
  - `/sok` - 1,240 views
  - `/objekt/[id]` - 982 views
  - `/` (homepage) - 845 views

**Use Cases**:
- UX optimization
- Performance focus
- Content prioritization
- Feature investment decisions

### Device Breakdown
- **Shows**: Traffic split across devices
- **Categories**: Mobile, Desktop, Tablet
- **Visualization**: Horizontal progress bars with percentages
- **Purpose**: Mobile-first optimization validation
- **Example**: 55% Mobile, 40% Desktop, 5% Tablet

### Traffic Sources
- **Shows**: How visitors arrive at platform
- **Sources**: Organic, Direct, Social, Referral, Email
- **Visualization**: Ranked with percentages
- **Purpose**: Marketing channel performance
- **Example**:
  - Organic Search - 35%
  - Direct - 30%
  - Social Media - 18%
  - Referral - 12%
  - Email - 5%

---

## 🔄 REAL-TIME ACTIVITY FEED

### Recent Activities
- **Shows**: Last 5 significant platform events
- **Event Types**:
  - 🔴 **Listing** (pink dot): New listing created or updated
  - 🟠 **NDA** (orange dot): NDA approved/rejected
  - 🔵 **Message** (navy dot): New messages
  - 🟢 **Payment** (green dot): Payment processed

- **Format per Event**:
  - Description: "Ny annons skapad: E-handel med 2M revenue"
  - Timestamp: "Oct 26, 2025, 3:45:30 PM"
  - Type badge: "LISTING"

- **Purpose**: Spot issues, celebrate wins, understand platform activity

---

## ⚙️ CONTROLS

### Auto-Refresh Toggle
- **Default**: ON (refreshes every 10 seconds)
- **Purpose**: Keep dashboard current in real-time
- **Button State**:
  - ON: Pink background, white text
  - OFF: Gray background

### Export Report
- **Button**: Download icon + "Export Report"
- **Format**: PDF/CSV (future implementation)
- **Purpose**: Share metrics with stakeholders
- **Status**: Currently placeholder (button ready for implementation)

### Last Updated Display
- **Shows**: Exact time of last data fetch
- **Format**: "Last updated: 3:45:32 PM"
- **Updates**: Every 10 seconds (when auto-refresh ON)

---

## 🔐 ACCESS CONTROL

### Admin-Only
- Only users with `role === 'admin'` can access
- Non-admin users redirected to homepage
- Unauthorized access shows error

### Future: Role-Based Restrictions
```typescript
// To add department-specific views:
- owner: Full access to all metrics
- analyst: Read-only analytics
- moderator: Content activity only
```

---

## 📱 RESPONSIVE DESIGN

### Desktop (1024px+)
- 4-column top stats grid
- 3-column secondary metrics
- 2-column analytics sections
- Full-width activity feed

### Tablet (768px - 1023px)
- 2-column top stats grid
- 1-column secondary metrics
- 1-column analytics sections (stacked)
- Full-width activity feed

### Mobile (< 768px)
- 1-column everything
- Vertical stacking
- Touch-friendly buttons
- Scrollable activity feed

---

## 🔌 DATA SOURCE (Currently Mock)

### Production Setup (TODO):
```typescript
// Replace mock data generator with:
1. Analytics API → Posthog/Mixpanel SDK
2. Bot Detection → Fingerprinting library
3. Revenue → Stripe API queries
4. Content Activity → Database queries
5. Real-time Updates → WebSocket or Server-Sent Events
```

### Current API Endpoint:
```
GET /api/admin/dashboard-stats
```

Response structure:
```typescript
{
  totalVisitors: number
  uniqueVisitors: number
  realVsBot: { real: number, bot: number }
  avgSessionDuration: number (seconds)
  bounceRate: number (percentage)
  topSearches: Array<{ query: string, count: number }>
  topPages: Array<{ path: string, views: number }>
  revenueToday: number (SEK)
  activeListings: number
  ndaRequests: number
  messages: number
  conversionRate: number (percentage)
  deviceBreakdown: { mobile: number, desktop: number, tablet: number }
  trafficSources: Array<{ source: string, count: number }>
  recentActivities: Array<Activity>
}
```

---

## 🚀 FUTURE ENHANCEMENTS

### Phase 1: Data Integration
- [ ] Connect to Posthog for analytics
- [ ] Integrate Stripe for revenue
- [ ] Real database queries for content
- [ ] Bot detection algorithm

### Phase 2: Advanced Features
- [ ] Date range filtering
- [ ] Export to PDF/CSV
- [ ] Email report delivery
- [ ] Scheduled snapshots
- [ ] Alerts & thresholds

### Phase 3: Insights
- [ ] Trend analysis (7-day, 30-day)
- [ ] Anomaly detection
- [ ] Predictive metrics
- [ ] Cohort analysis
- [ ] Funnel visualization

### Phase 4: Multi-User
- [ ] Role-based views
- [ ] Department dashboards
- [ ] Custom metrics
- [ ] Dashboard sharing
- [ ] User audit trail

---

## 🧪 TESTING THE DASHBOARD

### Access:
1. Create an admin account (manually set `role = 'admin'` in DB)
2. Login at `/login`
3. Navigate to `/admin`

### Features to Test:
- [ ] Auto-refresh every 10 seconds
- [ ] Toggle auto-refresh ON/OFF
- [ ] Last updated timestamp updates
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] Progress bars show correct percentages
- [ ] Activity feed displays recent events
- [ ] Bounce on page if not admin

### Metrics to Monitor:
- Real vs Bot ratio should be ~70% real / 30% bot (or adjust as needed)
- Conversion rate should be 1-3%
- Mobile should be 50-60% of traffic
- Bounce rate should be 25-40%

---

## 📞 SUPPORT & TROUBLESHOOTING

### Common Issues:

**"Unauthorized Access" Error**
- Ensure you have `role = 'admin'` set in database
- Check authentication headers being sent
- Verify session is still active

**Data Not Updating**
- Check if auto-refresh is ON
- Click manual refresh button
- Check browser console for API errors
- Verify `/api/admin/dashboard-stats` endpoint

**Metrics Seem Wrong**
- Mock data generates random values
- For production, connect to real data sources
- Check bot detection algorithm accuracy

---

## 💡 USAGE TIPS

1. **Morning Check**: Review yesterday's revenue, traffic sources, and top searches
2. **During Day**: Monitor real-time activity and bounce rate trends
3. **Weekly**: Analyze top pages and search queries for optimization opportunities
4. **Monthly**: Export report for stakeholder updates

---

## 🔗 RELATED PAGES

- Dashboard Overview: `/dashboard`
- Seller Analytics: `/dashboard/analytics`
- System Admin: `/admin` (you are here)

