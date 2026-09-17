/**
 * SkillForge AI — Sales / Solutions (SALES) Simulation Packages
 * Tracks: Fresher, Junior, Senior
 */

import { SimulationDefinition } from "@/types/simulation";

export const SALES_FRESHER_SIMULATION: SimulationDefinition = {
  id: "SIM-SAL-FRE-001",
  version: "1.0.0",
  careerCode: "SALES",
  level: "fresher",
  title: "Inbound B2B Lead Qualification & BANT Discovery Call Synthesis",
  status: "active",
  roleContext: {
    roleTitle: "Sales Development Representative (SDR / BDR)",
    team: "Inbound Commercial Sales & Pipeline",
    companyContext: "B2B Cloud Security & Compliance SaaS selling to Mid-Market enterprises.",
    reportingTo: "SDR Team Lead & Director of Inside Sales",
  },
  scenario:
    "An inbound demonstration request was submitted by an IT Director at a 400-employee regional hospital network undergoing a mandatory SOC-2 and HIPAA compliance audit. You conducted a 15-minute initial discovery qualification call. The prospect revealed urgent audit deadlines, security tool sprawl, and board scrutiny, but has vague budget ownership and shared authority with the Chief Medical Officer. You must evaluate the recorded discovery call transcript using the BANT framework (Budget, Authority, Need, Timeline), score the opportunity, write professional CRM opportunity handover notes for the Account Executive, and draft a high-converting follow-up email proposing a Mutual Action Plan.",
  businessContext:
    "SDR pipeline quality directly determines Account Executive win rates. Passing unqualified or poorly documented leads wastes expensive AE demo capacity and damages sales velocity.",
  objective:
    "Evaluate an inbound discovery transcript using BANT, score lead qualification status, author detailed CRM handover notes, and write a professional executive follow-up email.",
  estimatedMinutes: 45,
  difficulty: "Beginner",
  prerequisites: ["BANT qualification framework (Budget, Authority, Need, Timeline)", "B2B CRM opportunity hygiene (Salesforce/HubSpot conventions)", "Executive follow-up email etiquette"],
  learningOutcomes: [
    "Synthesizing qualitative discovery call conversations into structured BANT data",
    "Identifying multi-stakeholder authority dynamics and missing budget lines",
    "Writing concise, actionable CRM handoff notes for Account Executives",
    "Drafting persuasive follow-up communications with Mutual Action Plans",
  ],
  skills: ["BANT Qualification", "CRM Hygiene", "Active Listening", "Discovery Synthesis", "Sales Communication"],
  materials: [
    {
      id: "mat-sal-fre-1",
      title: "Recorded Discovery Call Audio Transcript (15 Minutes)",
      type: "transcript",
      description: "Verbatim transcript of initial qualification conversation with prospect IT Director.",
      filename: "discovery_call_transcript.txt",
      relevance: "Used in Task 1 and Task 2 to extract BANT facts and author CRM notes.",
      content: `[SDR]: "Thanks for taking the call, David. What prompted you to reach out to SkillForge Security today?"
[Prospect - David K., IT Director]: "Well, our annual HIPAA and SOC-2 audit is scheduled for November 15th—just 8 weeks away. Our auditors told us our current manual spreadsheets won't pass. We need an automated cloud compliance platform urgently."
[SDR]: "Understood. Have you earmarked a budget for automated compliance tooling this fiscal quarter?"
[Prospect]: "We don't have a dedicated line item yet, but our VP of Operations and our Chief Medical Officer authorized me to evaluate solutions up to $45,000 from our discretionary IT contingency fund. If it's over $50k, our CFO has to sign off."
[SDR]: "Got it. Who besides yourself and the VP of Operations will be involved in the final evaluation and decision?"
[Prospect]: "It will be myself, our VP of Ops, and our Lead Cloud Architect. But our Chief Medical Officer has the ultimate veto if it disrupts clinical workflows."
[SDR]: "Understood. If we can prove automated evidence collection passes audit in under 3 weeks, what would the next step look like?"
[Prospect]: "I'd want to bring our Cloud Architect and VP of Ops to a technical demo next Tuesday."`,
    },
    {
      id: "mat-sal-fre-2",
      title: "Mid-Market Account Executive Handoff Standards",
      type: "docs",
      description: "Internal sales qualification standards for graduating an MQL to an SQL.",
      filename: "AE_handoff_criteria.md",
      relevance: "Used in Task 2 to format CRM notes according to sales team criteria.",
      content: `### SQL Graduation Criteria
1. Budget: Identified price range and funding source (Discretionary vs Capital Committee).
2. Authority: Named decision-makers and influencers (Economic Buyer, Champion, Technical Evaluator, Blocker).
3. Need: Explicit quantifiable business pain (Compelling event, Cost of inaction).
4. Timeline: Fixed event driving decision within 90 days.
5. Mutual Action Plan (MAP): Concrete date and agenda agreed for AE demonstration.`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "BANT Qualification Audit & Opportunity Scoring",
      type: "investigation",
      dimension: "Discovery & Opportunity Qualification",
      objective: "Deconstruct the discovery transcript into structured BANT components.",
      context: "Review discovery_call_transcript.txt against AE_handoff_criteria.md.",
      prompt:
        "Evaluate the prospect using the BANT framework:\n1. Budget: What is the confirmed discretionary limit, who holds budget authority, and what triggers CFO review?\n2. Authority: Map the stakeholder roles: Who is the Champion? Who is the Economic Buyer? Who is the potential Blocker?\n3. Need: What is the compelling event driving urgent purchase, and what is the cost of inaction?\n4. Timeline: What is the hard deadline driving the procurement decision?\n5. Overall Qualification Verdict: Is this a Qualified Sales Opportunity (SQL)? State your recommendation.",
      constraints: ["Cite specific quotes and dollar thresholds from the transcript."],
      expectedOutput: "A structured 5-point BANT qualification scorecard.",
      acceptanceCriteria: [
        "Identifies $45,000 discretionary limit and CFO approval trigger above $50k",
        "Correctly identifies David (Champion), VP Ops / CMO (Economic Buyer / Blocker)",
        "Notes November 15th HIPAA/SOC-2 audit (8 weeks away) as compelling event",
        "Concludes prospect is highly qualified SQL",
      ],
      skills: ["BANT Qualification", "Stakeholder Mapping", "Opportunity Assessment"],
      evidenceRequired: ["BANT breakdown", "Stakeholder roles", "Qualification verdict"],
      validationRules: [
        { id: "sal-fre-t1-rule1", description: "Budget threshold citation", type: "numerical", expectedSnippet: "45,000" },
        { id: "sal-fre-t1-rule2", description: "Audit deadline citation", type: "document_structure", expectedSnippet: "November 15" },
      ],
      rubricWeight: 35,
      hints: ["The Chief Medical Officer is a classic potential blocker who cares about clinical disruption, not cloud architecture."],
      timeEstimateMins: 15,
    },
    {
      id: 2,
      title: "CRM Opportunity Handoff Notes (Salesforce Format)",
      type: "implementation",
      dimension: "Discovery & Opportunity Qualification",
      objective: "Draft professional CRM opportunity handover notes for the Account Executive.",
      context: "Create a structured, concise Salesforce opportunity briefing.",
      prompt:
        "Write the Salesforce CRM Handover Note for Account Executive Sarah:\n- Opportunity Name: Regional Hospital Network - Cloud Compliance Platform\n- Estimated Contract Value: $40,000 - $48,000 ARR\n- Key Pain Points & Technical Requirements\n- Stakeholder Influence Matrix (Champion, Evaluator, Blocker)\n- Agreed Next Steps & Agenda for Technical Demo.",
      constraints: ["Maintain structured, concise CRM formatting."],
      expectedOutput: "A professional CRM opportunity handoff memo ready for Salesforce.",
      acceptanceCriteria: [
        "Adheres to CRM field structure (Pain, Stakeholders, Next Steps)",
        "Provides actionable context for the AE ahead of the demonstration",
        "Clearly warns AE about the CMO's clinical disruption concerns",
      ],
      skills: ["CRM Hygiene", "Sales Operations", "Internal Team Handoffs"],
      evidenceRequired: ["Complete Salesforce CRM handoff note"],
      validationRules: [
        { id: "sal-fre-t2-rule1", description: "CRM handoff structure", type: "document_structure", requiredSections: ["Pain", "Stakeholder", "Next Steps"], minWordCount: 40 },
      ],
      rubricWeight: 35,
      hints: ["Include a 'Watch Out' note for the AE so they don't get blindsided by the CMO in later meetings."],
      timeEstimateMins: 15,
    },
    {
      id: 3,
      title: "Executive Follow-Up Email & Mutual Action Plan (MAP)",
      type: "communication",
      dimension: "Closing Cadence & Executive Presence",
      objective: "Draft a high-converting follow-up email confirming the demo with a Mutual Action Plan.",
      context: "Email sent directly to prospect David K. within 1 hour of call completion.",
      prompt:
        "Draft the follow-up email to David K.:\n1. Acknowledge the core pain and the November 15th audit urgency.\n2. Outline a 3-step Mutual Action Plan (Demo on Tuesday -> 7-Day Proof-of-Concept -> Compliance Report delivery by Oct 15th).\n3. Reconfirm meeting date, time, attendees, and meeting link.",
      constraints: ["Maintain professional, polished executive tone."],
      expectedOutput: "A complete business email with subject line, body, and Mutual Action Plan.",
      acceptanceCriteria: [
        "Subject line is clear and professional",
        "Reinforces prospect's stated priorities and audit deadline",
        "Includes structured Mutual Action Plan driving deal velocity",
      ],
      skills: ["Executive Email Writing", "Mutual Action Plans", "Deal Velocity"],
      evidenceRequired: ["Complete email text with subject line and MAP"],
      validationRules: [
        { id: "sal-fre-t3-rule1", description: "Mutual Action Plan", type: "document_structure", expectedSnippet: "Mutual Action Plan" },
        { id: "sal-fre-t3-rule2", description: "Audit deadline mention", type: "document_structure", expectedSnippet: "November 15" },
      ],
      rubricWeight: 30,
      hints: ["A Mutual Action Plan (MAP) shifts the dynamic from 'selling to' the prospect to 'collaborating with' them to hit their audit deadline."],
      timeEstimateMins: 15,
    },
  ],
  deliverable: {
    type: "Executive Pitch Deck (PDF / Link) + Written Objection Handling Cadence",
    description: "Submit CRM Handover Notes, BANT Evaluation, and Executive Follow-up Email.",
    fields: [
      { name: "salesDocUrl", label: "CRM Opportunity Doc / Sheet URL", type: "url", placeholder: "https://docs.google.com/document/d/...", required: true, helpText: "Link to your CRM handover notes and qualification matrix." },
      { name: "notes", label: "BANT Qualification & Follow-up Email Text", type: "text", placeholder: "Paste your BANT scorecard, Salesforce opportunity notes, and executive follow-up email...", required: true, helpText: "Include your budget analysis, stakeholder matrix, and Mutual Action Plan." },
    ],
    validationRules: [
      { id: "deliv-sal-fre-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "discovery_qualification", name: "Discovery Synthesis & BANT Rigor", weight: 40, description: "Accuracy of extracting Budget, Authority, Need, and Timeline from conversational discovery logs.", criteria: ["Accurate budget constraint extraction", "Insightful stakeholder mapping", "Clear compelling event identification"] },
    { id: "closing_cadence", name: "Mutual Action Plan & Follow-Up Quality", weight: 35, description: "Professionalism and commercial persuasion of executive follow-up email and Mutual Action Plan.", criteria: ["Strong executive email tone", "Well-structured Mutual Action Plan", "Clear commercial momentum"] },
    { id: "solution_architecture", name: "CRM Hygiene & Account Executive Handoff", weight: 25, description: "Clarity, brevity, and actionability of Salesforce CRM opportunity handoff notes.", criteria: ["Concise, structured CRM formatting", "Actionable guidance for Account Executive", "Proactive risk alerts"] },
  ],
  hints: ["Ensure that you explicitly list the attendees required for the next meeting (Cloud Architect and VP of Ops)."],
  progression: {
    onSuccess: {
      recommendedTrack: "SALES",
      recommendedLevel: "junior",
      rationale: "Strong BANT qualification and discovery synthesis. Advance to Junior: Enterprise Competitor Objection Handling & 3-Year TCO Modeling.",
    },
    onRemediation: {
      recommendedTrack: "SALES",
      recommendedLevel: "fresher",
      targetSkill: "BANT Qualification",
      rationale: "Practice identifying economic buyers and compelling events before handling complex competitive objections.",
    },
  },
};

export const SALES_JUNIOR_SIMULATION: SimulationDefinition = {
  id: "SIM-SAL-JUN-001",
  version: "1.0.0",
  careerCode: "SALES",
  level: "junior",
  title: "Enterprise Competitor Objection Handling & Total Cost of Ownership (TCO) Defense",
  status: "active",
  roleContext: {
    roleTitle: "Commercial Account Executive (AE)",
    team: "Mid-Market & Commercial Enterprise Sales",
    companyContext: "Cloud Observability & APM SaaS with an average deal size of $85,000 ARR.",
    reportingTo: "Regional Vice President of Sales",
  },
  scenario:
    "You are in the final stages of closing an $85,000 ARR contract with an enterprise logistics customer (2,500 employees). During the commercial review call, the VP of Infrastructure dropped a severe objection: 'Your primary legacy competitor, LegacyMonitor Inc., has offered us an identical license package for $52,000/year—a 39% discount ($33,000 cheaper). Unless you match their $52k price, we are signing with them by Friday.' However, our technical evaluation proved LegacyMonitor requires dedicated self-hosted server clusters, 20 hours/month of manual maintenance engineering, and charges hidden fees for log indexing and ingestion spikes. You must construct a 3-Year Total Cost of Ownership (TCO) financial model, author an executive objection handling rebuttal cadence, and deliver a value-defense presentation justifying our premium pricing.",
  businessContext:
    "Matching the 39% discount reduces contract margin to zero and establishes a dangerous discounting precedent. Defending our $85k contract value based on TCO savings is critical for Q3 quota achievement.",
  objective:
    "Deconstruct competitor pricing models, build a 3-year Total Cost of Ownership (TCO) financial comparison showing net savings, and author an executive rebuttal talk track.",
  estimatedMinutes: 60,
  difficulty: "Intermediate",
  prerequisites: ["Total Cost of Ownership (TCO) & ROI financial modeling", "Objection handling frameworks (Acknowledge, Clarify, Validate, Reframe)", "Competitive positioning & value-based selling"],
  learningOutcomes: [
    "Reframing price objections into Total Cost of Ownership (TCO) discussions",
    "Exposing hidden operational and infrastructure costs in competitor proposals",
    "Constructing multi-year financial ROI comparison spreadsheets",
    "Defending SaaS gross margins and contract value without knee-jerk discounting",
  ],
  skills: ["Objection Handling", "TCO Modeling", "Value-Based Selling", "Financial Justification", "Executive Rebuttal"],
  materials: [
    {
      id: "mat-sal-jun-1",
      title: "Competitor Battlecard & Cost Comparison Data",
      type: "docs",
      description: "Competitive intelligence on LegacyMonitor Inc. vs SkillForge Observability.",
      filename: "competitive_battlecard_legacymonitor.md",
      relevance: "Used in Task 1 and Task 2 to build the 3-year TCO financial model.",
      content: `## Competitive Comparison Data
1. License Cost: LegacyMonitor = $52,000/yr vs SkillForge = $85,000/yr.
2. Infrastructure Overhead: LegacyMonitor requires self-hosted storage clusters (AWS EC2 + EBS = $22,000/yr). SkillForge is 100% cloud-native SaaS ($0 infrastructure cost).
3. Maintenance Engineering: LegacyMonitor requires 20 hours/month of dedicated DevOps maintenance (240 hrs/yr at fully-loaded engineer cost of $95/hr = $22,800/yr). SkillForge requires < 1 hr/month ($1,140/yr).
4. Hidden Ingestion Spikes: LegacyMonitor bills $0.40/GB for unexpected data spikes (historical average for prospect = $14,000/yr). SkillForge includes unlimited burst protection ($0).`,
    },
    {
      id: "mat-sal-jun-2",
      title: "Prospect Email Objection (VP of Infrastructure)",
      type: "docs",
      description: "Email received from prospect threatening to sign with competitor.",
      filename: "prospect_objection_email.txt",
      relevance: "Used in Task 3 to write the executive rebuttal response.",
      content: `From: marcus.vance@logistics-corp.com
Subject: Commercial Proposal Feedback - SkillForge vs LegacyMonitor

Hi Sarah,
We reviewed both proposals with our procurement team. LegacyMonitor came in at $52,000/year, whereas SkillForge is $85,000. That is a $33,000 annual difference—nearly $100k over a 3-year term.
Our leadership cannot justify spending 39% more for comparable observability features. Can you match their $52k pricing? If not, we will proceed with LegacyMonitor for a Friday signing.
Best,
Marcus Vance, VP Infrastructure`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "3-Year Total Cost of Ownership (TCO) Financial Model",
      type: "implementation",
      dimension: "Financial Justification & TCO/ROI",
      objective: "Build a 3-year TCO comparison demonstrating that LegacyMonitor is actually $77,460 MORE expensive.",
      context: "Calculate all hidden costs from competitive_battlecard_legacymonitor.md.",
      prompt:
        "Build the 3-Year TCO Comparison Table:\n1. For LegacyMonitor: Calculate Year 1, Year 2, and Year 3 total costs combining License ($52k) + Infrastructure ($22k) + DevOps Labor ($22.8k) + Ingestion Spikes ($14k).\n2. For SkillForge: Calculate Year 1, Year 2, and Year 3 total costs combining License ($85k) + Infrastructure ($0) + Maintenance Labor ($1.14k) + Burst Spikes ($0).\n3. Compute 3-Year Total Cost for both platforms and demonstrate the Net Financial Savings of choosing SkillForge.",
      constraints: ["Show all arithmetic step-by-step for both options over 3 years."],
      expectedOutput: "A complete 3-year financial TCO comparison table showing net savings.",
      acceptanceCriteria: [
        "Calculates LegacyMonitor annual true cost: 52k + 22k + 22.8k + 14k = $110,800/yr (3-Year Total = $332,400)",
        "Calculates SkillForge annual true cost: 85k + 0 + 1.14k + 0 = $86,140/yr (3-Year Total = $258,420)",
        "Proves SkillForge delivers $73,980 net cash savings over 3 years despite higher sticker price",
      ],
      skills: ["TCO Modeling", "Financial Arithmetic", "Value Selling"],
      evidenceRequired: ["3-Year TCO Table", "Net savings calculation"],
      validationRules: [
        { id: "sal-jun-t1-rule1", description: "LegacyMonitor true annual cost", type: "numerical", expectedSnippet: "110,800" },
        { id: "sal-jun-t1-rule2", description: "SkillForge 3-year net savings", type: "numerical", expectedSnippet: "73,980" },
      ],
      rubricWeight: 40,
      hints: ["Sticker price is only the tip of the iceberg; operational labor and cloud compute exceed the license cost!"],
      timeEstimateMins: 20,
    },
    {
      id: 2,
      title: "Objection Reframing Strategy & Value Talk Track",
      type: "investigation",
      dimension: "Objection Handling & Value Defense",
      objective: "Formulate the psychological objection handling framework (Acknowledge, Clarify, Validate, Reframe).",
      context: "Prepare the verbal rebuttal cadence for the commercial call with Marcus Vance.",
      prompt:
        "Develop the verbal objection talk track using the ACVR framework:\n1. Acknowledge & Validate: Respect their fiduciary responsibility to scrutinize price differences without sounding defensive.\n2. Clarify: Ask targeted discovery questions uncovering who pays for the self-hosted AWS clusters and DevOps maintenance.\n3. Reframe: Shift the narrative from 'Sticker Price per Year' to 'Total Fully-Loaded Cost per Year'.\n4. Risk Highlighting: Contrast our SLA-backed 99.99% cloud uptime against the prospect's team carrying 24/7 on-call liability for self-hosted server failures.",
      constraints: ["Follow the ACVR structure clearly."],
      expectedOutput: "A complete sales verbal talk track for handling the price pushback.",
      acceptanceCriteria: [
        "Demonstrates emotional intelligence in acknowledging the customer's cost pressure",
        "Provides precise probing questions about hidden hosting and maintenance lines",
        "Reframes the conversation convincingly around engineer productivity and total risk",
      ],
      skills: ["Objection Handling", "Active Rebuttal", "Value Reframing"],
      evidenceRequired: ["ACVR talk track script"],
      validationRules: [
        { id: "sal-jun-t2-rule1", description: "ACVR framework structure", type: "document_structure", requiredSections: ["Acknowledge", "Clarify", "Reframe", "Risk"], minWordCount: 40 },
      ],
      rubricWeight: 35,
      hints: ["Ask: 'Marcus, when your engineers spend 20 hours every month patching monitoring servers, whose budget does that engineering time come from?'"],
      timeEstimateMins: 20,
    },
    {
      id: 3,
      title: "Executive Email Rebuttal to VP of Infrastructure",
      type: "communication",
      dimension: "Closing Cadence & Executive Presence",
      objective: "Write the formal email response to Marcus Vance presenting the TCO findings.",
      context: "Send a respectful, data-backed rebuttal directly responding to prospect_objection_email.txt.",
      prompt:
        "Draft the email response to Marcus Vance:\n1. Acknowledge the $33,000 sticker price difference transparently.\n2. Present the TCO comparison table showing how self-hosted infrastructure and DevOps hours make LegacyMonitor $73k more expensive over 3 years.\n3. Offer a non-price concession to close the deal by Friday (e.g. Free Enterprise Onboarding & Migration Services valued at $10,000).\n4. Propose a 20-minute alignment call with their CFO/Procurement lead on Thursday morning.",
      constraints: ["Must NOT discount the $85,000 ARR license price. Offer value-add concessions instead."],
      expectedOutput: "A compelling executive email defending price with financial TCO proof and value concessions.",
      acceptanceCriteria: [
        "Defends the $85,000 price point firmly without giving away margins",
        "Integrates the TCO financial breakdown clearly and persuasively",
        "Offers high-value/low-cost onboarding services concession to close by Friday",
      ],
      skills: ["Executive Email Writing", "Negotiation", "Non-Price Concessions"],
      evidenceRequired: ["Complete email response to Marcus Vance"],
      validationRules: [
        { id: "sal-jun-t3-rule1", description: "TCO net savings in email", type: "document_structure", expectedSnippet: "73" },
        { id: "sal-jun-t3-rule2", description: "Value concession offer", type: "document_structure", expectedSnippet: "Onboarding" },
      ],
      rubricWeight: 25,
      hints: ["Never discount price without getting something in return; offering free onboarding in exchange for a 3-year commitment protects recurring ARR."],
      timeEstimateMins: 20,
    },
  ],
  deliverable: {
    type: "Executive Pitch Deck (PDF / Link) + Written Objection Handling Cadence",
    description: "Submit 3-Year TCO Spreadsheet Model and Executive Objection Rebuttal Letter.",
    fields: [
      { name: "salesDocUrl", label: "TCO Model / Presentation URL", type: "url", placeholder: "https://docs.google.com/spreadsheets/d/...", required: true, helpText: "Link to your 3-Year TCO financial comparison spreadsheet or slide deck." },
      { name: "notes", label: "TCO Financial Breakdown & Executive Rebuttal", type: "text", placeholder: "Paste your 3-Year TCO calculation table, ACVR talk track, and executive email to Marcus Vance...", required: true, helpText: "Include your exact mathematical savings figures and non-price concession terms." },
    ],
    validationRules: [
      { id: "deliv-sal-jun-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "financial_justification", name: "TCO Financial Modeling & Mathematics", weight: 40, description: "Precision in uncovering hidden infrastructure, maintenance labor, and burst costs over 3 years.", criteria: ["Accurate mathematical calculations", "Exhaustive hidden cost identification", "Clear presentation of 3-year net savings"] },
    { id: "objection_rebuttal", name: "Objection Reframing & Psychological Persuasion", weight: 35, description: "Mastery of the ACVR framework, emotional composure, and value-based repositioning.", criteria: ["Flawless ACVR structure", "Incisive probing questions", "Compelling shift from sticker price to fully-loaded cost"] },
    { id: "closing_cadence", name: "Executive Negotiation & Non-Price Concessions", weight: 25, description: "Executive presence in defending ARR margins and offering strategic value-add concessions.", criteria: ["Zero unforced discounting", "Strategic service concession offer", "Clear closing momentum towards Friday signature"] },
  ],
  hints: ["Ensure that you clearly separate hard costs (cloud hosting invoices) from soft costs (DevOps engineering time)."],
  progression: {
    onSuccess: {
      recommendedTrack: "SALES",
      recommendedLevel: "senior",
      rationale: "Candidate demonstrated elite commercial negotiation and financial modeling. Advance to Senior: ₹500,000 Enterprise RFP Negotiation & Multi-Stakeholder Close Plan.",
    },
    onRemediation: {
      recommendedTrack: "SALES",
      recommendedLevel: "junior",
      targetSkill: "TCO Financial Modeling",
      rationale: "Review fully-loaded labor calculations and cloud infrastructure modeling before handling multi-stakeholder enterprise RFPs.",
    },
  },
};

export const SALES_SENIOR_SIMULATION: SimulationDefinition = {
  id: "SIM-SAL-SEN-001",
  version: "1.0.0",
  careerCode: "SALES",
  level: "senior",
  title: "₹500,000 ($500K) Enterprise RFP Multi-Stakeholder Negotiation & Close Plan",
  status: "active",
  roleContext: {
    roleTitle: "Strategic Enterprise Account Director / Global Client Partner",
    team: "Strategic Global Accounts & Enterprise Expansion",
    companyContext: "Enterprise Core Banking & Payments Infrastructure SaaS selling multi-year transformation deals.",
    reportingTo: "Chief Revenue Officer (CRO)",
  },
  scenario:
    "You are orchestrating a ₹41,500,000 ($500,000 ARR / 3-Year $1.5M Total Contract Value) core infrastructure modernization deal with a Tier-1 National Bank (12,000 employees). The technical evaluation has concluded with our platform selected as the top technical vendor. However, the deal is stalled in procurement and legal redlines: Procurement is demanding an immediate 25% price reduction, Legal is requesting unlimited liability for indirect damages, and InfoSec is balking at multi-tenant cloud storage. With 10 days remaining in the fiscal quarter, you must manage a multi-threaded champion strategy (navigating the CIO, CISO, Head of Procurement, and General Counsel), defend contract pricing through non-cash commercial trade-offs, resolve legal liability redlines with compromise language, and deliver an airtight 10-day Executive Close Plan to secure the CEO signature.",
  businessContext:
    "This deal represents 38% of the sales organization's Q4 enterprise quota and establishes our foundational marquee reference customer in retail banking.",
  objective:
    "Navigate multi-stakeholder redlines, formulate a give-get commercial concession strategy defending contract value, redline legal liability terms, and author an executive 10-day Close Plan.",
  estimatedMinutes: 90,
  difficulty: "Advanced",
  prerequisites: ["Enterprise SaaS contracting (Master Services Agreement MSA, Service Level Agreement SLA)", "Multi-threaded enterprise account mapping (MEDDPICC)", "Give-Get commercial negotiation frameworks", "Executive closing sequences & legal compromise terms"],
  learningOutcomes: [
    "Navigating multi-stakeholder misalignment across Procurement, Legal, InfoSec, and Business",
    "Executing disciplined 'Give-Get' commercial negotiations without margin erosion",
    "Resolving high-stakes contract liability and data sovereignty redlines",
    "Constructing an airtight 10-day executive Mutual Close Plan",
  ],
  skills: ["MEDDPICC", "Enterprise Negotiation", "Contract Redlines (MSA)", "Multi-Threaded Selling", "Executive Close Plans"],
  materials: [
    {
      id: "mat-sal-sen-1",
      title: "Procurement & Legal Redline Summary Table",
      type: "docs",
      description: "Active redlines from Bank Legal, Procurement, and InfoSec.",
      filename: "bank_procurement_redlines.md",
      relevance: "Used in Task 1 and Task 2 to formulate concession trade-offs.",
      content: `## Bank Procurement & Legal Demands
1. Price: Procurement demands 25% discount (From $500k/yr down to $375k/yr).
2. Payment Terms: Demanding Net-90 payment terms (Our standard is Net-30).
3. Liability: Legal insists on UNLIMITED liability for any service outage or indirect data breach damages (Our standard cap is 12 months fees paid).
4. Data Sovereignty: InfoSec demands dedicated isolated database instances in local regional VPC.
5. Term: Proposing 1-year contract with annual termination for convenience.`,
    },
    {
      id: "mat-sal-sen-2",
      title: "Enterprise Deal Give-Get Concession Menu",
      type: "docs",
      description: "Approved CRO concession guidelines and acceptable trade-offs.",
      filename: "cro_give_get_guidelines.md",
      relevance: "Used in Task 2 to structure equitable non-cash commercial concessions.",
      content: `### Approved Concession Matrix
- IF they demand price discount -> GET multi-year prepayment upfront OR joint press release & case study OR expansion commitment to 2 additional business units.
- IF they demand Net-60/90 terms -> GET minimum 3-year term with zero termination for convenience.
- IF they demand dedicated isolated DB -> GET +15% infrastructure add-on fee ($75k/yr).
- LIABILITY REDLINE: NEVER accept unlimited liability. Compromise at 'Super-Cap' of 2x-3x annual contract value solely for verified regulatory fines resulting from willful gross negligence.`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Multi-Threaded Stakeholder Strategy & MEDDPICC Audit",
      type: "investigation",
      dimension: "Discovery & Opportunity Qualification",
      objective: "Map the stakeholder matrix and identify how to leverage your Champion (CIO) to counter Procurement.",
      context: "Analyze bank_procurement_redlines.md in Materials.",
      prompt:
        "Perform a MEDDPICC analysis:\n1. Metrics: What quantifiable business metric ($24M annual latency cost) justifies this $500k investment to the Board?\n2. Economic Buyer vs Champion: Identify the Economic Buyer (CFO/CEO) and Champion (CIO/VP Tech). How will you empower your Champion to push back on Procurement's delay tactics?\n3. Decision Criteria & Paper Process: Map the exact sequence of approvals required to execute signatures in the final 10 days.",
      constraints: ["Follow the MEDDPICC framework rigorously."],
      expectedOutput: "A structured MEDDPICC account map and multi-threading strategy.",
      acceptanceCriteria: [
        "Articulates economic metrics justifying the modernization investment",
        "Details strategy to activate CIO champion against procurement stonewalling",
        "Maps required legal, infosec, and board approval paper process",
      ],
      skills: ["MEDDPICC", "Enterprise Stakeholder Mapping", "Deal Strategy"],
      evidenceRequired: ["MEDDPICC analysis", "Champion mobilization plan"],
      validationRules: [
        { id: "sal-sen-t1-rule1", description: "MEDDPICC framework", type: "document_structure", expectedSnippet: "MEDDPICC" },
        { id: "sal-sen-t1-rule2", description: "Economic Buyer identification", type: "document_structure", expectedSnippet: "Economic Buyer" },
      ],
      rubricWeight: 30,
      hints: ["Procurement's bonus is tied to negotiated discounts; give them a non-monetary 'win' or volume tiered rebate rather than slicing baseline ARR."],
      timeEstimateMins: 25,
    },
    {
      id: 2,
      title: "Give-Get Commercial Matrix & Legal Redline Resolution",
      type: "implementation",
      dimension: "Objection Handling & Value Defense",
      objective: "Structure the Give-Get compromise package and write legal redline compromise clauses.",
      context: "Apply cro_give_get_guidelines.md to all 5 procurement redlines.",
      prompt:
        "Formulate the Commercial Give-Get Package:\n1. Price Defense: Reject the 25% discount. Offer a 7% multi-year discount ($465k/yr) ONLY IF they commit to a 3-year non-cancellable contract with Year 1 prepaid upfront.\n2. Liability Compromise: Write the exact contract language replacing 'Unlimited Liability' with a 2x Annual Contract Value 'Super-Cap' restricted strictly to direct regulatory fines caused by proven gross negligence.\n3. Data Sovereignty: Bundle dedicated single-tenant VPC hosting as a $50k/yr managed service add-on, increasing total deal value to $515k/yr.\n4. Present the complete Give-Get table contrasting Customer Asks against Company Gets.",
      constraints: ["Include exact legal compromise language for the liability super-cap clause."],
      expectedOutput: "A structured Give-Get table and formal legal redline compromise text.",
      acceptanceCriteria: [
        "Structures clear Give-Get trade-offs for all 5 procurement items",
        "Protects recurring contract value while offering creative multi-year concessions",
        "Provides precise legal drafting for the 2x contract value liability super-cap",
      ],
      skills: ["Commercial Negotiation", "Contract Redlining (MSA)", "Give-Get Strategy"],
      evidenceRequired: ["Give-Get negotiation matrix", "Legal super-cap compromise clause"],
      validationRules: [
        { id: "sal-sen-t2-rule1", description: "Super-cap legal clause", type: "code_static", expectedSnippet: "super-cap" },
        { id: "sal-sen-t2-rule2", description: "Give-Get matrix structure", type: "document_structure", requiredSections: ["Give", "Get", "Price", "Liability"], minWordCount: 45 },
      ],
      rubricWeight: 40,
      hints: ["Legal teams negotiate liability caps aggressively because they are risk-averse; providing a specific carve-out for regulatory fines with a defined cap (e.g. $1M) unblocks deals instantly."],
      timeEstimateMins: 35,
    },
    {
      id: 3,
      title: "10-Day Executive Mutual Close Plan & CRO Briefing",
      type: "communication",
      dimension: "Closing Cadence & Executive Presence",
      objective: "Author an airtight day-by-day 10-day Close Plan leading to contract signature on Day 10.",
      context: "Present the close plan to the CRO and Bank Executive Committee.",
      prompt:
        "Draft the 10-Day Mutual Close Plan:\n- Days 1-2: Legal counsel redline review call (Finalize super-cap compromise)\n- Days 3-4: InfoSec security exhibit sign-off & DPA execution\n- Days 5-6: Procurement commercial terms alignment & PO issuance\n- Days 7-8: Board governance & CFO sign-off\n- Days 9-10: Electronic signature (DocuSign) execution prior to quarter end.\nFor each stage, specify: Owner, Required Attendees, Success Gate, and Escalation Trigger if delayed > 24 hours.",
      constraints: ["Detail all 5 stages across the 10-day timeline with clear ownership."],
      expectedOutput: "A complete day-by-day executive Mutual Close Plan table with escalation triggers.",
      acceptanceCriteria: [
        "Provides realistic, tightly orchestrated 10-day closing sequence",
        "Assigns clear single-threaded ownership across both vendor and customer teams",
        "Includes proactive escalation triggers to mobilize the CIO/CEO if bottlenecks occur",
      ],
      skills: ["Mutual Close Plans", "Executive Orchestration", "Closing Cadence"],
      evidenceRequired: ["10-Day Close Plan Table", "Escalation protocol"],
      validationRules: [
        { id: "sal-sen-t3-rule1", description: "10-day timeline stages", type: "document_structure", expectedSnippet: "DocuSign" },
        { id: "sal-sen-t3-rule2", description: "Escalation triggers", type: "document_structure", expectedSnippet: "escalation" },
      ],
      rubricWeight: 30,
      hints: ["A Mutual Close Plan works because both parties agree in advance to specific calendar times for legal redline calls, eliminating email delays."],
      timeEstimateMins: 30,
    },
  ],
  deliverable: {
    type: "Executive Pitch Deck (PDF / Link) + Written Objection Handling Cadence",
    description: "Submit 10-Day Mutual Close Plan, Give-Get Negotiation Matrix, and MSA Redlines.",
    fields: [
      { name: "salesDocUrl", label: "Executive Close Plan Doc URL", type: "url", placeholder: "https://docs.google.com/document/d/...", required: true, helpText: "Link to your 10-day Close Plan, Give-Get matrix, and legal compromise redlines." },
      { name: "notes", label: "MEDDPICC Analysis & Concession Strategy", type: "text", placeholder: "Paste your MEDDPICC account map, Give-Get matrix, liability super-cap clause, and 10-day timeline...", required: true, helpText: "Include your exact legal compromise text and day-by-day escalation triggers." },
    ],
    validationRules: [
      { id: "deliv-sal-sen-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "solution_architecture", name: "Commercial Give-Get Strategy & Contract Value", weight: 40, description: "Mastery of disciplined Give-Get trades, protecting gross margins, and expanding deal scope.", criteria: ["Zero uncompensated discounting", "Creative multi-year prepay trade-offs", "Sound revenue expansion positioning"] },
    { id: "objection_rebuttal", name: "Legal Redline Compromise & Risk Mitigation", weight: 35, description: "Technical and legal soundness of the liability super-cap clause and regulatory carve-outs.", criteria: ["Legally sound super-cap drafting", "Clear carve-outs for gross negligence", "Balanced risk allocation"] },
    { id: "closing_cadence", name: "10-Day Mutual Close Plan & Deal Orchestration", weight: 25, description: "Rigor of the 10-day day-by-day close plan, clear accountability, and escalation triggers.", criteria: ["Airtight 10-day closing orchestration", "Actionable escalation protocols", "High executive presence"] },
  ],
  hints: ["Ensure that you schedule the final legal review call directly on the calendar of both internal and external legal counsels."],
  progression: {
    onSuccess: {
      recommendedTrack: "PM",
      recommendedLevel: "senior",
      rationale: "Candidate demonstrated elite executive dealcraft and commercial mastery. Cross-track advance: Senior Product Manager Copilot Strategy & Feasibility.",
    },
    onRemediation: {
      recommendedTrack: "SALES",
      recommendedLevel: "senior",
      targetSkill: "Enterprise Contract Redlining",
      rationale: "Study enterprise MSA indemnification clauses and liability caps before leading multi-million dollar banking negotiations.",
    },
  },
};
