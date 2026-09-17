/**
 * SkillForge AI — UI / UX Designer (UX) Simulation Packages
 * Tracks: Fresher, Junior, Senior
 */

import { SimulationDefinition } from "@/types/simulation";

export const UX_FRESHER_SIMULATION: SimulationDefinition = {
  id: "SIM-UX-FRE-001",
  version: "1.0.0",
  careerCode: "UX",
  level: "fresher",
  title: "Mobile Onboarding Flow & WCAG 2.1 AA Accessibility Overhaul",
  status: "active",
  roleContext: {
    roleTitle: "Associate Product Designer",
    team: "Consumer Mobile Experience",
    companyContext: "Fintech mobile wallet with 500,000 active Gen-Z and elderly users.",
    reportingTo: "Lead Product Designer",
  },
  scenario:
    "An accessibility audit revealed that the mobile onboarding flow violates WCAG 2.1 AA standards. Low-contrast placeholder text (#A0AEC0 on #FFFFFF = 2.4:1 contrast) fails the 4.5:1 ratio, touch targets for checkbox agreements are only 24x24px (violating the 48x48px minimum), and form error states rely solely on red border color without screen-reader accessible helper text. Your task is to audit the current screen flows, define a compliant semantic color token system, redesign the mobile registration form with accessible micro-copy, and provide an annotated design rationale.",
  businessContext:
    "18% of mobile onboarding users abandon registration on Screen 2. Compliance with European Accessibility Act (EAA) and ADA standards is legally mandatory prior to the upcoming quarter.",
  objective:
    "Audit accessibility violations, construct a WCAG 2.1 AA compliant color token matrix, redesign the 3-step registration flow, and document design decisions.",
  estimatedMinutes: 45,
  difficulty: "Beginner",
  prerequisites: ["Figma basics", "WCAG 2.1 contrast ratios (4.5:1 normal, 3:1 non-text)", "Mobile touch target ergonomics"],
  learningOutcomes: [
    "WCAG 2.1 AA accessibility auditing and contrast calculation",
    "Semantic design token structuring (surface, text, action, border)",
    "Designing accessible form validation micro-interactions",
    "Communicating user experience rationale to developers",
  ],
  skills: ["Figma", "Accessibility (WCAG 2.1 AA)", "Design Tokens", "Mobile UX", "Form Design"],
  materials: [
    {
      id: "mat-ux-fre-1",
      title: "Accessibility Audit Report (Screen 2: Registration Form)",
      type: "docs",
      description: "Automated Axe & manual heuristic audit findings on current mobile signup screen.",
      filename: "accessibility_audit_screen2.md",
      relevance: "Used in Task 1 to catalog all WCAG failures.",
      content: `## Axe-Core Accessibility Audit: Signup Form
1. Issue: Contrast ratio for placeholder text '#A0AEC0' on background '#FFFFFF' is 2.4:1. Fails WCAG 1.4.3 (Minimum 4.5:1).
2. Issue: 'Terms & Conditions' checkbox touch target is 24x24px. Fails WCAG 2.5.5 (Target Size minimum 44x44px / Android 48x48px).
3. Issue: Error state on invalid email changes border to #E53E3E with no error icon or persistent text message. Fails WCAG 1.4.1 (Use of Color).
4. Issue: Form input fields lack explicit aria-describedby linkage to validation error messages.`,
    },
    {
      id: "mat-ux-fre-2",
      title: "Draft Design Tokens (JSON Schema)",
      type: "config",
      description: "Proposed semantic color and typography token definitions.",
      filename: "tokens.json",
      relevance: "Used in Task 2 to correct contrast tokens and surface mappings.",
      content: `{
  "color": {
    "surface": { "canvas": "#FFFFFF", "card": "#F8FAFC", "overlay": "rgba(15, 23, 42, 0.6)" },
    "text": { "primary": "#0F172A", "secondary": "#475569", "placeholder": "#64748B", "inverse": "#FFFFFF" },
    "interactive": { "primary": "#4F46E5", "primaryHover": "#4338CA", "disabled": "#CBD5E1" },
    "feedback": { "error": "#DC2626", "errorBg": "#FEF2F2", "success": "#16A34A" }
  },
  "spacing": { "touchMin": "48px", "inputPadding": "14px 16px" }
}`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "WCAG 2.1 AA Heuristic Audit Breakdown",
      type: "investigation",
      dimension: "Accessibility & WCAG Compliance",
      objective: "Catalog all 4 accessibility failures and specify required remediation criteria.",
      context: "Review accessibility_audit_screen2.md in Materials.",
      prompt:
        "For each of the 4 issues in the audit report:\n1. State the exact WCAG guideline number (e.g. 1.4.3, 1.4.1).\n2. Explain why the current implementation fails real users (e.g. elderly users with low visual acuity, motor impairments, color blindness).\n3. Provide the precise technical specification for remediation (contrast ratio, pixel dimensions, multi-modal feedback).",
      constraints: ["Cite exact contrast ratios (4.5:1) and touch dimensions (48px)."],
      expectedOutput: "A structured 4-part accessibility remediation specification.",
      acceptanceCriteria: [
        "Identifies 1.4.3 (Contrast), 2.5.5 (Target size), 1.4.1 (Use of color), 1.3.1 (Info and relationships)",
        "Explains cognitive and physical impact on disabled users",
        "Mandates 4.5:1 minimum contrast and 48x48px touch boundaries",
      ],
      skills: ["WCAG 2.1 AA", "Accessibility Auditing", "Assistive Technology"],
      evidenceRequired: ["Audit table mapping violations to WCAG criteria", "Remediation specifications"],
      validationRules: [
        { id: "ux-fre-t1-rule1", description: "Contrast ratio check", type: "design_checklist", expectedSnippet: "4.5:1" },
        { id: "ux-fre-t1-rule2", description: "Touch target check", type: "design_checklist", expectedSnippet: "48" },
      ],
      rubricWeight: 30,
      hints: ["WCAG 1.4.1 requires that color is not used as the sole visual means of conveying an error state."],
      timeEstimateMins: 12,
    },
    {
      id: 2,
      title: "Design Token Architecture & Semantic Mapping",
      type: "implementation",
      dimension: "Design System Architecture & Tokens",
      objective: "Refactor tokens.json to guarantee strict contrast compliance across light and dark modes.",
      context: "Inspect tokens.json and verify contrast mathematics.",
      prompt:
        "Refactor the color tokens:\n1. Prove mathematically that text.placeholder (#64748B on #FFFFFF = 4.6:1) passes WCAG AA.\n2. Add semantic tokens for error states (feedback.errorText, feedback.errorBorder, feedback.errorSurface).\n3. Ensure action button tokens maintain 48px minimum touch padding.\n4. Output your corrected JSON token structure.",
      constraints: ["Must maintain valid JSON syntax with semantic naming conventions."],
      expectedOutput: "Complete, valid JSON token schema with verified contrast values.",
      acceptanceCriteria: [
        "Provides validated token JSON with text, surface, feedback, and interactive tokens",
        "Verifies placeholder contrast >= 4.5:1 against canvas",
        "Includes explicit 48px touch minimums",
      ],
      skills: ["Design Tokens", "Color Science", "JSON Token Architecture"],
      evidenceRequired: ["Valid JSON token file", "Contrast calculations"],
      validationRules: [
        { id: "ux-fre-t2-rule1", description: "Placeholder token", type: "design_checklist", expectedSnippet: "placeholder" },
        { id: "ux-fre-t2-rule2", description: "Touch min token", type: "design_checklist", expectedSnippet: "48px" },
      ],
      rubricWeight: 40,
      hints: ["Color #64748B on #FFFFFF yields a 4.6:1 ratio, just exceeding the 4.5:1 threshold."],
      timeEstimateMins: 20,
    },
    {
      id: 3,
      title: "Figma Flow Prototype & Annotated Design Rationale",
      type: "communication",
      dimension: "Annotated Design Rationale",
      objective: "Deliver a Figma prototype URL or wireframe breakdown with design justification.",
      context: "Present your onboarding redesign for design review.",
      prompt:
        "Provide your Figma Prototype URL and author an annotated design rationale:\n1. Describe the 3-step progressive disclosure flow (Account Credentials -> Phone Verification -> Preferences).\n2. Detail the error validation interaction (inline alert icon + descriptive text + aria announcer).\n3. Explain how the redesigned flow reduces user drop-off while ensuring 100% WCAG AA compliance.",
      constraints: ["Provide a clean Figma link and structured markdown rationale."],
      expectedOutput: "Figma link and 3-point UX rationale document.",
      acceptanceCriteria: [
        "Includes Figma URL (or high-fidelity wireframe specification)",
        "Explains progressive disclosure and form ergonomics",
        "Details multi-modal error feedback (color + icon + text)",
      ],
      skills: ["Figma Prototyping", "Interaction Design", "Design Rationale"],
      evidenceRequired: ["Figma URL", "Design rationale text"],
      validationRules: [
        { id: "ux-fre-t3-rule1", description: "Figma URL or link", type: "code_static", expectedSnippet: "figma.com" },
        { id: "ux-fre-t3-rule2", description: "Structured rationale sections", type: "document_structure", requiredSections: ["Progressive", "Error", "Drop-off"], minWordCount: 40 },
      ],
      rubricWeight: 30,
      hints: ["Progressive disclosure divides lengthy forms into digestible steps, reducing cognitive load."],
      timeEstimateMins: 13,
    },
  ],
  deliverable: {
    type: "Figma Prototype URL + Design Rationale & Assets Upload",
    description: "Submit Figma link and comprehensive accessibility design rationale.",
    fields: [
      { name: "figmaUrl", label: "Figma Prototype URL", type: "url", placeholder: "https://www.figma.com/file/...", required: true, helpText: "Link to your Figma prototype or component library." },
      { name: "notes", label: "Design Rationale & WCAG Compliance Notes", type: "text", placeholder: "Document your token contrast calculations and UX rationale...", required: true, helpText: "Include your contrast ratios and progressive disclosure steps." },
    ],
    validationRules: [
      { id: "deliv-ux-fre-1", description: "Figma URL", type: "code_static", expectedSnippet: "figma.com" },
    ],
  },
  rubric: [
    { id: "accessibility", name: "Accessibility & WCAG Compliance", weight: 35, description: "Precision in adhering to WCAG 2.1 AA standards (contrast, touch targets, error states).", criteria: ["Strict 4.5:1 text contrast", "48px touch boundaries", "Multi-modal error feedback"] },
    { id: "design_system", name: "Design System Architecture & Tokens", weight: 35, description: "Quality, naming hierarchy, and modularity of JSON semantic design tokens.", criteria: ["Semantic token structure", "Scalable light/dark surface tokens", "Consistent spacing tokens"] },
    { id: "interaction_design", name: "Interaction Design & Rationale", weight: 30, description: "Usability of mobile onboarding flow and clarity of annotated design rationale.", criteria: ["Progressive disclosure", "Accessible form micro-copy", "Clear design justification"] },
  ],
  hints: ["Never use raw hex colors in component specs; always reference semantic token aliases like `color.text.placeholder`."],
  progression: {
    onSuccess: {
      recommendedTrack: "UX",
      recommendedLevel: "junior",
      rationale: "Candidate demonstrated strong accessibility foundations. Advance to Junior: B2B SaaS Analytics Grid & Modular Design System.",
    },
    onRemediation: {
      recommendedTrack: "UX",
      recommendedLevel: "fresher",
      targetSkill: "WCAG Accessibility Standards",
      rationale: "Practice calculating contrast ratios and ergonomic touch targets before tackling complex enterprise grids.",
    },
  },
};

export const UX_JUNIOR_SIMULATION: SimulationDefinition = {
  id: "SIM-UX-JUN-001",
  version: "1.0.0",
  careerCode: "UX",
  level: "junior",
  title: "B2B SaaS Analytics Grid & Modular Design System",
  status: "active",
  roleContext: {
    roleTitle: "Product Designer",
    team: "Enterprise Operations & Core Web",
    companyContext: "Cloud observability platform used by 20,000 DevOps and SRE engineers.",
    reportingTo: "Senior Design Systems Manager",
  },
  scenario:
    "Enterprise users are experiencing cognitive overload and navigation friction in the server monitoring data table. The table displays 35 unstructured columns without column toggling or density modes, the slide-over filter drawer covers the primary telemetry graphs, and status badge colors are inconsistent across microservices. SRE users need to quickly triage incidents under extreme time pressure. You must design a high-density, responsive data grid, architect a slide-over filter panel that preserves graph visibility, standardize component status tokens, and deliver a usability heuristic evaluation.",
  businessContext:
    "Enterprise Net Promoter Score (NPS) among power users dropped from +54 to +28 due to table clutter. Improving SRE triage speed by 30% is a key OKR for the enterprise tier.",
  objective:
    "Design a modular, high-density data grid with multi-column filtering, architect a slide-over drawer that preserves dashboard context, establish a status badge token system, and document heuristic rationale.",
  estimatedMinutes: 60,
  difficulty: "Intermediate",
  prerequisites: ["Design systems in Figma (Auto Layout 5.0, Variables)", "High-density data visualization principles", "Nielsen-Norman Usability Heuristics"],
  learningOutcomes: [
    "High-density enterprise data table design with configurable columns",
    "Slide-over sheet and overlay interaction patterns",
    "Status token semantics (info, success, warning, error, neutral)",
    "Heuristic evaluation of enterprise dashboards",
  ],
  skills: ["Design Systems", "Figma Auto Layout", "Data Grid UX", "Information Architecture", "Heuristic Evaluation"],
  materials: [
    {
      id: "mat-ux-jun-1",
      title: "User Interview Insights: Enterprise SRE Power Users",
      type: "docs",
      description: "Synthesis of 12 qualitative interviews with SRE leads during incident response.",
      filename: "sre_user_interviews_summary.md",
      relevance: "Used in Task 1 and Task 3 to address specific user friction points.",
      content: `## SRE Feedback Summary
1. "When an incident fires at 3 AM, I need to see Hostname, Error Rate, and P99 Latency immediately. Right now I have to scroll horizontally past 14 metadata columns."
2. "Opening the filter sheet blinds me to the active latency graph. I need to filter by Region and Environment while watching the chart update in real time."
3. "Some badges use blue for 'Degraded' while others use yellow. In an incident, color confusion wastes minutes."
4. "We need a compact density mode so we can view 30 servers on a 1080p screen without vertical paging."`,
    },
    {
      id: "mat-ux-jun-2",
      title: "Component Token Schema (Data Grid & Badges)",
      type: "config",
      description: "Figma variable schema for component-level token mappings.",
      filename: "grid_component_tokens.json",
      relevance: "Used in Task 2 to build the token architecture.",
      content: `{
  "component": {
    "dataGrid": {
      "rowHeight": { "compact": "32px", "default": "44px", "spacious": "56px" },
      "cellPadding": { "compact": "6px 10px", "default": "10px 16px" },
      "headerBackground": "var(--color-surface-subtle)",
      "border": "1px solid var(--color-border-subtle)"
    },
    "badge": {
      "operational": { "background": "#ECFDF5", "text": "#065F46", "border": "#A7F3D0" },
      "degraded": { "background": "#FFFBEB", "text": "#92400E", "border": "#FDE68A" },
      "critical": { "background": "#FEF2F2", "text": "#991B1B", "border": "#FECACA" }
    }
  }
}`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Heuristic Usability Evaluation & Information Architecture",
      type: "investigation",
      dimension: "Visual Hierarchy & Information Flow",
      objective: "Evaluate the current dashboard against Nielsen's 10 Heuristics.",
      context: "Review sre_user_interviews_summary.md in Materials.",
      prompt:
        "Conduct a heuristic evaluation addressing the 4 SRE pain points:\n1. Map each pain point to a Nielsen Heuristic (e.g. Recognition rather than recall, Flexibility and efficiency of use, Consistency and standards).\n2. Specify the information architecture for the revised table (Pinned columns, default visible columns, customizable column drawer).\n3. Outline the layout strategy allowing filter adjustments while keeping telemetry charts visible.",
      constraints: ["Cite specific Nielsen heuristics and SRE interview feedback."],
      expectedOutput: "A structured heuristic audit and proposed table information architecture.",
      acceptanceCriteria: [
        "Maps table clutter to 'Flexibility and efficiency of use' and 'Aesthetic and minimalist design'",
        "Maps badge inconsistency to 'Consistency and standards'",
        "Proposes pinned primary key columns and side-by-side or persistent filter dock",
      ],
      skills: ["Heuristic Evaluation", "Information Architecture", "UX Research"],
      evidenceRequired: ["Heuristic evaluation table", "Column hierarchy specification"],
      validationRules: [
        { id: "ux-jun-t1-rule1", description: "Heuristic citation", type: "document_structure", expectedSnippet: "Consistency" },
        { id: "ux-jun-t1-rule2", description: "Pinned column strategy", type: "document_structure", expectedSnippet: "pinned" },
      ],
      rubricWeight: 30,
      hints: ["Pinning Hostname and Status on the left while enabling horizontal scroll for secondary metrics solves cognitive overload."],
      timeEstimateMins: 18,
    },
    {
      id: 2,
      title: "Design System Token Architecture & Component States",
      type: "implementation",
      dimension: "Design System Architecture & Tokens",
      objective: "Construct the modular token system for grid density, cell typography, and status badges.",
      context: "Expand grid_component_tokens.json with interactive states.",
      prompt:
        "Provide your completed component token specification in JSON:\n1. Define 3 density modes (compact: 32px, default: 44px, comfortable: 56px).\n2. Establish standardized semantic tokens for badge states: operational (green), degraded (amber), critical (red), maintenance (blue), unknown (gray).\n3. Ensure all badge text-to-background combinations achieve WCAG AA >= 4.5:1 contrast.\n4. Include hover, active, and selected row states for the data grid.",
      constraints: ["Provide valid JSON with structured tokens for all 5 badge states."],
      expectedOutput: "Complete, production-ready JSON component token definition.",
      acceptanceCriteria: [
        "Defines compact (32px), default (44px), comfortable (56px) density tokens",
        "Includes complete 5-state badge color tokens with verified contrast",
        "Specifies interactive row hover, focus, and selection tokens",
      ],
      skills: ["Design Tokens", "Design System Architecture", "WCAG Contrast"],
      evidenceRequired: ["Component tokens JSON", "Contrast ratio verifications"],
      validationRules: [
        { id: "ux-jun-t2-rule1", description: "Density modes in tokens", type: "design_checklist", expectedSnippet: "compact" },
        { id: "ux-jun-t2-rule2", description: "Badge states in tokens", type: "design_checklist", expectedSnippet: "degraded" },
      ],
      rubricWeight: 40,
      hints: ["Use semi-transparent tint backgrounds (e.g. 10% opacity) with dark saturated text to guarantee high contrast."],
      timeEstimateMins: 24,
    },
    {
      id: 3,
      title: "Figma Prototype URL & Interaction Specification",
      type: "communication",
      dimension: "Annotated Design Rationale",
      objective: "Deliver the interactive Figma prototype and handoff documentation for frontend engineers.",
      context: "Provide developer-ready specifications for implementation in React.",
      prompt:
        "Provide your Figma Prototype URL and author engineering handoff notes:\n1. Column customization interaction (drag-and-drop reorder, visibility toggling).\n2. Filter drawer behavior (overlay vs dock-split-screen with live chart reflow).\n3. Keyboard navigation accessibility (Tab through rows, Arrow keys through cells, Space to select).",
      constraints: ["Provide a clean Figma link and structured engineer handoff notes."],
      expectedOutput: "Figma URL and engineering handoff interaction specification.",
      acceptanceCriteria: [
        "Includes Figma URL (or high-fidelity wireframe specification)",
        "Details dock-split-screen behavior that avoids obscuring charts",
        "Defines keyboard accessibility specifications (ARIA Grid pattern)",
      ],
      skills: ["Design Handoff", "Keyboard Accessibility", "Interaction Design"],
      evidenceRequired: ["Figma URL", "Handoff documentation"],
      validationRules: [
        { id: "ux-jun-t3-rule1", description: "Figma URL", type: "code_static", expectedSnippet: "figma.com" },
        { id: "ux-jun-t3-rule2", description: "Handoff sections", type: "document_structure", requiredSections: ["Column", "Filter", "Keyboard"], minWordCount: 40 },
      ],
      rubricWeight: 30,
      hints: ["The W3C ARIA Grid pattern requires roving tabindex or aria-activedescendant for accessible cell navigation."],
      timeEstimateMins: 18,
    },
  ],
  deliverable: {
    type: "Figma Prototype URL + Design Rationale & Assets Upload",
    description: "Submit Figma prototype link and comprehensive design system handoff notes.",
    fields: [
      { name: "figmaUrl", label: "Figma Prototype URL", type: "url", placeholder: "https://www.figma.com/file/...", required: true, helpText: "Link to your Figma data grid prototype and component tokens." },
      { name: "notes", label: "Design System Handoff & Heuristic Rationale", type: "text", placeholder: "Paste your component token JSON, heuristic evaluation, and engineering specs...", required: true, helpText: "Include your density mode specifications and keyboard navigation rules." },
    ],
    validationRules: [
      { id: "deliv-ux-jun-1", description: "Figma URL", type: "code_static", expectedSnippet: "figma.com" },
    ],
  },
  rubric: [
    { id: "design_system", name: "Design System Architecture & Tokens", weight: 35, description: "Scalability, semantic depth, and rigor of grid and badge component tokens.", criteria: ["Multi-density modes configured", "WCAG AA contrast verified on all badges", "Clean component token hierarchy"] },
    { id: "interaction_design", name: "Interaction Design & Ergonomics", weight: 35, description: "Usability of data grid under SRE incident pressure and non-intrusive filter drawer.", criteria: ["Context preservation for live graphs", "Pinned column clarity", "Keyboard accessibility specification"] },
    { id: "visual_hierarchy", name: "Visual Hierarchy & Heuristic Defense", weight: 30, description: "Depth of heuristic evaluation and clarity of engineering handoff notes.", criteria: ["Accurate heuristic mapping", "Clear developer handoff documentation"] },
  ],
  hints: ["Ensure that the filter drawer can be docked to the right side, shrinking the data grid width smoothly via CSS flexbox."],
  progression: {
    onSuccess: {
      recommendedTrack: "UX",
      recommendedLevel: "senior",
      rationale: "Candidate demonstrated excellent enterprise design system craftsmanship. Advance to Senior: Multi-Tenant Enterprise Permissioning & Global Token Architecture.",
    },
    onRemediation: {
      recommendedTrack: "UX",
      recommendedLevel: "junior",
      targetSkill: "Enterprise Data Grid Design",
      rationale: "Practice high-density information layout and token variables before designing multi-tenant systems.",
    },
  },
};

export const UX_SENIOR_SIMULATION: SimulationDefinition = {
  id: "SIM-UX-SEN-001",
  version: "1.0.0",
  careerCode: "UX",
  level: "senior",
  title: "Multi-Tenant Enterprise Permissioning Architecture & Cross-Platform Token Engine",
  status: "active",
  roleContext: {
    roleTitle: "Principal Product Design Architect",
    team: "Global Design Platform & Enterprise Core",
    companyContext: "Fortune 500 SaaS platform supporting 45 global enterprise sub-brands across Web, iOS, and Android.",
    reportingTo: "Chief Design Officer (CDO) & VP of Product",
  },
  scenario:
    "The enterprise platform is migrating to a multi-tenant Role-Based Access Control (RBAC) architecture. Global enterprise customers manage complex organizational hierarchies: regional admins, compliance auditors, department leads, and external contractors with granular resource permissions. Current administration UI is fragmented: permissions are toggled in unstructured checkbox lists that fail compliance audits, and brand tokens cannot be dynamically customized per enterprise tenant without manual CSS overrides. You must architect an intuitive enterprise RBAC permissioning matrix UI, design a scalable multi-tier design token engine (Global -> Semantic -> Component -> Tenant Overrides) compatible with Figma Variables and Style Dictionary, and formulate a design system governance and engineering handoff strategy.",
  businessContext:
    "Inability to support white-label tenant theming and SOC-2 compliant permissioning audits is blocking ₹85,000,000 in Tier-1 enterprise deals.",
  objective:
    "Architect an enterprise RBAC permissioning matrix UI, build a 4-tier cross-platform design token engine, establish design system governance workflows, and defend decisions in an executive presentation.",
  estimatedMinutes: 90,
  difficulty: "Advanced",
  prerequisites: ["Enterprise RBAC concepts (Inheritance, Overrides, Scopes)", "Style Dictionary & W3C DTCG Token Specifications", "Cross-Platform Design System Governance"],
  learningOutcomes: [
    "Complex enterprise permission matrix and RBAC inheritance UX",
    "Multi-brand cross-platform token engine architecture (W3C DTCG compliant)",
    "Design system contribution workflows and token versioning",
    "Executive design leadership and enterprise sales enablement",
  ],
  skills: ["Enterprise RBAC UX", "Design Token Engine (DTCG)", "Multi-Brand Systems", "Style Dictionary", "Design Governance"],
  materials: [
    {
      id: "mat-ux-sen-1",
      title: "Enterprise Permissioning Matrix Requirements (SOC-2 Compliance)",
      type: "docs",
      description: "Regulatory and security requirements for enterprise access control management.",
      filename: "rbac_enterprise_requirements.md",
      relevance: "Used in Task 1 to architect the role inheritance and permissioning UI.",
      content: `## SOC-2 Enterprise RBAC Mandates
1. Role Hierarchy & Inheritance: Sub-roles (e.g. 'Regional Billing Auditor') must visibly inherit from parent roles ('Finance Lead'), with explicit visual overrides.
2. Effective Permissions Preview: Administrators must be able to 'Simulate User Permissions' to inspect exactly what a specific employee can view/edit before saving changes.
3. Separation of Duties: Critical operations (e.g. Wire Transfer Approval, Data Deletion) require dual-custody authorization states in the UI.
4. Audit Trail: Every permission change must generate an immediate visual diff preview (What was added / what was revoked).`,
    },
    {
      id: "mat-ux-sen-2",
      title: "Cross-Platform Token Engine Architecture Spec (W3C DTCG)",
      type: "config",
      description: "Proposed 4-layer design token schema for Style Dictionary export to Web, iOS, and Android.",
      filename: "token_architecture_4layer.json",
      relevance: "Used in Task 2 to build the token hierarchy.",
      content: `{
  "layers": {
    "layer1_global": { "blue_500": "#3B82F6", "blue_600": "#2563EB", "gray_900": "#0F172A" },
    "layer2_semantic": { "color_brand_primary": "{blue_500}", "color_surface_canvas": "{gray_900}" },
    "layer3_component": { "button_primary_bg": "{color_brand_primary}", "button_primary_text": "#FFFFFF" },
    "layer4_tenant_override": { "tenant_acme_corp": { "color_brand_primary": "#E11D48" } }
  }
}`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Architect Enterprise RBAC Permissioning Matrix UI",
      type: "architecture",
      dimension: "Interaction Design & Usability",
      objective: "Design an intuitive matrix UI for managing hierarchical enterprise permissions with visual inheritance.",
      context: "Satisfy all 4 SOC-2 requirements in rbac_enterprise_requirements.md.",
      prompt:
        "Architect the enterprise permission management experience:\n1. Permission Matrix Layout: How will you organize 60+ granular permissions across 8 functional modules (Billing, Security, Storage, APIs) without visual clutter?\n2. Role Inheritance & Overrides: How will the UI visually distinguish between an 'Inherited Permission' (gray lock icon) vs an 'Explicit Override' (accent pill)?\n3. Effective Permissions Simulator: Design the interactive flow where an admin searches for a user and previews their combined effective permissions.\n4. Change Diff Preview: How does the UI display pending permission additions and revocations before final commit?",
      constraints: ["Address all 4 SOC-2 compliance mandates explicitly."],
      expectedOutput: "A detailed UX architecture specification for the enterprise RBAC system.",
      acceptanceCriteria: [
        "Articulates a clear matrix layout with module grouping and bulk actions",
        "Provides unambiguous visual language for inherited vs overridden permissions",
        "Designs an effective permission simulation view",
        "Includes a pre-commit diff review modal or drawer",
      ],
      skills: ["Enterprise UX", "RBAC Architecture", "Information Architecture"],
      evidenceRequired: ["Matrix layout specification", "Inheritance visual rules", "Simulator flow"],
      validationRules: [
        { id: "ux-sen-t1-rule1", description: "Inheritance visual rules", type: "document_structure", expectedSnippet: "inherit" },
        { id: "ux-sen-t1-rule2", description: "Diff or simulation flow", type: "document_structure", expectedSnippet: "simulate" },
      ],
      rubricWeight: 35,
      hints: ["Use an expandable accordion matrix grouped by service module with a floating bulk-action bar."],
      timeEstimateMins: 25,
    },
    {
      id: 2,
      title: "Build 4-Tier Cross-Platform Design Token Engine",
      type: "implementation",
      dimension: "Design System Architecture & Tokens",
      objective: "Formalize the W3C DTCG compliant multi-brand token schema for Web, iOS, and Android.",
      context: "Implement the token hierarchy in token_architecture_4layer.json.",
      prompt:
        "Formulate the complete 4-tier token schema:\n1. Define the relationship: Global (Raw values) -> Semantic (Intent) -> Component (Scoped) -> Tenant Theme Overrides.\n2. Provide production-ready JSON syntax complying with the W3C Design Tokens Community Group (DTCG) standard (using $value and $type attributes).\n3. Explain how Style Dictionary transforms this single source of truth into CSS Variables, iOS Swift Enums, and Android Compose XML.\n4. Demonstrate a multi-brand tenant override for an enterprise client with custom brand colors and dark-mode surfaces.",
      constraints: ["JSON must follow W3C DTCG format ($value, $type)."],
      expectedOutput: "Valid W3C DTCG compliant JSON token file and multi-platform compilation explanation.",
      acceptanceCriteria: [
        "Demonstrates complete 4-tier token hierarchy",
        "Adheres strictly to W3C DTCG syntax with $value and $type",
        "Explains compilation pipeline to CSS, Swift, and Jetpack Compose",
        "Shows functional multi-tenant theme override block",
      ],
      skills: ["Design Tokens (W3C DTCG)", "Style Dictionary", "Cross-Platform Systems"],
      evidenceRequired: ["W3C compliant token JSON", "Compilation pipeline documentation"],
      validationRules: [
        { id: "ux-sen-t2-rule1", description: "W3C DTCG $value syntax", type: "design_checklist", expectedSnippet: "$value" },
        { id: "ux-sen-t2-rule2", description: "Tenant override tier", type: "design_checklist", expectedSnippet: "tenant" },
      ],
      rubricWeight: 40,
      hints: ["The W3C spec uses `$value: '{color.brand.primary}'` to reference semantic alias tokens."],
      timeEstimateMins: 35,
    },
    {
      id: 3,
      title: "Design System Governance, Versioning & Executive Strategy",
      type: "communication",
      dimension: "Annotated Design Rationale",
      objective: "Formulate a design system contribution model, semantic versioning policy, and executive presentation.",
      context: "Present to the Chief Design Officer and Engineering Architecture Board.",
      prompt:
        "Draft the enterprise design system governance strategy:\n1. Contribution & Review Workflow: How do 8 product teams propose new tokens or component variants without fragmenting the core library?\n2. Semantic Versioning & Deprecation: Define SemVer rules for token breaking changes (Major: token removal; Minor: new token; Patch: value adjustment).\n3. Executive Business Rationale: Frame the ROI of this token engine for enterprise sales (speed-to-market for white-label tenants, compliance audit readiness).",
      constraints: ["Include explicit SemVer definitions for design tokens."],
      expectedOutput: "A formal design governance framework and executive pitch.",
      acceptanceCriteria: [
        "Defines clear RFC contribution process for federated design teams",
        "Outlines precise SemVer rules for design token updates",
        "Quantifies enterprise sales velocity and compliance ROI",
      ],
      skills: ["Design System Governance", "Semantic Versioning", "Executive Leadership"],
      evidenceRequired: ["Governance framework", "SemVer token rules", "Executive ROI argument"],
      validationRules: [
        { id: "ux-sen-t3-rule1", description: "SemVer token rules", type: "document_structure", expectedSnippet: "SemVer" },
        { id: "ux-sen-t3-rule2", description: "Governance sections", type: "document_structure", requiredSections: ["Contribution", "Versioning", "Executive"], minWordCount: 50 },
      ],
      rubricWeight: 25,
      hints: ["Treat tokens exactly like software APIs: never delete a token in a minor release; mark it with a `$deprecated` property first."],
      timeEstimateMins: 30,
    },
  ],
  deliverable: {
    type: "Figma Prototype URL + Design Rationale & Assets Upload",
    description: "Submit Figma link with enterprise RBAC matrix, token schema, and governance framework.",
    fields: [
      { name: "figmaUrl", label: "Figma Prototype URL", type: "url", placeholder: "https://www.figma.com/file/...", required: true, helpText: "Link to your enterprise RBAC prototype and design system token variables." },
      { name: "notes", label: "Token Engine Schema & Governance Strategy", type: "text", placeholder: "Paste your W3C DTCG token schema, SemVer rules, and RBAC UX specifications...", required: true, helpText: "Include your 4-tier token hierarchy and SOC-2 compliance workflows." },
    ],
    validationRules: [
      { id: "deliv-ux-sen-1", description: "Figma URL", type: "code_static", expectedSnippet: "figma.com" },
    ],
  },
  rubric: [
    { id: "design_system", name: "Design Token Engine & W3C DTCG Architecture", weight: 40, description: "Technical rigor of 4-tier token engine, W3C compliance, and Style Dictionary integration.", criteria: ["Valid W3C DTCG syntax", "Clean 4-tier hierarchy", "Robust multi-tenant override model"] },
    { id: "interaction_design", name: "Enterprise RBAC UX & SOC-2 Compliance", weight: 35, description: "Elegance of complex permission matrix, visual inheritance clarity, and simulation flow.", criteria: ["Unambiguous inheritance states", "Effective permissions simulator", "Pre-commit diff review"] },
    { id: "visual_hierarchy", name: "Design Governance & Executive Communication", weight: 25, description: "Maturity of federated contribution model, SemVer token rules, and enterprise sales ROI.", criteria: ["Actionable contribution RFC process", "Sound SemVer rules", "Compelling business case"] },
  ],
  hints: ["Ensure that the tenant override tier only overrides semantic tokens (like primary color), never component structure."],
  progression: {
    onSuccess: {
      recommendedTrack: "PM",
      recommendedLevel: "senior",
      rationale: "Candidate demonstrated world-class enterprise architecture and governance. Cross-track advance: Senior Product Manager Copilot Strategy & Feasibility.",
    },
    onRemediation: {
      recommendedTrack: "UX",
      recommendedLevel: "senior",
      targetSkill: "Enterprise Token Architecture",
      rationale: "Study W3C DTCG design token specifications and Style Dictionary transforms before leading enterprise design platforms.",
    },
  },
};
