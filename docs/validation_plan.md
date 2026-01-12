# Validation Plan: Measuring Mental Load Reduction

## Core Hypothesis

**Clarity reduces mental load by decreasing the number of micro-decisions users must make about digital interruptions.**

Success means users feel:
1. Less cognitively overwhelmed
2. More in control of their attention
3. Confident they're not missing important items

---

## Primary Success Metrics

### 1. **Decision Count Reduction**

**What we measure:**
- Number of "should I check this?" micro-decisions per day
- Baseline: ~200 notifications/day = ~200 decisions
- Target: <20 decisions/day (1 digest review + urgent alerts)

**How we measure:**
```javascript
// Track every user interaction
metrics = {
  notificationsReceived: 200,
  urgentDelivered: 8,      // User had to evaluate
  digestReviews: 3,         // User had to evaluate batches
  totalDecisions: 11,       // 45% reduction
  reductionRate: 0.45
}
```

**Success criteria:** 70%+ reduction in decision count

---

### 2. **Interruption Frequency**

**What we measure:**
- Number of times user's attention is pulled from primary task
- Baseline: 1 interruption every 4 minutes (UC Irvine)
- Target: 1 interruption every 30 minutes

**How we measure:**
- Desktop app tracks foreground application switches
- Mobile app uses screen-on events
- Compare "before Clarity" vs. "with Clarity" over 2 weeks

**Success criteria:** 80%+ reduction in interruption frequency

---

### 3. **False Negative Rate (Missed Urgents)**

**What we measure:**
- Urgent items incorrectly sent to digest
- User manually promotes from digest to urgent

**How we measure:**
```javascript
falseNegativeRate = (userOverrides / totalNotifications) * 100
// Target: <5%
```

**Success criteria:** <5% of notifications misclassified

---

### 4. **User Confidence Score**

**What we measure:**
- Self-reported trust that no urgent items are being hidden
- Measured via daily micro-survey (1 question)

**Survey question:**
"Today, did you feel anxious about missing important messages?"
- ✅ No, felt confident
- ⚠️ Slightly anxious
- ❌ Very anxious

**Success criteria:** 80%+ "No, felt confident" responses

---

## Secondary Success Metrics

### 5. **Focus Duration**

**What we measure:**
- Average uninterrupted work block length
- Baseline: 11 minutes (Microsoft research)
- Target: 45+ minutes

**How we measure:**
- Calendar blocking + keyboard/mouse activity
- Time between notification checks

---

### 6. **Cognitive Load Score (NASA-TLX)**

**What we measure:**
- Standardized workload assessment
- 6 dimensions: mental demand, physical demand, temporal demand, performance, effort, frustration

**How we measure:**
- NASA-TLX survey weekly
- Compare pre- vs. post-Clarity scores

**Success criteria:** 30%+ reduction in overall cognitive load score

---

### 7. **Engagement with Digests**

**What we measure:**
- Digest open rate
- Time to review digest (should be <3 min)
- Actions taken (review later, auto-handle, manual)

**Success criteria:**
- 85%+ open rate
- Avg review time <3 min
- 70%+ items batch-actioned (not individually reviewed)

---

## Study Design

### Phase 1: Baseline Measurement (Week 1-2)

**Participants:** 50 knowledge workers (PMs, engineers, designers)

**Data collection:**
1. Install passive tracking extension (logs notification count, not content)
2. Daily micro-survey on interruption perception
3. Pre-study NASA-TLX assessment

**Output:** Baseline metrics for each user

---

### Phase 2: Intervention (Week 3-6)

**Treatment:**
- Install Clarity for all participants
- Initial 3-day learning period (Clarity observes, doesn't filter)
- Day 4 onwards: Full filtering active

**Data collection:**
1. Same passive tracking (now with Clarity's classification data)
2. Daily micro-survey continues
3. Weekly "trust check" question
4. Log all user overrides (manual urgency promotions)

**Output:** Treatment-period metrics

---

### Phase 3: Comparison & Feedback (Week 7)

**Analysis:**
- Compare baseline vs. treatment on all metrics
- User interviews (qualitative feedback)
- A/B test variant (50% aggressive filtering vs. 50% conservative)

**Output:** Efficacy report + refinement roadmap

---

## A/B Testing Matrix

| Variant | Urgency Threshold | Digest Frequency | Auto-Actions |
|---------|-------------------|------------------|--------------|
| **Control** | 0.6 (moderate) | 3x/day | Disabled |
| **Aggressive** | 0.8 (high) | 2x/day | Enabled |
| **Conservative** | 0.4 (low) | 4x/day | Disabled |

**Hypothesis:** Aggressive variant shows highest mental load reduction but may have higher false negative rate.

---

## Qualitative Validation

### User Interviews (n=10)

**Questions:**
1. "Describe a moment when Clarity helped you stay focused."
2. "Was there a time when Clarity made a wrong call? What happened?"
3. "How do you feel about not seeing every notification immediately?"
4. "Would you continue using Clarity after the study?"

**Analysis:** Thematic coding for trust, control, anxiety, value perception

---

### Diary Study

**Method:**
- 5 users keep a daily log for 2 weeks
- Photo diary: Screenshot moments of "relief" or "frustration"

**Output:** Real-world usage patterns, edge cases

---

## Technical Validation

### Classification Accuracy

**Gold standard dataset:**
- 1,000 notifications manually labeled by users (urgent/not urgent)
- Test Clarity's classifier against labels
- Calculate precision, recall, F1 score

**Target:** >90% accuracy

---

### Performance Benchmarks

| Metric | Target | Measurement |
|--------|--------|-------------|
| Classification latency | <100ms | Chrome DevTools |
| Memory footprint | <50MB | Browser Task Manager |
| Battery impact (mobile) | <5% daily | Android Battery API |
| UI responsiveness | 60fps | Lighthouse Performance |

---

## Risk Mitigation

### Risk 1: Users Disable Filtering

**Signal:** High override rate (>20%)

**Mitigation:**
- Interview high-override users
- Adjust classification model
- Offer "training mode" – user labels 20 notifications to calibrate

---

### Risk 2: Over-Filtering Critical Items

**Signal:** Missed urgent items causing real problems (e.g., missed deadline)

**Mitigation:**
- "Safety net" rule: If user opens digest within 1 min of delivery, auto-promote top 3 items
- Weekly "Did I miss anything important?" survey

---

### Risk 3: Low Adoption/Engagement

**Signal:** Users stop opening digests (<50% open rate)

**Mitigation:**
- Gamification: "You saved 3.2 hours of focus time this week"
- Personalization: Let users set custom digest times
- Push notification for digest (ironic, but necessary for habit-forming)

---

## Success Definition

**Clarity is successful if:**

✅ **Quantitative:**
- 70%+ reduction in daily decisions
- 80%+ reduction in interruption frequency
- <5% false negative rate
- 80%+ user confidence score

✅ **Qualitative:**
- 8/10 users say they "feel less overwhelmed"
- 7/10 users would recommend to colleagues
- 9/10 users plan to continue using post-study

---

## Timeline

| Week | Activity |
|------|----------|
| 1-2 | Baseline data collection |
| 3 | Clarity onboarding + learning period |
| 4-6 | Full deployment, continuous tracking |
| 7 | Analysis + user interviews |
| 8 | Report findings, iterate on model |

---

## Reporting Format

**Dashboard for stakeholders:**
- Decision reduction chart (before/after)
- Interruption heatmap (time of day)
- User confidence trend
- Sample quotes from interviews

**Academic paper (optional):**
- Full methodology
- Statistical analysis (paired t-test on NASA-TLX scores)
- Discussion of limitations
- Future work section
