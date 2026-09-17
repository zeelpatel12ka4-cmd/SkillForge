/**
 * SkillForge AI — Data Analyst (DA) Simulation Packages
 * Tracks: Fresher, Junior, Senior
 */

import { SimulationDefinition } from "@/types/simulation";

export const DA_FRESHER_SIMULATION: SimulationDefinition = {
  id: "SIM-DA-FRE-001",
  version: "1.0.0",
  careerCode: "DA",
  level: "fresher",
  title: "Customer Churn Data Cleanup & Monthly Recurring Revenue (MRR) Metrics",
  status: "active",
  roleContext: {
    roleTitle: "Junior Data Analyst",
    team: "Revenue Operations & Business Intelligence",
    companyContext: "B2B SaaS managing 15,000 corporate subscriptions.",
    reportingTo: "Lead Data Analytics Manager",
  },
  scenario:
    "Finance reported a discrepancy between Stripe billing logs and the internal BI churn dashboard. The raw subscription log export contains dirty data: duplicate records from failed webhook retries, NULL values in cancellation timestamps, negative amounts from billing adjustments, and conflicting plan tiers. You must clean the raw CSV dataset, eliminate duplicates, compute the accurate Monthly Recurring Revenue (MRR) Net Retention Rate, and present a concise summary for the Finance Director.",
  businessContext:
    "An incorrect churn calculation led to a false alarm in the quarterly board deck, underreporting Net Revenue Retention by 6%. Accurate reconciliation is required before tomorrow's audit.",
  objective:
    "Clean the raw customer billing dataset, calculate accurate gross churn and net MRR retention percentages, and document key findings in an executive note.",
  estimatedMinutes: 45,
  difficulty: "Beginner",
  prerequisites: ["Excel / Python / SQL data manipulation", "Basic SaaS metrics (MRR, Churn, Net Retention)", "Data munging fundamentals"],
  learningOutcomes: [
    "Handling dirty data, duplicate keys, and NULL imputation",
    "Calculating core SaaS financial metrics (Gross Churn, Net Retention Rate)",
    "Communicating data anomalies to cross-functional stakeholders",
  ],
  skills: ["Data Cleaning", "Excel / Python", "SaaS Financial Metrics", "SQL", "Data Quality"],
  materials: [
    {
      id: "mat-da-fre-1",
      title: "Raw Billing Transactions Dataset (CSV Snippet)",
      type: "dataset",
      description: "Uncleaned transaction logs exported from billing service with anomalies.",
      filename: "billing_export_raw.csv",
      relevance: "Used in Task 1 and Task 2 to detect duplicates, filter negative adjustments, and compute metrics.",
      content: `subscription_id,customer_id,plan_tier,monthly_amount,billing_status,created_at,canceled_at
SUB-101,CUST-902,Starter,49.00,ACTIVE,2026-01-15,NULL
SUB-102,CUST-441,Enterprise,499.00,ACTIVE,2026-01-18,NULL
SUB-103,CUST-812,Pro,149.00,CANCELED,2026-02-01,2026-03-10
SUB-104,CUST-992,Starter,49.00,ACTIVE,2026-02-10,NULL
SUB-105,CUST-812,Pro,-149.00,REFUND,2026-03-11,NULL
SUB-102,CUST-441,Enterprise,499.00,ACTIVE,2026-01-18,NULL
SUB-106,CUST-303,Pro,149.00,ACTIVE,2026-02-20,NULL
SUB-107,CUST-519,Starter,NULL,PENDING,2026-03-01,NULL
SUB-108,CUST-610,Enterprise,499.00,CANCELED,2026-01-05,2026-03-15
SUB-109,CUST-721,Pro,149.00,ACTIVE,2026-03-05,NULL`,
    },
    {
      id: "mat-da-fre-2",
      title: "Finance Metric Dictionary & Rules",
      type: "docs",
      description: "Official formula definitions for MRR and Churn calculations.",
      filename: "SaaS_Metrics_Formula_Sheet.pdf",
      relevance: "Used in Task 2 to apply exact business definitions.",
      content: `### Metric Definitions
1. Starting MRR: Sum of monthly_amount for ACTIVE subscriptions at start of month.
2. Churned MRR: Sum of monthly_amount for subscriptions that transitioned to CANCELED during the month.
3. Gross MRR Churn % = (Churned MRR / Starting MRR) * 100
4. Net Revenue Retention (NRR) % = ((Starting MRR - Churned MRR + Expansion MRR) / Starting MRR) * 100
5. Data Cleaning Rule: Ignore negative refund rows for MRR calculation; deduplicate on subscription_id.`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Data Audit & Anomaly Detection",
      type: "investigation",
      dimension: "Data Integrity & Cleaning",
      objective: "Identify all dirty data records and specify cleaning rules.",
      context: "Inspect billing_export_raw.csv against the metric dictionary.",
      prompt:
        "Review the raw CSV in Materials. Document:\n1. Identify duplicate subscription records by subscription_id.\n2. Explain how to handle the negative refund entry (SUB-105).\n3. How should the record with NULL monthly_amount (SUB-107) be treated for active MRR calculation?",
      constraints: ["Cite specific subscription IDs in your answer."],
      expectedOutput: "A structured 3-point data audit report.",
      acceptanceCriteria: [
        "Identifies SUB-102 as duplicate webhook event",
        "Recommends filtering out negative adjustment SUB-105 from base recurring MRR",
        "Specifies excluding pending SUB-107 with NULL amount until activation confirmation",
      ],
      skills: ["Data Munging", "Data Quality", "SQL Filtering"],
      evidenceRequired: ["List of identified anomalies by ID", "Cleaning rule recommendations"],
      validationRules: [
        { id: "da-fre-t1-rule1", description: "Detect duplicate SUB-102", type: "dataset_rules", expectedSnippet: "SUB-102" },
        { id: "da-fre-t1-rule2", description: "Filter negative SUB-105", type: "dataset_rules", expectedSnippet: "SUB-105" },
      ],
      rubricWeight: 30,
      hints: ["Notice that SUB-102 appears twice with identical timestamp and customer ID."],
      timeEstimateMins: 12,
    },
    {
      id: 2,
      title: "Calculate Gross Churn Rate & Net Retention",
      type: "implementation",
      dimension: "Analytical Rigor & Statistics",
      objective: "Compute the reconciled Starting MRR, Churned MRR, and Gross Churn %.",
      context: "Execute clean aggregations on deduplicated active subscriptions.",
      prompt:
        "Using the cleaned dataset rules:\n1. Calculate Total Active Starting MRR for cohorts active prior to March (SUB-101, SUB-102, SUB-103, SUB-106, SUB-108).\n2. Calculate Churned MRR for customers canceled in March (SUB-103, SUB-108).\n3. Compute Gross MRR Churn % rounded to 2 decimal places.\n4. Show your step-by-step arithmetic.",
      constraints: ["Show all calculations clearly."],
      expectedOutput: "Step-by-step arithmetic showing Starting MRR, Churned MRR, and exact percentage.",
      acceptanceCriteria: [
        "Calculates Starting MRR correctly: 49 + 499 + 149 + 149 + 499 = $1,345",
        "Calculates Churned MRR correctly: 149 + 499 = $648",
        "Computes Gross Churn %: (648 / 1345) * 100 = 48.18%",
      ],
      skills: ["SaaS Metrics", "Financial Calculations", "Arithmetic Precision"],
      evidenceRequired: ["Starting MRR figure", "Churned MRR figure", "Gross Churn percentage"],
      validationRules: [
        { id: "da-fre-t2-rule1", description: "Starting MRR calculation", type: "numerical", expectedSnippet: "1345" },
        { id: "da-fre-t2-rule2", description: "Churn percentage calculation", type: "numerical", expectedSnippet: "48.18" },
      ],
      rubricWeight: 45,
      hints: ["Make sure SUB-102 is counted only once, and exclude March newly created SUB-109 from Starting MRR."],
      timeEstimateMins: 20,
    },
    {
      id: 3,
      title: "Executive Brief for Finance Director",
      type: "communication",
      dimension: "Business Acumen & Recommendations",
      objective: "Summarize data cleanup methodology and strategic recommendations.",
      context: "Provide leadership with clear operational recommendations to prevent future webhook retries.",
      prompt:
        "Write a 1-page executive summary for the Finance Director:\n1. Root cause of the initial reporting discrepancy.\n2. Cleaned churn findings and financial impact.\n3. Two recommended automated data validation checks for the engineering data pipeline.",
      constraints: ["Keep language business-oriented and professional."],
      expectedOutput: "A structured executive memo with actionable recommendations.",
      acceptanceCriteria: [
        "Clearly communicates the duplicate webhook cause",
        "Summarizes churn impact on revenue forecasts",
        "Recommends pipeline validation (e.g. primary key uniqueness checks, NULL alerts)",
      ],
      skills: ["Executive Communication", "Data Governance", "Business Acumen"],
      evidenceRequired: ["Executive memo text"],
      validationRules: [
        { id: "da-fre-t3-rule1", description: "Executive summary structure", type: "document_structure", requiredSections: ["Root Cause", "Findings", "Recommendations"], minWordCount: 40 },
      ],
      rubricWeight: 25,
      hints: ["Recommend database-level unique constraints on webhook idempotency keys."],
      timeEstimateMins: 13,
    },
  ],
  deliverable: {
    type: "Cleaned CSV / Report Upload + Dashboard Link",
    description: "Submit cleaned dataset link or SQL report along with executive findings.",
    fields: [
      { name: "dashboardUrl", label: "Dashboard / Colab Notebook URL", type: "url", placeholder: "https://colab.research.google.com/drive/...", required: true, helpText: "Provide link to notebook or spreadsheet with cleaning queries." },
      { name: "notes", label: "Executive Summary & Calculations", type: "text", placeholder: "Document your step-by-step arithmetic and executive recommendations...", required: true, helpText: "Include your cleaned MRR and churn percentages." },
    ],
    validationRules: [
      { id: "deliv-da-fre-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "data_integrity", name: "Data Integrity & Cleaning", weight: 35, description: "Accurate detection of duplicate records, NULLs, and negative billing rows.", criteria: ["Detected all duplicate keys", "Handled nulls appropriately", "Clean data filtering"] },
    { id: "analytical_rigor", name: "Analytical Rigor & Statistics", weight: 35, description: "Precision in SaaS financial arithmetic and formula adherence.", criteria: ["Correct Starting MRR", "Exact Gross Churn percentage", "Clear mathematical steps"] },
    { id: "business_acumen", name: "Business Acumen & Communication", weight: 30, description: "Actionable executive memo and automated pipeline recommendations.", criteria: ["Structured executive tone", "Sound engineering pipeline recommendations"] },
  ],
  hints: ["Ensure that you deduplicate by subscription_id before summing values."],
  progression: {
    onSuccess: {
      recommendedTrack: "DA",
      recommendedLevel: "junior",
      rationale: "Strong foundational data cleaning and metric calculation. Advance to Junior: E-Commerce Funnel Drop-Off & Cohort Hypothesis Testing.",
    },
    onRemediation: {
      recommendedTrack: "DA",
      recommendedLevel: "fresher",
      targetSkill: "Data Cleaning & Munging",
      rationale: "Practice deduplication and financial aggregations before working with multi-stage funnels.",
    },
  },
};

export const DA_JUNIOR_SIMULATION: SimulationDefinition = {
  id: "SIM-DA-JUN-001",
  version: "1.0.0",
  careerCode: "DA",
  level: "junior",
  title: "E-Commerce Checkout Drop-off Funnel Analysis & Cohort Hypothesis Testing",
  status: "active",
  roleContext: {
    roleTitle: "Product Data Analyst",
    team: "Growth Analytics & User Experience",
    companyContext: "Direct-to-Consumer e-commerce marketplace recording 2,000,000 monthly sessions.",
    reportingTo: "Director of Product Analytics",
  },
  scenario:
    "Product leadership launched a redesigned checkout flow last month. While overall add-to-cart rates climbed by 12%, completed orders dropped by 4.2%. Telemetry suggests mobile users are experiencing severe drop-offs between shipping address entry and payment gateway authentication. You have received session clickstream data across iOS, Android, and Desktop platforms. You must construct a step-by-step funnel model, conduct a statistical hypothesis test (Chi-square or two-sample z-test) to confirm if the mobile conversion deficit is statistically significant, identify the specific friction point, and deliver an actionable slide recommendation.",
  businessContext:
    "The 4.2% order decline translates to an annualized revenue loss of ₹36,000,000. Product managers need statistically sound evidence before deciding whether to rollback the one-step checkout modal.",
  objective:
    "Build a conversion funnel across device cohorts, perform statistical significance testing on checkout drop-offs, diagnose the mobile friction driver, and author a strategic product recommendation.",
  estimatedMinutes: 60,
  difficulty: "Intermediate",
  prerequisites: ["SQL window functions / aggregations", "Statistical hypothesis testing (p-values, Chi-square)", "Funnel visualization"],
  learningOutcomes: [
    "Multi-stage checkout funnel modeling and stage conversion rates",
    "Statistical hypothesis testing and p-value interpretation",
    "Segment comparison across mobile vs desktop cohorts",
    "Data-driven product decision memo authoring",
  ],
  skills: ["Funnel Analytics", "SQL", "Cohort Analysis", "Hypothesis Testing", "Data Storytelling"],
  materials: [
    {
      id: "mat-da-jun-1",
      title: "Funnel Sessions Aggregate Telemetry (CSV)",
      type: "dataset",
      description: "Aggregated monthly session counts across checkout stages by device platform.",
      filename: "checkout_funnel_summary.csv",
      relevance: "Used in Task 1 and Task 2 to compute stage conversion rates and statistical test values.",
      content: `platform,total_sessions,cart_adds,reached_shipping,reached_payment,completed_orders,payment_gateway_errors
Desktop,120000,48000,42000,39000,35100,780
iOS_Mobile,95000,41800,34200,21000,16800,3240
Android_Mobile,85000,37400,29800,17800,13350,3110`,
    },
    {
      id: "mat-da-jun-2",
      title: "Error Log Sample: Mobile Payment Step",
      type: "logs",
      description: "Client-side telemetry logs during payment failure.",
      filename: "mobile_client_errors.log",
      relevance: "Used in Task 3 to identify the technical friction point causing mobile drop-off.",
      content: `[WARN] 14:12:09.112 [iOS-Client] CheckoutModal: Keyboard covering payment iframe submit button (Viewport height < 600px)
[ERROR] 14:12:12.441 [iOS-Client] PaymentGateway: Form abandoned after 3 retry clicks on obscured iframe
[WARN] 14:13:01.882 [Android-Client] CheckoutModal: Auto-fill triggering layout shift; payment button shifted offscreen`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Build Step-by-Step Funnel Conversion Matrix",
      type: "implementation",
      dimension: "Analytical Rigor & Statistics",
      objective: "Calculate conversion percentages across all checkout stages for Desktop, iOS, and Android.",
      context: "Analyze checkout_funnel_summary.csv.",
      prompt:
        "Calculate the following for each device cohort:\n1. Cart Add Rate (cart_adds / total_sessions).\n2. Shipping-to-Payment Transition Rate (reached_payment / reached_shipping).\n3. End-to-End Checkout Conversion Rate (completed_orders / cart_adds).\n4. Highlight which specific stage exhibits the largest variance between Desktop and Mobile.",
      constraints: ["Express all rates as percentages rounded to 1 decimal place."],
      expectedOutput: "A comparative markdown table displaying conversion rates across all 3 cohorts.",
      acceptanceCriteria: [
        "Desktop shipping-to-payment: (39000/42000) = 92.9%",
        "iOS shipping-to-payment: (21000/34200) = 61.4%",
        "Android shipping-to-payment: (17800/29800) = 59.7%",
        "Pinpoints shipping-to-payment as the critical ~32% drop-off gap",
      ],
      skills: ["Funnel Modeling", "Cohort Analysis", "SQL / Spreadsheet Calculations"],
      evidenceRequired: ["Completed conversion table", "Identification of critical bottleneck stage"],
      validationRules: [
        { id: "da-jun-t1-rule1", description: "Desktop conversion calculation", type: "numerical", expectedSnippet: "92.9" },
        { id: "da-jun-t1-rule2", description: "iOS conversion calculation", type: "numerical", expectedSnippet: "61.4" },
      ],
      rubricWeight: 35,
      hints: ["Compare the Drop from reached_shipping to reached_payment between Desktop (7%) vs iOS (38.6%)."],
      timeEstimateMins: 20,
    },
    {
      id: 2,
      title: "Statistical Significance Hypothesis Test",
      type: "investigation",
      dimension: "Analytical Rigor & Statistics",
      objective: "Conduct a two-proportion z-test or Chi-square test to confirm statistical significance.",
      context: "Determine if the mobile drop is random noise or statistically proven under alpha = 0.01.",
      prompt:
        "Perform a hypothesis test comparing Desktop vs Mobile (iOS + Android combined) completion rates from Cart Add to Order:\n1. State Null Hypothesis (H0) and Alternative Hypothesis (H1).\n2. Calculate the pooled conversion proportion and test statistic (z-score or Chi-square value).\n3. State the p-value and whether H0 is rejected at 99% confidence level (alpha = 0.01).",
      constraints: ["Must include clear null/alternative hypothesis statements and statistical verdict."],
      expectedOutput: "Hypothesis testing write-up with calculated statistic and p-value conclusion.",
      acceptanceCriteria: [
        "Defines H0: p_desktop = p_mobile; H1: p_desktop != p_mobile",
        "Calculates z-score > 15 (p < 0.0001) due to massive sample size (N > 100k)",
        "Rejects H0; concludes the mobile drop-off is overwhelmingly statistically significant",
      ],
      skills: ["Hypothesis Testing", "Statistical Inference", "p-value Interpretation"],
      evidenceRequired: ["Statistical hypotheses", "Calculated test statistic and conclusion"],
      validationRules: [
        { id: "da-jun-t2-rule1", description: "Null hypothesis statement", type: "code_static", expectedSnippet: "null hypothesis" },
        { id: "da-jun-t2-rule2", description: "Reject null hypothesis", type: "code_static", expectedSnippet: "reject" },
      ],
      rubricWeight: 35,
      hints: ["With sample sizes in tens of thousands, even a 2% difference yields p < 0.001."],
      timeEstimateMins: 20,
    },
    {
      id: 3,
      title: "Friction Diagnosis & Product Action Plan",
      type: "communication",
      dimension: "Business Acumen & Recommendations",
      objective: "Synthesize error telemetry with funnel data and propose prioritized product fixes.",
      context: "Combine mobile_client_errors.log findings with the statistical drop-off.",
      prompt:
        "Author a 3-part product recommendation for the VP of Product:\n1. Root Cause Diagnosis: How do mobile virtual keyboards and iframe shifts explain the shipping-to-payment drop?\n2. Immediate Tactical Fix vs Strategic Redesign.\n3. Projected Annual Revenue Recovery if mobile shipping-to-payment rate is restored to 85%.",
      constraints: ["Include numeric revenue recovery calculation."],
      expectedOutput: "Product recommendation memo with technical root cause and revenue projection.",
      acceptanceCriteria: [
        "Connects viewport height/keyboard obscuration directly to payment step drop-off",
        "Proposes sticky CTA and native payment sheet integration (Apple Pay/Google Pay)",
        "Projects realistic revenue recovery (> ₹15,000,000)",
      ],
      skills: ["Data Storytelling", "UX Telemetry Synthesis", "Revenue Forecasting"],
      evidenceRequired: ["Root cause analysis", "Revenue recovery projection"],
      validationRules: [
        { id: "da-jun-t3-rule1", description: "Viewport or keyboard diagnosis", type: "code_static", expectedSnippet: "keyboard" },
        { id: "da-jun-t3-rule2", description: "Action plan sections", type: "document_structure", requiredSections: ["Diagnosis", "Tactical", "Revenue"], minWordCount: 50 },
      ],
      rubricWeight: 30,
      hints: ["Native Apple Pay / Google Pay bypasses the iframe entirely, eliminating keyboard friction."],
      timeEstimateMins: 20,
    },
  ],
  deliverable: {
    type: "Cleaned CSV / Report Upload + Dashboard Link",
    description: "Submit Colab/Tableau notebook link and product memo.",
    fields: [
      { name: "dashboardUrl", label: "Dashboard / Notebook URL", type: "url", placeholder: "https://public.tableau.com/views/checkout-funnel", required: true, helpText: "Link to interactive funnel visualization or Jupyter/Colab notebook." },
      { name: "notes", label: "Product Analysis Memo & Statistics", type: "text", placeholder: "Document your funnel matrix, hypothesis test results, and ROI recovery...", required: true, helpText: "Include exact conversion percentages and statistical verdict." },
    ],
    validationRules: [
      { id: "deliv-da-jun-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "analytical_rigor", name: "Analytical Rigor & Statistics", weight: 40, description: "Accuracy of funnel stage rates, hypothesis testing methodology, and statistical confidence.", criteria: ["Accurate stage transition calculations", "Sound hypothesis formulation", "Correct statistical conclusion"] },
    { id: "data_integrity", name: "Data Integrity & Metric Synthesis", weight: 30, description: "Synthesis of numerical clickstream logs with qualitative client error telemetry.", criteria: ["Correct log interpretation", "Accurate cohort segmentation"] },
    { id: "business_acumen", name: "Business Acumen & Recommendations", weight: 30, description: "Pragmatism of product recommendations and defensibility of revenue recovery model.", criteria: ["Clear prioritization", "Defensible revenue impact estimate"] },
  ],
  hints: ["Be careful to compute shipping-to-payment as reached_payment / reached_shipping, not out of total_sessions."],
  progression: {
    onSuccess: {
      recommendedTrack: "DA",
      recommendedLevel: "senior",
      rationale: "Candidate demonstrated excellent statistical rigor and cohort modeling. Advance to Senior: Algorithmic Multi-Touch Attribution & ₹20M Marketing Budget Allocation.",
    },
    onRemediation: {
      recommendedTrack: "DA",
      recommendedLevel: "junior",
      targetSkill: "Statistical Hypothesis Testing",
      rationale: "Review z-tests and sample size considerations before progressing to multi-touch attribution.",
    },
  },
};

export const DA_SENIOR_SIMULATION: SimulationDefinition = {
  id: "SIM-DA-SEN-001",
  version: "1.0.0",
  careerCode: "DA",
  level: "senior",
  title: "Algorithmic Multi-Touch Attribution & ₹20,000,000 Marketing Budget Allocation",
  status: "active",
  roleContext: {
    roleTitle: "Staff Data Scientist / Principal Analytics Consultant",
    team: "Marketing Science & Capital Allocation",
    companyContext: "Omnichannel enterprise deploying ₹20M quarterly budget across 6 acquisition channels.",
    reportingTo: "Chief Marketing Officer (CMO) & CFO",
  },
  scenario:
    "The executive leadership team is divided over marketing budget allocation. The Performance Marketing team advocates for Google Paid Search based on Last-Touch attribution, while the Brand team argues Top-of-Funnel YouTube and Creator partnerships are severely undervalued. Your task is to construct an algorithmic Multi-Touch Attribution (MTA) model comparing First-Touch, Last-Touch, and a Markov Chain / Shapley Value Removal Effect model across 250,000 multi-touch customer journeys. You must identify channels with diminishing marginal returns, calculate incremental Return on Ad Spend (iROAS), and formulate a mathematically defensible budget reallocation for the ₹20,000,000 Q4 budget.",
  businessContext:
    "Last year, over-investing in Last-Touch Paid Search led to bidding on branded keywords that cannibalized organic conversions, wasting an estimated ₹4,500,000 in spend. A scientific attribution model is required to maximize blended CAC efficiency.",
  objective:
    "Build comparative attribution models across customer touchpoint journeys, compute Markov removal effects, calculate channel incrementality, and deliver an executive budget optimization plan.",
  estimatedMinutes: 90,
  difficulty: "Advanced",
  prerequisites: ["Markov Chain models / Shapley Value game theory", "Multi-touch journey data modeling", "Marginal CAC / iROAS economics"],
  learningOutcomes: [
    "Algorithmic attribution modeling and Markov transition matrices",
    "Measuring incremental lift vs organic cannibalization",
    "Marginal return modeling and constrained budget optimization",
    "C-suite executive presentation of complex statistical models",
  ],
  skills: ["Attribution Modeling", "Markov Chains", "Marketing Science", "Budget Optimization", "Executive Communication"],
  materials: [
    {
      id: "mat-da-sen-1",
      title: "Multi-Touch Journey Paths & Conversion Dataset (CSV)",
      type: "dataset",
      description: "Sample customer touchpoint paths leading to conversion or abandonment.",
      filename: "touchpoint_paths_summary.csv",
      relevance: "Used in Task 1 and Task 2 to calculate transition matrices and channel removal effects.",
      content: `path,total_journeys,conversions,revenue_generated
Organic_Search > Google_Search,35000,4200,12600000
YouTube_Brand > Meta_Ads > Google_Search,28000,3920,11760000
Meta_Ads > Direct,42000,3360,10080000
LinkedIn_Influencer > YouTube_Brand > Direct,19000,2280,6840000
Google_Search_Only,55000,3850,11550000
YouTube_Brand > Direct,25000,2000,6000000
Meta_Ads_Only,46000,2300,6900000`,
    },
    {
      id: "mat-da-sen-2",
      title: "Historical Channel Spend & CAC Baseline",
      type: "docs",
      description: "Q3 spend and customer acquisition metrics across channels.",
      filename: "channel_spend_q3.json",
      relevance: "Used in Task 3 to calculate incremental ROAS and optimize the ₹20M budget.",
      content: `{
  "channels": {
    "Google_Search": { "q3_spend": 8000000, "last_touch_conv": 12000, "first_touch_conv": 4200 },
    "Meta_Ads": { "q3_spend": 6000000, "last_touch_conv": 5600, "first_touch_conv": 9500 },
    "YouTube_Brand": { "q3_spend": 3500000, "last_touch_conv": 1200, "first_touch_conv": 8200 },
    "LinkedIn_Influencer": { "q3_spend": 2500000, "last_touch_conv": 800, "first_touch_conv": 3100 }
  },
  "total_budget": 20000000
}`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Comparative Attribution Model Execution",
      type: "implementation",
      dimension: "Analytical Rigor & Statistics",
      objective: "Compute First-Touch vs Last-Touch revenue attribution across the 4 paid channels.",
      context: "Apply attribution logic to touchpoint_paths_summary.csv.",
      prompt:
        "Using the journey dataset:\n1. Calculate attributed revenue for Google_Search under Last-Touch attribution.\n2. Calculate attributed revenue for YouTube_Brand under First-Touch attribution.\n3. Compute the attribution variance percentage: ((LastTouch - FirstTouch) / FirstTouch) * 100 for both channels.\n4. Explain why Last-Touch systematically undervalues YouTube_Brand.",
      constraints: ["Provide exact monetary revenue values and percentage variances."],
      expectedOutput: "A comparative table contrasting First-Touch vs Last-Touch channel valuations.",
      acceptanceCriteria: [
        "Calculates Google Search Last-Touch revenue correctly (captures paths ending in Google Search)",
        "Calculates YouTube Brand First-Touch revenue correctly (captures top-of-funnel paths starting with YouTube)",
        "Demonstrates YouTube is undervalued by > 60% under Last-Touch",
      ],
      skills: ["Attribution Modeling", "SQL Aggregations", "Data Modeling"],
      evidenceRequired: ["First-touch vs last-touch monetary figures", "Variance explanation"],
      validationRules: [
        { id: "da-sen-t1-rule1", description: "Attribute revenue comparison", type: "numerical", expectedSnippet: "Last-Touch" },
        { id: "da-sen-t1-rule2", description: "Identify top-of-funnel undervaluation", type: "code_static", expectedSnippet: "undervalue" },
      ],
      rubricWeight: 30,
      hints: ["Notice paths starting with YouTube_Brand convert at later stages via Direct or Google Search."],
      timeEstimateMins: 25,
    },
    {
      id: 2,
      title: "Markov Chain Removal Effect & Incremental Lift",
      type: "investigation",
      dimension: "Data Integrity & Cleaning",
      objective: "Model channel removal effect using Markov state transition probabilities.",
      context: "Estimate conversion drop if a channel were entirely removed from the customer journey graph.",
      prompt:
        "Explain the Markov Chain Removal Effect formulation:\n1. Define how removal effect r(C) = 1 - (Conversion_without_C / Baseline_Conversion) quantifies true channel indispensability.\n2. When YouTube_Brand is removed, why do down-funnel conversions for Meta_Ads and Direct experience drop-offs?\n3. How does this distinguish genuine organic incrementality from branded keyword cannibalization in Google_Search?",
      constraints: ["Formulate the probability transition concept clearly."],
      expectedOutput: "Mathematical explanation of Markov state transitions and channel removal effect.",
      acceptanceCriteria: [
        "Clearly articulates the Markov removal formula and transition graph",
        "Explains network effect of Top-of-Funnel channels on subsequent touchpoint propensity",
        "Addresses organic brand cannibalization by low-incrementality search capture",
      ],
      skills: ["Markov Models", "Graph Theory in Analytics", "Incrementality"],
      evidenceRequired: ["Markov removal formula explanation", "Incrementality analysis"],
      validationRules: [
        { id: "da-sen-t2-rule1", description: "Markov removal effect explanation", type: "code_static", expectedSnippet: "removal effect" },
        { id: "da-sen-t2-rule2", description: "Cannibalization discussion", type: "code_static", expectedSnippet: "cannibalization" },
      ],
      rubricWeight: 35,
      hints: ["Branded search captures intent that was already generated by upstream brand awareness campaigns."],
      timeEstimateMins: 30,
    },
    {
      id: 3,
      title: "Executive Q4 Budget Reallocation Strategy (₹20,000,000)",
      type: "communication",
      dimension: "Business Acumen & Recommendations",
      objective: "Deliver a constrained optimization budget plan reallocating ₹20,000,000 across channels.",
      context: "Present final recommendations to the CMO and CFO.",
      prompt:
        "Deliver the Q4 Budget Reallocation Plan:\n1. Present the reallocated budget table (summing to exactly ₹20,000,000) shifting capital from overvalued to undervalued channels.\n2. Project the expected increase in blended CAC efficiency (e.g. +15-20% overall conversions).\n3. Outline an A/B geo-lift experiment design to validate model findings before scaling to 100%.",
      constraints: ["Reallocated budget must sum to exactly ₹20,000,000 across the 4 channels."],
      expectedOutput: "Structured budget table, projected impact metrics, and geo-lift validation framework.",
      acceptanceCriteria: [
        "Budget sums to exactly ₹20,000,000",
        "Reduces Google Search spend to trim cannibalization; increases YouTube/Meta allocations",
        "Includes sound geo-matched market testing design to measure incremental lift",
      ],
      skills: ["Capital Allocation", "Geo-Lift Experimentation", "Executive Strategy"],
      evidenceRequired: ["Budget allocation table summing to 20M", "Geo-lift testing framework"],
      validationRules: [
        { id: "da-sen-t3-rule1", description: "Budget total 20,000,000", type: "numerical", expectedSnippet: "20,000,000" },
        { id: "da-sen-t3-rule2", description: "Geo-lift testing framework", type: "code_static", expectedSnippet: "geo" },
      ],
      rubricWeight: 35,
      hints: ["A geo-matched holdout test (e.g. turning off branded search in 10 test cities vs 10 control cities) isolates true incrementality."],
      timeEstimateMins: 35,
    },
  ],
  deliverable: {
    type: "Cleaned CSV / Report Upload + Dashboard Link",
    description: "Submit Colab/Python attribution script and executive deck.",
    fields: [
      { name: "dashboardUrl", label: "Model Code / Dashboard URL", type: "url", placeholder: "https://github.com/candidate/mta-attribution-model", required: true, helpText: "Provide link to Python/R script executing Markov attribution." },
      { name: "notes", label: "Executive Budget Strategy Memo", type: "text", placeholder: "Document your ₹20M budget breakdown and geo-lift test design...", required: true, helpText: "Include exact channel allocations summing to ₹20M." },
    ],
    validationRules: [
      { id: "deliv-da-sen-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "analytical_rigor", name: "Attribution Modeling & Mathematics", weight: 35, description: "Depth of Markov chain removal effect and multi-touch transition probability formulation.", criteria: ["Accurate transition matrix logic", "Rigorous removal effect formula", "Sound incremental lift calculation"] },
    { id: "business_acumen", name: "Capital Allocation & Business Strategy", weight: 35, description: "Financial viability of ₹20M reallocation and awareness of diminishing returns.", criteria: ["Budget sums to ₹20M", "Reduces cannibalistic spend", "Defensible CAC projections"] },
    { id: "data_integrity", name: "Experimental Validation & Rigor", weight: 30, description: "Soundness of geo-lift experiment design to validate model against causal truth.", criteria: ["Well-designed control vs test geo pairs", "Clear measurement KPIs"] },
  ],
  hints: ["Ensure that budget reductions in Google Search focus on branded terms, not non-branded generic search."],
  progression: {
    onSuccess: {
      recommendedTrack: "PM",
      recommendedLevel: "senior",
      rationale: "Candidate demonstrated master-level analytics and commercial acumen. Cross-track advance: Senior Product Manager Copilot Strategy & Feasibility.",
    },
    onRemediation: {
      recommendedTrack: "DA",
      recommendedLevel: "senior",
      targetSkill: "Markov Attribution Modeling",
      rationale: "Review stochastic transition matrices and Shapley game-theoretic allocations before leading capital deployment.",
    },
  },
};
