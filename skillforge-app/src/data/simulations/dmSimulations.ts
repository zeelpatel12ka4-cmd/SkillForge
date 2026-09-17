/**
 * SkillForge AI — Digital Marketing (DM) Simulation Packages
 * Tracks: Fresher, Junior, Senior
 */

import { SimulationDefinition } from "@/types/simulation";

export const DM_FRESHER_SIMULATION: SimulationDefinition = {
  id: "SIM-DM-FRE-001",
  version: "1.0.0",
  careerCode: "DM",
  level: "fresher",
  title: "Meta Ads Audience Targeting & High-Converting Creative Copy Strategy",
  status: "active",
  roleContext: {
    roleTitle: "Associate Performance Marketing Specialist",
    team: "Paid Social & Acquisition",
    companyContext: "D2C Ergonomic Home Office brand launching an adjustable smart standing desk.",
    reportingTo: "Performance Marketing Manager",
  },
  scenario:
    "The D2C smart standing desk product launch campaign is suffering from high Customer Acquisition Costs (CAC = ₹4,200 vs target of ₹2,800) and declining click-through rates (CTR < 0.9%). The existing ad set targets an overly broad demographic ('All adults 25-55 interested in Furniture') with generic product feature text ('Buy our desk with 4 memory presets'). You must restructure the audience targeting into segmented cold, warm, and lookalike buckets, write 3 distinct high-converting ad copy angle variants (Pain-Point/Agitation, Social Proof/Case Study, and Direct Value Offer), define visual creative specifications, and calculate target ROAS and break-even metrics.",
  businessContext:
    "With ₹1,500,000 in inventory ready in regional fulfillment centers, unprofitable ad spend is draining cash reserves. Restoring ROAS above 2.8x is mandatory for campaign continuation.",
  objective:
    "Build a 3-tier audience segmentation structure, author 3 psychological ad copy angles with hooks and CTAs, define creative asset specs, and calculate return on ad spend (ROAS).",
  estimatedMinutes: 45,
  difficulty: "Beginner",
  prerequisites: ["Meta Ads Manager concepts (Custom Audiences, Lookalikes, Broad)", "Direct-response copywriting frameworks (AIDA, PAS)", "E-commerce metrics (CAC, AOV, ROAS, CTR)"],
  learningOutcomes: [
    "Structuring tiered paid social acquisition funnels (Cold, Warm, Hot)",
    "Crafting direct-response copywriting angles targeting specific emotional triggers",
    "Calculating unit economics: ROAS, break-even CAC, and target conversion rates",
    "Specifying visual creative briefs for design and video production teams",
  ],
  skills: ["Meta Ads", "Audience Segmentation", "Direct-Response Copywriting", "ROAS Modeling", "Campaign Strategy"],
  materials: [
    {
      id: "mat-dm-fre-1",
      title: "Current Meta Ads Campaign Performance Telemetry",
      type: "dataset",
      description: "Metrics from the underperforming broad targeting campaign.",
      filename: "meta_ads_performance_raw.csv",
      relevance: "Used in Task 1 and Task 2 to diagnose low CTR and calculate required ROAS improvements.",
      content: `campaign_name,spend_inr,impressions,clicks,ctr_percent,purchases,revenue_inr,roas
Broad_Furniture_Launch,450000,520000,4160,0.80%,107,1070000,2.37x
Desk_Average_Order_Value = ₹10,000
Product_Cost_of_Goods (COGS) = ₹4,500
Gross_Margin_per_Desk = ₹5,500 (55% gross margin)`,
    },
    {
      id: "mat-dm-fre-2",
      title: "Customer Persona & Pain-Point Research",
      type: "docs",
      description: "Customer survey findings on remote software engineers and designers.",
      filename: "desk_customer_painpoints.md",
      relevance: "Used in Task 2 to write resonant ad copy angles.",
      content: `## Customer Profile Insights
1. Primary Persona: Remote Software Engineers & Tech Professionals sitting 10+ hours/day suffering from lower back pain and 3 PM energy crashes.
2. Emotional Triggers: Frustration with posture, brain fog, guilt over sedentary lifestyle, aesthetic pride in clean desk setups ('Desk Setup' YouTube/Reddit aesthetics).
3. Objections: Desk wobble at standing height, difficult assembly, motor reliability.`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Audience Segmentation Matrix & ROAS Math",
      type: "implementation",
      dimension: "Funnel Economics & CAC Efficiency",
      objective: "Restructure targeting into 3 distinct audience cohorts and calculate break-even ROAS.",
      context: "Analyze meta_ads_performance_raw.csv and customer research in Materials.",
      prompt:
        "Define the revised audience targeting strategy:\n1. Structure 3 distinct audience ad sets:\n   - Top-of-Funnel (Cold): Interest and behavior intersections (e.g. Remote Work, Ergonomics, Mechanical Keyboards).\n   - Middle-of-Funnel (Warm): Engaged Instagram/Facebook followers (last 90 days) + Video viewers (50%+).\n   - Lookalike (1-2%): Seeded from 180-day high-value purchasers (AOV > ₹10,000).\n2. Calculate the Break-Even ROAS: With AOV = ₹10,000 and Gross Margin = 55% (COGS = ₹4,500), what is the maximum allowable CAC and the break-even ROAS?",
      constraints: ["Show exact break-even CAC and ROAS calculations."],
      expectedOutput: "Audience segmentation matrix and break-even ROAS mathematical calculation.",
      acceptanceCriteria: [
        "Defines clear Cold, Warm, and Lookalike audience targeting buckets",
        "Calculates break-even CAC correctly: ₹5,500 (equal to gross profit per unit)",
        "Calculates break-even ROAS correctly: 10,000 / 5,500 = 1.82x",
      ],
      skills: ["Audience Targeting", "Meta Lookalikes", "ROAS Math", "Unit Economics"],
      evidenceRequired: ["Audience segmentation table", "Break-even CAC and ROAS math"],
      validationRules: [
        { id: "dm-fre-t1-rule1", description: "Break-even ROAS calculation", type: "numerical", expectedSnippet: "1.82" },
        { id: "dm-fre-t1-rule2", description: "Lookalike audience definition", type: "document_structure", expectedSnippet: "Lookalike" },
      ],
      rubricWeight: 35,
      hints: ["Break-even ROAS = 1 / Gross Margin %. When Gross Margin is 55%, Break-even ROAS = 1 / 0.55 = 1.818x."],
      timeEstimateMins: 15,
    },
    {
      id: 2,
      title: "3 Direct-Response Ad Copy Angles (PAS, Social Proof, Offer)",
      type: "implementation",
      dimension: "Content Strategy & Copywriting",
      objective: "Author 3 distinct direct-response ad variants with compelling hooks, body copy, and CTAs.",
      context: "Incorporate customer pain-point research into persuasive advertising copy.",
      prompt:
        "Write 3 complete Meta ad copy variants for the smart standing desk:\nVariant A (Problem-Agitation-Solve): Focus on chronic back pain and 3 PM posture fatigue for remote workers.\nVariant B (Social Proof / Case Study): Feature an architect/engineer story overcoming desk wobble and boosting productivity.\nVariant C (Direct Offer / Scarcity): Emphasize a limited launch bundle (Free cable management tray + 10-year motor warranty).\nFor EACH variant, provide:\n- Primary Text (with thumb-stopping hook line)\n- Headline (under 40 characters for mobile display)\n- Description & CTA Button.",
      constraints: ["Must include complete text, headline, and CTA for all 3 variants."],
      expectedOutput: "3 fully written direct-response ad copy templates ready for Meta Ads Manager.",
      acceptanceCriteria: [
        "All 3 variants feature distinct psychological angles (PAS, Social Proof, Scarcity)",
        "Primary text includes strong curiosity-driven or pain-focused hooks",
        "Headlines adhere to Meta character constraints (< 40 chars)",
      ],
      skills: ["Direct-Response Copywriting", "Hook Generation", "Creative Strategy"],
      evidenceRequired: ["3 complete ad copy variants with headlines and CTAs"],
      validationRules: [
        { id: "dm-fre-t2-rule1", description: "Variant A PAS angle", type: "document_structure", expectedSnippet: "Variant A" },
        { id: "dm-fre-t2-rule2", description: "Variant B Social proof", type: "document_structure", expectedSnippet: "Variant B" },
      ],
      rubricWeight: 40,
      hints: ["The first 125 characters of Meta Primary Text appear before the 'See More' fold—make your hook irresistible!"],
      timeEstimateMins: 20,
    },
    {
      id: 3,
      title: "Creative Asset Brief & A/B Testing Protocol",
      type: "communication",
      dimension: "Campaign Strategy & Targeting",
      objective: "Specify visual asset requirements and design a rapid A/B testing flight plan.",
      context: "Deliver instructions for the creative design team and media buyer.",
      prompt:
        "Deliver the Creative & Testing Playbook:\n1. Visual Asset Specs: Outline 2 creative concepts (e.g. 15-second UGC reel showing dual-monitor wobble test vs 4-panel aesthetic carousel).\n2. A/B Testing Flight Plan: How will you test the 3 copy angles against the 2 visual formats with an initial budget of ₹15,000/day over 7 days?\n3. Optimization Rules: Define exact metrics for killing losing ad sets (e.g. Spend > 2x Target CPA with 0 conversions; CTR < 1.2%).",
      constraints: ["Include explicit budget allocation and kill rules for underperforming ads."],
      expectedOutput: "A structured creative brief and media testing protocol.",
      acceptanceCriteria: [
        "Details creative asset requirements (format, aspect ratio, audio/captions)",
        "Formulates a disciplined A/B testing budget split",
        "Defines objective data-driven kill rules for poor performing creatives",
      ],
      skills: ["Creative Direction", "Media Buying", "A/B Testing Methodology"],
      evidenceRequired: ["Creative asset specifications", "A/B test plan", "Kill/scale rules"],
      validationRules: [
        { id: "dm-fre-t3-rule1", description: "Creative format specification", type: "document_structure", expectedSnippet: "UGC" },
        { id: "dm-fre-t3-rule2", description: "Kill rule definition", type: "document_structure", expectedSnippet: "kill" },
      ],
      rubricWeight: 25,
      hints: ["In dynamic creative testing (DCT), test 3 copy variants * 2 video concepts in a single ad set to let Meta's machine learning find the winning combination."],
      timeEstimateMins: 10,
    },
  ],
  deliverable: {
    type: "Growth Strategy Deck (PDF / Slide Link) + Ad Copy Sheet",
    description: "Submit complete Growth Strategy Deck link and ad copy matrix sheet.",
    fields: [
      { name: "growthDeckUrl", label: "Strategy Deck / Sheet URL", type: "url", placeholder: "https://docs.google.com/spreadsheets/d/...", required: true, helpText: "Link to your ad copy matrix, audience targeting sheet, and ROAS model." },
      { name: "notes", label: "Campaign Strategy & Ad Copy Matrix", type: "text", placeholder: "Paste your 3 ad copy variants, audience segmentation rules, and break-even calculations...", required: true, helpText: "Include your break-even ROAS, audience targeting buckets, and testing protocol." },
    ],
    validationRules: [
      { id: "deliv-dm-fre-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "content_creative", name: "Direct-Response Copywriting & Messaging", weight: 40, description: "Persuasiveness, hook strength, and psychological diversity across the 3 copy angles.", criteria: ["Compelling first-line hooks", "Emotional resonance with remote workers", "Crisp, benefit-driven headlines"] },
    { id: "funnel_economics", name: "Audience Segmentation & Unit Economics", weight: 35, description: "Precision of break-even CAC/ROAS calculations and strategic depth of audience cohorts.", criteria: ["Accurate break-even math", "Clean Top/Middle/Bottom funnel segmentation", "Sound lookalike seed strategy"] },
    { id: "campaign_strategy", name: "Creative Strategy & A/B Testing Discipline", weight: 25, description: "Clarity of creative briefs and rigor of data-driven media buying testing and kill rules.", criteria: ["Actionable creative asset specs", "Disciplined testing budget split", "Objective kill/scale rules"] },
  ],
  hints: ["Ensure that you account for shipping costs and product returns when modeling break-even metrics."],
  progression: {
    onSuccess: {
      recommendedTrack: "DM",
      recommendedLevel: "junior",
      rationale: "Strong paid social copywriting and economic acumen. Advance to Junior: Technical SEO Crawl Audit & Search Intent Keyword Clustering.",
    },
    onRemediation: {
      recommendedTrack: "DM",
      recommendedLevel: "fresher",
      targetSkill: "Direct-Response Copywriting",
      rationale: "Practice crafting hook variations and calculating break-even ROAS before attempting technical search engine indexing.",
    },
  },
};

export const DM_JUNIOR_SIMULATION: SimulationDefinition = {
  id: "SIM-DM-JUN-001",
  version: "1.0.0",
  careerCode: "DM",
  level: "junior",
  title: "Search Intent Keyword Clustering & Technical SEO Indexation Audit",
  status: "active",
  roleContext: {
    roleTitle: "SEO & Organic Growth Lead",
    team: "Content Marketing & Technical SEO",
    companyContext: "B2B SaaS HR & Payroll platform with 250,000 monthly organic search visitors.",
    reportingTo: "VP of Growth Marketing",
  },
  scenario:
    "Following a major website redesign and CMS migration, organic search traffic dropped precipitously by 38% over 6 weeks. Google Search Console (GSC) telemetry reveals thousands of indexation errors: critical landing pages returning HTTP 404s due to missing 301 redirects, canonical tag mismatches pointing to staging environments, and Core Web Vitals (Largest Contentful Paint LCP > 4.8s) failing Google's Page Experience threshold. Furthermore, blog content is suffering from severe keyword cannibalization across 12 overlapping articles targeting 'payroll software'. You must audit the GSC crawl error dump, build a high-intent keyword cluster matrix mapping commercial keywords to dedicated landing pages, resolve the technical indexation bugs, and formulate a 60-day organic traffic recovery roadmap.",
  businessContext:
    "The 38% drop in organic search traffic resulted in a shortfall of 450 inbound sales demo requests this month, directly threatening Q4 revenue targets.",
  objective:
    "Audit technical crawl logs, resolve canonical and 404 redirect chains, cluster search intent keywords without cannibalization, and establish a technical SEO recovery strategy.",
  estimatedMinutes: 60,
  difficulty: "Intermediate",
  prerequisites: ["Google Search Console / Screaming Frog SEO audits", "Technical SEO (301 redirects, canonical tags, XML sitemaps)", "Core Web Vitals (LCP, INP, CLS)", "Keyword intent clustering (Informational vs Commercial)"],
  learningOutcomes: [
    "Auditing and resolving critical crawl, indexation, and redirect errors",
    "Grouping high-volume search queries into semantic keyword clusters",
    "Resolving keyword cannibalization and optimizing on-page search intent",
    "Remediating Core Web Vitals to pass Google Page Experience benchmarks",
  ],
  skills: ["Technical SEO", "Keyword Clustering", "Core Web Vitals", "Search Console Auditing", "Information Architecture"],
  materials: [
    {
      id: "mat-dm-jun-1",
      title: "Google Search Console Crawl & Indexation Error Dump (CSV)",
      type: "dataset",
      description: "Extracted sample of 404 errors, canonical mismatches, and crawl anomalies.",
      filename: "gsc_crawl_errors_sample.csv",
      relevance: "Used in Task 1 to diagnose the post-migration traffic collapse.",
      content: `url,http_status,discovered_canonical,core_web_vitals_lcp,impressions_prior_migration,impressions_post_migration
/features/payroll-software,404,None,N/A,84000,0
/payroll-pricing,200,https://staging.skillforge-hr.internal/payroll-pricing,5.2s,42000,1200
/blog/what-is-payroll,200,https://skillforge-hr.com/blog/what-is-payroll,1.8s,18000,16500
/solutions/payroll-for-small-business,302,https://skillforge-hr.com/features,4.9s,56000,3400
/resources/compliance-guide-2026,200,https://skillforge-hr.com/resources/compliance-guide-2026,2.1s,24000,23000`,
    },
    {
      id: "mat-dm-jun-2",
      title: "Target Keyword Search Volume & Intent List (CSV)",
      type: "dataset",
      description: "Target queries with monthly search volume and current ranking positions.",
      filename: "keyword_volume_intent.csv",
      relevance: "Used in Task 2 to construct the semantic keyword cluster.",
      content: `keyword,monthly_volume,search_intent,current_rank,current_ranking_url
payroll software for small business,14800,Commercial,28,/blog/what-is-payroll
best payroll platforms 2026,9200,Commercial,34,/blog/top-10-payroll-tools
how to calculate payroll taxes,18500,Informational,4,/blog/payroll-tax-calculation-guide
online payroll system,12100,Transactional,42,/blog/what-is-payroll
automated payroll direct deposit,6400,Commercial,19,/features`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Technical Indexation Audit & 301 Redirect Mapping",
      type: "investigation",
      dimension: "Technical Optimization & Search Intent",
      objective: "Identify the 3 critical technical flaws that caused the 38% traffic drop.",
      context: "Examine gsc_crawl_errors_sample.csv in Materials.",
      prompt:
        "Analyze the crawl error dump:\n1. Why did `/features/payroll-software` drop from 84,000 impressions to zero? Detail the required HTTP status code fix (301 vs 302).\n2. Explain why `/payroll-pricing` lost 97% of impressions due to its canonical tag pointing to `staging.skillforge-hr.internal`.\n3. Identify the Core Web Vitals failure on `/payroll-pricing` (LCP = 5.2s) and recommend 2 technical engineering fixes to bring LCP under 2.5s.",
      constraints: ["Cite exact URLs, HTTP status codes, and canonical domain flaws."],
      expectedOutput: "A structured technical SEO audit report diagnosing the 3 root causes.",
      acceptanceCriteria: [
        "Identifies 404 error on high-traffic landing page and specifies 301 permanent redirect to live equivalent",
        "Explains that canonical pointing to staging de-indexed the production pricing page from Google SERPs",
        "Diagnoses LCP > 2.5s failure and prescribes image optimization (WebP/AVIF) and critical CSS inlining",
      ],
      skills: ["Technical SEO", "Redirects (301)", "Canonical Tags", "Core Web Vitals (LCP)"],
      evidenceRequired: ["Root cause analysis for 404 and canonical bugs", "LCP optimization recommendations"],
      validationRules: [
        { id: "dm-jun-t1-rule1", description: "301 permanent redirect fix", type: "code_static", expectedSnippet: "301" },
        { id: "dm-jun-t1-rule2", description: "Staging canonical issue", type: "code_static", expectedSnippet: "staging" },
      ],
      rubricWeight: 35,
      hints: ["A 302 redirect is temporary and does NOT pass PageRank authority; high-value page migrations must ALWAYS use 301 Permanent Redirects."],
      timeEstimateMins: 20,
    },
    {
      id: 2,
      title: "Semantic Keyword Clustering & Cannibalization Resolution",
      type: "implementation",
      dimension: "Technical Optimization & Search Intent",
      objective: "Cluster target keywords and resolve the cannibalization flaw on `/blog/what-is-payroll`.",
      context: "Analyze keyword_volume_intent.csv in Materials.",
      prompt:
        "Build a semantic keyword cluster matrix:\n1. Keyword Cannibalization Diagnosis: Why is ranking an informational article (`/blog/what-is-payroll`) for commercial/transactional terms ('payroll software for small business', 'online payroll system') causing low rank positions (Rank 28 and 42)?\n2. Re-architect the Cluster: Map the 5 target keywords across 2 distinct page types:\n   - Pillar Commercial Landing Page: URL, Target Keywords, Search Intent, On-Page Structure.\n   - Supporting Informational Blog Guide: URL, Target Keywords, Search Intent, Internal Linking Anchor Text.\n3. Draft an optimized Page Title (< 60 chars) and Meta Description (< 155 chars) for the Commercial Landing Page.",
      constraints: ["Include Page Title (< 60 chars) and Meta Description (< 155 chars)."],
      expectedOutput: "A keyword cluster matrix table and optimized metadata specifications.",
      acceptanceCriteria: [
        "Articulates search intent mismatch and keyword cannibalization clearly",
        "Separates Informational vs Commercial search intent into appropriate page architectures",
        "Provides click-enticing Title tag (< 60 chars) and Meta Description (< 155 chars) with keywords included",
      ],
      skills: ["Keyword Clustering", "Search Intent Matching", "On-Page SEO", "Metadata Optimization"],
      evidenceRequired: ["Keyword cluster matrix table", "Optimized Title and Meta Description"],
      validationRules: [
        { id: "dm-jun-t2-rule1", description: "Keyword cannibalization diagnosis", type: "document_structure", expectedSnippet: "cannibalization" },
        { id: "dm-jun-t2-rule2", description: "Search intent distinction", type: "document_structure", expectedSnippet: "Commercial" },
      ],
      rubricWeight: 40,
      hints: ["Google ranks pages that match the user's immediate search intent; buyers searching 'payroll software for small business' want product features and pricing, not a dictionary definition."],
      timeEstimateMins: 24,
    },
    {
      id: 3,
      title: "60-Day Organic Traffic Recovery Roadmap",
      type: "communication",
      dimension: "Campaign Strategy & Targeting",
      objective: "Formulate a phased recovery roadmap for the VP of Growth and engineering team.",
      context: "Present an actionable 60-day recovery plan to reverse the traffic loss.",
      prompt:
        "Draft the 60-Day SEO Recovery Roadmap:\n1. Sprint 1 (Days 1-14 - Critical Fixes): Redirect audit, staging canonical purge, GSC sitemap re-submission.\n2. Sprint 2 (Days 15-35 - Content & Architecture): Pillar page launch, internal link graph overhaul, Core Web Vitals remediation.\n3. Sprint 3 (Days 36-60 - Link Building & Authority): Digital PR campaign and backlink recovery for broken 404 URLs.\n4. Forecasting: Project expected monthly demo request recovery timeline.",
      constraints: ["Organize across 3 clear sprints with ownership."],
      expectedOutput: "A structured 60-day sprint roadmap with milestone dates and forecast.",
      acceptanceCriteria: [
        "Prioritizes high-impact technical bug fixes in Sprint 1",
        "Integrates on-page clustering and Core Web Vitals in Sprint 2",
        "Includes link reclamation and realistic organic traffic recovery projection",
      ],
      skills: ["SEO Roadmapping", "Growth Strategy", "Cross-Functional Project Management"],
      evidenceRequired: ["60-Day sprint roadmap", "Traffic recovery timeline"],
      validationRules: [
        { id: "dm-jun-t3-rule1", description: "Sprint roadmap structure", type: "document_structure", requiredSections: ["Sprint 1", "Sprint 2", "Sprint 3"], minWordCount: 45 },
      ],
      rubricWeight: 25,
      hints: ["Reclaiming backlinks pointing to old 404 URLs by applying 301 redirects immediately restores valuable PageRank equity."],
      timeEstimateMins: 16,
    },
  ],
  deliverable: {
    type: "Growth Strategy Deck (PDF / Slide Link) + Ad Copy Sheet",
    description: "Submit Technical SEO Audit Report and Keyword Clustering Matrix link.",
    fields: [
      { name: "growthDeckUrl", label: "SEO Audit Deck / Sheet URL", type: "url", placeholder: "https://docs.google.com/spreadsheets/d/...", required: true, helpText: "Link to your 301 redirect map, keyword cluster workbook, and recovery roadmap." },
      { name: "notes", label: "Technical Audit Findings & Metadata Specs", type: "text", placeholder: "Paste your technical root cause findings, keyword cluster matrix, and 60-day sprint roadmap...", required: true, helpText: "Include your canonical fix verification, Core Web Vitals plan, and optimized title tags." },
    ],
    validationRules: [
      { id: "deliv-dm-jun-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "technical_seo", name: "Technical SEO & Indexation Audit", weight: 40, description: "Accuracy of 404 redirect mapping, canonical audit, and Core Web Vitals diagnostic recommendations.", criteria: ["Correct 301 redirect mandate", "Identification of staging canonical bug", "Actionable LCP performance fixes"] },
    { id: "campaign_strategy", name: "Keyword Clustering & Search Intent Architecture", weight: 35, description: "Rigor of separating Commercial vs Informational search intent and resolving keyword cannibalization.", criteria: ["Clear intent-based clustering", "Elimination of keyword cannibalization", "Compelling, compliant Title and Meta tags"] },
    { id: "data_measurement", name: "Roadmapping & Organic Forecasting", weight: 25, description: "Feasibility and prioritization of the 60-day recovery sprints and executive reporting clarity.", criteria: ["Well-prioritized 3-sprint plan", "Realistic traffic recovery projections"] },
  ],
  hints: ["Ensure that the Title tag contains the primary keyword near the beginning for maximum search weighting."],
  progression: {
    onSuccess: {
      recommendedTrack: "DM",
      recommendedLevel: "senior",
      rationale: "Candidate demonstrated excellent technical SEO and search intent mastery. Advance to Senior: ₹5,000,000 Omnichannel Budget Reallocation & CAC Optimization.",
    },
    onRemediation: {
      recommendedTrack: "DM",
      recommendedLevel: "junior",
      targetSkill: "Technical SEO & Canonical Tags",
      rationale: "Review HTTP redirect status codes and canonical tag behavior before managing multi-million rupee growth allocations.",
    },
  },
};

export const DM_SENIOR_SIMULATION: SimulationDefinition = {
  id: "SIM-DM-SEN-001",
  version: "1.0.0",
  careerCode: "DM",
  level: "senior",
  title: "₹5,000,000 Omnichannel Marketing Budget Reallocation & CAC Optimization",
  status: "active",
  roleContext: {
    roleTitle: "Vice President of Growth / Head of Performance Marketing",
    team: "Omnichannel Acquisition & Growth Strategy",
    companyContext: "Fintech Consumer Super-App managing ₹5,000,000 monthly marketing budget across 5 channels.",
    reportingTo: "Chief Marketing Officer (CMO) & Chief Financial Officer (CFO)",
  },
  scenario:
    "Blended Customer Acquisition Cost (CAC) has inflated by 42% over the last two quarters (rising from ₹1,200 to ₹1,704 per funded account), squeezing contribution margins. Telemetry reveals that Paid Search (Google Ads) has hit severe diminishing marginal returns due to aggressive competitor bidding, while Meta Ads creative fatigue has increased CPMs by 28%. In contrast, high-leverage organic creator partnerships and lifecycle referral loops are operating with exceptional LTV:CAC ratios (> 4.5x) but receive only 10% of monthly capital. You must analyze the diminishing returns curves across all 5 channels, build an optimization model reallocating the ₹5,000,000 monthly marketing budget to cut blended CAC by at least 25%, and deliver an executive presentation to the CMO and CFO.",
  businessContext:
    "At current burn rates, high CAC will exhaust the runway 4 months ahead of schedule. Reallocating the ₹5,000,000 budget to lower blended CAC below ₹1,280 is an urgent board mandate.",
  objective:
    "Analyze channel efficiency and marginal returns, reallocate ₹5,000,000 across 5 acquisition channels, model LTV:CAC and payback period impact, and deliver an executive C-suite growth strategy deck.",
  estimatedMinutes: 90,
  difficulty: "Advanced",
  prerequisites: ["Omnichannel growth modeling (Paid Search, Social, Influencer, Affiliates, Referrals)", "Marginal CAC & Diminishing Returns economics", "LTV:CAC ratio & Payback Period modeling", "Executive CMO/CFO capital allocation"],
  learningOutcomes: [
    "Identifying diminishing marginal returns across paid acquisition channels",
    "Optimizing multi-channel capital allocation under mathematical constraints",
    "Balancing short-term paid performance with long-term viral/creator loops",
    "Presenting strategic financial reallocation cases to C-suite leadership",
  ],
  skills: ["Growth Strategy", "Capital Allocation", "CAC Optimization", "LTV:CAC Modeling", "Executive Storytelling"],
  materials: [
    {
      id: "mat-dm-sen-1",
      title: "Current Channel Performance & CAC Benchmarks (Dataset)",
      type: "dataset",
      description: "Monthly spend, acquisitions, CAC, and marginal return curves across 5 channels.",
      filename: "channel_spend_and_cac.json",
      relevance: "Used in Task 1 and Task 2 to calculate the optimal budget shift.",
      content: `{
  "budget": 5000000,
  "channels": {
    "Google_Paid_Search": { "current_spend": 2200000, "acquired_users": 1050, "cac": 2095, "marginal_cac_status": "Severe Diminishing Returns (Bidding on expensive keywords)" },
    "Meta_Paid_Social": { "current_spend": 1600000, "acquired_users": 1020, "cac": 1568, "marginal_cac_status": "Moderate Returns (Creative Fatigue)" },
    "Influencer_Creator_Loops": { "current_spend": 500000, "acquired_users": 480, "cac": 1041, "marginal_cac_status": "High Incrementality (Underspent)" },
    "Affiliate_Partnerships": { "current_spend": 450000, "acquired_users": 280, "cac": 1607, "marginal_cac_status": "Stable Performance" },
    "Viral_Referral_Engine": { "current_spend": 250000, "acquired_users": 350, "cac": 714, "marginal_cac_status": "Exceptional Efficiency (High viral coefficient)" }
  },
  "current_total_acquired": 3180,
  "current_blended_cac": 1572
}`,
    },
    {
      id: "mat-dm-sen-2",
      title: "Customer Lifetime Value (LTV) & Retention Cohorts",
      type: "docs",
      description: "LTV and payback period benchmarks across acquisition channels.",
      filename: "ltv_retention_benchmarks.md",
      relevance: "Used in Task 2 to model LTV:CAC and financial payback.",
      content: `## 12-Month LTV by Acquisition Channel
- Google Paid Search: 12-Month LTV = ₹4,800 (LTV:CAC = 2.3x, Payback = 7.2 months)
- Meta Paid Social: 12-Month LTV = ₹5,200 (LTV:CAC = 3.3x, Payback = 5.1 months)
- Influencer / Creators: 12-Month LTV = ₹6,100 (LTV:CAC = 5.8x, Payback = 3.2 months - Higher engagement!)
- Viral Referrals: 12-Month LTV = ₹5,800 (LTV:CAC = 8.1x, Payback = 1.9 months - Best organic retention!)`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Channel Efficiency Audit & Diminishing Returns Diagnosis",
      type: "investigation",
      dimension: "Funnel Economics & CAC Efficiency",
      objective: "Diagnose why Paid Search and Meta are underperforming and identify high-efficiency opportunities.",
      context: "Analyze channel_spend_and_cac.json in Materials.",
      prompt:
        "Analyze the current marketing capital deployment:\n1. Why is Google Paid Search operating at an inefficient CAC of ₹2,095 while consuming 44% of total budget?\n2. Compare the CAC and LTV of Influencer Loops (CAC ₹1,041, LTV ₹6,100) vs Google Paid Search (CAC ₹2,095, LTV ₹4,800).\n3. Explain the concept of Marginal CAC and why spending more in an exhausted auction pushes blended CAC higher.",
      constraints: ["Cite exact metrics from the dataset."],
      expectedOutput: "A structured diagnostic analysis of channel efficiency and auction saturation.",
      acceptanceCriteria: [
        "Identifies auction saturation and competitor bidding in Paid Search",
        "Contrasts the unit economics of paid search vs creator and referral loops",
        "Articulates marginal CAC dynamics and diminishing returns clearly",
      ],
      skills: ["Marketing Economics", "Diminishing Returns", "Channel Analysis"],
      evidenceRequired: ["Marginal CAC breakdown", "LTV comparison between channels"],
      validationRules: [
        { id: "dm-sen-t1-rule1", description: "Paid search CAC citation", type: "numerical", expectedSnippet: "2095" },
        { id: "dm-sen-t1-rule2", description: "Marginal CAC concept", type: "document_structure", expectedSnippet: "diminishing returns" },
      ],
      rubricWeight: 30,
      hints: ["When an auction is saturated, acquiring the next 100 users costs 2x to 3x the average CAC due to bidding on low-intent generic terms."],
      timeEstimateMins: 25,
    },
    {
      id: 2,
      title: "Reallocate ₹5,000,000 Monthly Budget to Cut Blended CAC by 25%",
      type: "implementation",
      dimension: "Funnel Economics & CAC Efficiency",
      objective: "Build an optimized budget reallocation model summing to exactly ₹5,000,000.",
      context: "Formulate a constrained optimization model shifting capital to high-efficiency channels.",
      prompt:
        "Construct the Q4 Budget Reallocation Model:\n1. Reallocate the ₹5,000,000 budget across the 5 channels (Must sum to exactly ₹5,000,000).\n2. Trim Google Paid Search spend and scale Influencer/Creator loops and the Viral Referral engine.\n3. Calculate the new projected acquired users and the new Blended CAC.\n4. Demonstrate that the new Blended CAC is at least 25% lower than current (Target Blended CAC <= ₹1,180).",
      constraints: ["Budget must sum to exactly ₹5,000,000. Show all arithmetic step-by-step."],
      expectedOutput: "A complete reallocation table showing new spend, projected acquisitions, and new Blended CAC.",
      acceptanceCriteria: [
        "Budget sums to exactly ₹5,000,000 across the 5 channels",
        "Substantially reduces Paid Search and scales high-LTV influencer/referral channels",
        "Calculates new blended CAC showing at least a 25% reduction",
      ],
      skills: ["Capital Reallocation", "Mathematical Modeling", "CAC Optimization"],
      evidenceRequired: ["Complete budget reallocation table", "Blended CAC reduction proof"],
      validationRules: [
        { id: "dm-sen-t2-rule1", description: "Budget total 5,000,000", type: "numerical", expectedSnippet: "5,000,000" },
        { id: "dm-sen-t2-rule2", description: "Blended CAC reduction", type: "numerical", expectedSnippet: "CAC" },
      ],
      rubricWeight: 40,
      hints: ["Shifting ₹800k from Google Search into Creator Partnerships and Referrals dramatically increases total acquisitions because their CAC is half of Google's."],
      timeEstimateMins: 35,
    },
    {
      id: 3,
      title: "Executive CMO/CFO Growth Presentation & Payback Model",
      type: "communication",
      dimension: "Campaign Strategy & Targeting",
      objective: "Deliver an executive presentation detailing payback periods and channel scale risks.",
      context: "Present to the CMO and CFO for budget sign-off.",
      prompt:
        "Deliver the Executive Growth Presentation:\n1. Executive Summary & Core Strategic Pivot.\n2. Payback Period Impact: How does shifting spend toward creator and referral loops compress payback periods from 6.8 months to under 4 months?\n3. Risk & Mitigation Matrix: Address scale limits (How many influencers can we realistically manage?) and attribution tracking challenges.\n4. 90-Day Execution Milestones.",
      constraints: ["Address payback period compression and operational scaling limits."],
      expectedOutput: "A structured executive presentation deck write-up with payback and risk analysis.",
      acceptanceCriteria: [
        "Articulates clear strategic narrative for the C-suite",
        "Demonstrates financial payback acceleration (< 4 months)",
        "Outlines realistic operational mitigations for influencer scaling",
      ],
      skills: ["Executive Presentations", "Payback Period Modeling", "Risk Management"],
      evidenceRequired: ["Executive presentation write-up", "Payback period comparison"],
      validationRules: [
        { id: "dm-sen-t3-rule1", description: "Payback period discussion", type: "document_structure", expectedSnippet: "payback" },
        { id: "dm-sen-t3-rule2", description: "Executive sections", type: "document_structure", requiredSections: ["Summary", "Payback", "Risk", "Milestones"], minWordCount: 50 },
      ],
      rubricWeight: 30,
      hints: ["Shorter payback periods free up working capital faster, allowing the business to reinvest the same capital multiple times per year."],
      timeEstimateMins: 30,
    },
  ],
  deliverable: {
    type: "Growth Strategy Deck (PDF / Slide Link) + Ad Copy Sheet",
    description: "Submit comprehensive Executive Growth Strategy Deck link and budget allocation model.",
    fields: [
      { name: "growthDeckUrl", label: "Executive Growth Deck URL", type: "url", placeholder: "https://docs.google.com/presentation/d/...", required: true, helpText: "Link to your executive presentation deck and financial reallocation model." },
      { name: "notes", label: "Executive Growth Strategy & CAC Reallocation", type: "text", placeholder: "Paste your ₹5M budget reallocation table, blended CAC calculations, and payback models...", required: true, helpText: "Include your channel allocations summing to ₹5M and executive payback analysis." },
    ],
    validationRules: [
      { id: "deliv-dm-sen-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "funnel_economics", name: "Capital Allocation & CAC Optimization Model", weight: 40, description: "Mathematical rigor of budget reallocation summing to ₹5M and achieving 25%+ CAC reduction.", criteria: ["Budget sums to ₹5M", "Sound marginal return modeling", "Proven 25%+ CAC reduction"] },
    { id: "campaign_strategy", name: "Strategic Channel Diversification & LTV Modeling", weight: 35, description: "Strategic understanding of scaling high-retention creator and referral loops over paid search.", criteria: ["Accurate LTV:CAC modeling", "Clear understanding of auction fatigue", "Pragmatic influencer scaling strategy"] },
    { id: "data_measurement", name: "Executive Presentation & Payback Modeling", weight: 25, description: "C-suite executive clarity, defensibility of payback period acceleration, and risk management.", criteria: ["Compelling CMO/CFO executive presentation", "Sound working capital payback defense"] },
  ],
  hints: ["Ensure that you account for influencer creative fatigue by modeling a roster refresh cadence."],
  progression: {
    onSuccess: {
      recommendedTrack: "SALES",
      recommendedLevel: "senior",
      rationale: "Candidate demonstrated world-class growth capital allocation and unit economics. Cross-track advance: Senior Enterprise Sales & Deal Negotiation.",
    },
    onRemediation: {
      recommendedTrack: "DM",
      recommendedLevel: "senior",
      targetSkill: "Marginal CAC Modeling",
      rationale: "Review diminishing returns curves and payback mathematics before managing multi-million rupee capital allocations.",
    },
  },
};
