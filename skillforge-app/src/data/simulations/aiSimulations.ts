/**
 * SkillForge AI — AI / ML Engineer (AI) Simulation Packages
 * Tracks: Fresher, Junior, Senior
 */

import { SimulationDefinition } from "@/types/simulation";

export const AI_FRESHER_SIMULATION: SimulationDefinition = {
  id: "SIM-AI-FRE-001",
  version: "1.0.0",
  careerCode: "AI",
  level: "fresher",
  title: "Imbalanced Tabular Fraud Detection & Feature Pipeline",
  status: "active",
  roleContext: {
    roleTitle: "Junior Machine Learning Engineer",
    team: "Fraud Risk Intelligence & Modeling",
    companyContext: "Fintech payment platform processing ₹100,000,000 in credit card transactions daily.",
    reportingTo: "Lead ML Engineer (Risk)",
  },
  scenario:
    "The transaction risk engine is failing to catch fraudulent credit card charges. In the historical training dataset, fraudulent transactions represent only 0.28% of total volume (extreme class imbalance: 280 fraud cases out of 100,000 transactions). A naive baseline classifier achieved 99.72% accuracy simply by predicting 'legitimate' for every transaction, while completely missing all fraud! You must audit the feature distributions, apply resampling techniques (SMOTE / class weighting), engineer transaction velocity features, train a baseline gradient-boosted classifier, and evaluate model performance using Precision-Recall AUC and ROC-AUC.",
  businessContext:
    "Undetected chargebacks cost the platform ₹8,200,000 last month, placing our merchant acquiring status under Visa regulatory review. A model with PR-AUC > 0.82 is mandatory to pass compliance.",
  objective:
    "Preprocess imbalanced transaction data, engineer velocity and risk features, apply SMOTE / class weighting, train a classifier exceeding 0.85 ROC-AUC, and document evaluation metrics.",
  estimatedMinutes: 45,
  difficulty: "Beginner",
  prerequisites: ["Python (Pandas, Scikit-learn)", "Class imbalance techniques (SMOTE, class_weight='balanced')", "Classification metrics (ROC-AUC, Precision-Recall AUC, Confusion Matrix)"],
  learningOutcomes: [
    "Handling extreme class imbalance in tabular datasets",
    "Feature engineering (rolling velocity, transaction amount z-scores)",
    "Why accuracy is a deceptive metric for rare event detection",
    "Evaluating models via Precision-Recall AUC and F1-Beta scores",
  ],
  skills: ["Python", "Scikit-learn", "Class Imbalance", "Feature Engineering", "ROC-AUC", "Pandas"],
  materials: [
    {
      id: "mat-ai-fre-1",
      title: "Transaction Fraud Telemetry Sample (CSV)",
      type: "dataset",
      description: "Credit card transaction logs with anonymized PCA features and fraud labels.",
      filename: "creditcard_sample.csv",
      relevance: "Used in Task 1 and Task 2 to analyze class ratios and build the training pipeline.",
      content: `transaction_id,timestamp,amount,v1,v2,v3,v4,is_fraud
TXN-001,17100010,42.50,-1.35,0.82,-1.44,1.89,0
TXN-002,17100015,1250.00,2.10,-1.80,0.50,-0.90,0
TXN-003,17100021,890.00,-4.50,3.20,-5.10,4.80,1
TXN-004,17100029,15.20,0.12,0.05,0.80,0.20,0
TXN-005,17100034,920.00,-3.90,2.80,-4.60,4.20,1
TXN-006,17100040,110.00,-0.20,-0.10,0.40,0.10,0
TXN-007,17100045,65.00,0.80,-0.40,0.90,-0.30,0`,
    },
    {
      id: "mat-ai-fre-2",
      title: "Baseline Classifier Output Logs",
      type: "logs",
      description: "Evaluation output from the naive dummy classifier.",
      filename: "baseline_evaluation.log",
      relevance: "Used in Task 1 to explain the accuracy paradox.",
      content: `[INFO] Classifier: DummyClassifier(strategy='most_frequent')
[METRIC] Accuracy: 99.72%
[METRIC] True Positives: 0
[METRIC] False Negatives: 280 (100% of fraud missed!)
[METRIC] Precision: 0.00%
[METRIC] Recall: 0.00%
[METRIC] F1-Score: 0.00%
[METRIC] ROC-AUC: 0.500`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Audit Class Imbalance & The Accuracy Paradox",
      type: "investigation",
      dimension: "Evaluation Metrics & Validation",
      objective: "Explain why 99.72% accuracy is a complete failure for fraud detection.",
      context: "Examine baseline_evaluation.log against creditcard_sample.csv.",
      prompt:
        "Review baseline_evaluation.log in Materials:\n1. Explain the 'Accuracy Paradox' in rare event classification.\n2. Why is ROC-AUC of 0.50 equivalent to a coin toss, despite 99.72% accuracy?\n3. Why is Precision-Recall AUC (PR-AUC) more informative than standard ROC-AUC when positive cases are < 1% of the dataset?",
      constraints: ["Cite specific figures from the log file (99.72%, 280 false negatives, 0.50 ROC-AUC)."],
      expectedOutput: "A structured 3-point diagnostic explaining the accuracy paradox and metric selection.",
      acceptanceCriteria: [
        "Clearly explains that predicting the majority class yields high accuracy while achieving zero recall",
        "Notes that ROC-AUC evaluates true positive rate vs false positive rate, where 0.50 is random chance",
        "Explains that PR-AUC focuses specifically on the minority class without being distorted by large true negative counts",
      ],
      skills: ["Classification Metrics", "Class Imbalance", "Statistical Reasoning"],
      evidenceRequired: ["Accuracy paradox explanation", "Comparison of ROC-AUC vs PR-AUC"],
      validationRules: [
        { id: "ai-fre-t1-rule1", description: "Accuracy paradox concept", type: "document_structure", expectedSnippet: "accuracy paradox" },
        { id: "ai-fre-t1-rule2", description: "PR-AUC vs ROC-AUC distinction", type: "document_structure", expectedSnippet: "minority" },
      ],
      rubricWeight: 30,
      hints: ["When negatives are 99.72% of data, the false positive rate denominator is huge, artificially inflating standard ROC curves."],
      timeEstimateMins: 12,
    },
    {
      id: 2,
      title: "Feature Engineering & Imbalance Resampling Pipeline",
      type: "implementation",
      dimension: "Modeling Technique & Algorithms",
      objective: "Write Python Scikit-learn code for preprocessing, SMOTE / class weighting, and model training.",
      context: "Build the complete end-to-end classification pipeline in Python.",
      prompt:
        "Provide your Python code implementing the fraud classifier:\n1. Feature Engineering: Create a log-transformed amount feature and transaction velocity window.\n2. Train/Test Split: Use stratified train_test_split (stratify=y) with test_size=0.2.\n3. Resampling or Cost-Sensitive Learning: Apply imblearn SMOTE or set class_weight='balanced' in an XGBoost/RandomForest model.\n4. Output predictions and compute ROC-AUC, PR-AUC, and Confusion Matrix.",
      constraints: ["Must include stratified splitting and class weighting or SMOTE."],
      expectedOutput: "Complete, production-ready Python training script with pipeline steps.",
      acceptanceCriteria: [
        "Applies StratifiedKFold or stratified train_test_split",
        "Uses class_weight='balanced' or SMOTE without data leakage on the test set",
        "Computes average_precision_score (PR-AUC) and roc_auc_score",
      ],
      skills: ["Python", "Scikit-learn", "SMOTE", "Data Pipelines"],
      evidenceRequired: ["Python training code", "Evaluation metric computations"],
      validationRules: [
        { id: "ai-fre-t2-rule1", description: "Stratified split", type: "code_static", expectedSnippet: "stratify" },
        { id: "ai-fre-t2-rule2", description: "Class weight or SMOTE", type: "code_static", expectedSnippet: "class_weight" },
      ],
      rubricWeight: 45,
      hints: ["Never apply SMOTE on the test dataset! Only fit resamplers on the training split to prevent data leakage."],
      timeEstimateMins: 20,
    },
    {
      id: 3,
      title: "Model Card & Operational Threshold Tuning",
      type: "communication",
      dimension: "Reproducibility & Operational Clarity",
      objective: "Author a model card and recommend the decision threshold balancing fraud capture vs customer friction.",
      context: "Present your model card and threshold trade-off to the Fraud Operations team.",
      prompt:
        "Write a concise Model Card:\n1. Model Architecture & Hyperparameters.\n2. Key Performance Metrics (ROC-AUC, Precision, Recall, False Positive Rate).\n3. Threshold Recommendation: Explain why moving the classification threshold from 0.50 to 0.35 captures 18% more fraud while slightly increasing manual reviews.",
      constraints: ["Include explicit threshold tuning rationale."],
      expectedOutput: "A structured Model Card document with performance summary and threshold strategy.",
      acceptanceCriteria: [
        "Provides clear model specifications and training configuration",
        "Presents comprehensive evaluation metrics across precision, recall, and AUC",
        "Justifies threshold tuning to optimize business trade-offs (cost of missed fraud vs cost of false decline)",
      ],
      skills: ["Model Cards", "Threshold Tuning", "MLOps Documentation"],
      evidenceRequired: ["Model Card Markdown", "Threshold trade-off analysis"],
      validationRules: [
        { id: "ai-fre-t3-rule1", description: "Threshold tuning", type: "document_structure", expectedSnippet: "threshold" },
        { id: "ai-fre-t3-rule2", description: "Model Card sections", type: "document_structure", requiredSections: ["Architecture", "Metrics", "Threshold"], minWordCount: 40 },
      ],
      rubricWeight: 25,
      hints: ["In fraud, the cost of a False Negative (chargeback loss) is typically 10x higher than a False Positive (one-time SMS verification)."],
      timeEstimateMins: 13,
    },
  ],
  deliverable: {
    type: "Google Colab / GitHub Notebook URL + Evaluation Metrics Report",
    description: "Submit Colab/Jupyter notebook link containing code, plots, and model card.",
    fields: [
      { name: "notebookUrl", label: "Colab / GitHub Notebook URL", type: "url", placeholder: "https://colab.research.google.com/drive/...", required: true, helpText: "Provide link to notebook with complete pipeline and evaluation outputs." },
      { name: "notes", label: "Model Card & Evaluation Metrics Summary", type: "text", placeholder: "Document your model card, ROC-AUC score, and threshold rationale...", required: true, helpText: "Include your exact ROC-AUC, PR-AUC, and threshold recommendation." },
    ],
    validationRules: [
      { id: "deliv-ai-fre-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "modeling_technique", name: "Modeling Technique & Imbalance Handling", weight: 35, description: "Correct implementation of stratified splitting, class weighting, or SMOTE without data leakage.", criteria: ["Stratified splitting applied", "Leakage-free resampling", "Clean scikit-learn pipeline"] },
    { id: "evaluation_metrics", name: "Evaluation Metrics & Validation", weight: 35, description: "Depth of understanding regarding ROC-AUC vs PR-AUC and accuracy paradox.", criteria: ["Accurate PR-AUC computation", "Understanding of precision/recall trade-offs", "Sound threshold tuning"] },
    { id: "reproducibility", name: "Model Card & Operational Documentation", weight: 30, description: "Clarity of model card and justification of business trade-offs in fraud operations.", criteria: ["Structured model card", "Cost-weighted threshold defense"] },
  ],
  hints: ["Use `sklearn.metrics.classification_report` to view precision, recall, and f1-score across both classes."],
  progression: {
    onSuccess: {
      recommendedTrack: "AI",
      recommendedLevel: "junior",
      rationale: "Strong tabular modeling foundations. Advance to Junior: Domain LLM Fine-Tuning with LoRA & Enterprise RAG Pipeline.",
    },
    onRemediation: {
      recommendedTrack: "AI",
      recommendedLevel: "fresher",
      targetSkill: "Class Imbalance Techniques",
      rationale: "Reinforce stratified sampling and evaluation metrics before attempting vector embeddings and LLMs.",
    },
  },
};

export const AI_JUNIOR_SIMULATION: SimulationDefinition = {
  id: "SIM-AI-JUN-001",
  version: "1.0.0",
  careerCode: "AI",
  level: "junior",
  title: "Domain LLM Fine-Tuning with LoRA & Enterprise RAG Pipeline",
  status: "active",
  roleContext: {
    roleTitle: "Machine Learning Engineer (NLP / Generative AI)",
    team: "Applied GenAI & Search Intelligence",
    companyContext: "LegalTech platform providing AI-powered contract analysis for 500 law firms.",
    reportingTo: "Senior Staff AI Research Engineer",
  },
  scenario:
    "The internal Legal Assistant RAG pipeline is generating hallucinated citations and failing to retrieve relevant contract indemnification clauses. Production telemetry reveals two root causes: (1) Naive fixed-character chunking (1000 chars) splits complex legal sentences across chunks, severing semantic context; (2) Dense vector embedding cosine similarity is retrieving generic clauses while missing exact keyword nuances. You must optimize the chunking strategy to semantic paragraph boundaries, integrate a hybrid sparse-dense retriever (BM25 + Dense Qdrant vector search with reciprocal rank fusion), formulate a PEFT/LoRA fine-tuning parameter configuration, and evaluate response quality using RAG triad metrics (Faithfulness, Answer Relevance, Context Recall).",
  businessContext:
    "Two enterprise law firms threatened contract cancellation after the assistant hallucinated non-existent termination penalties. Hallucination rate must drop below 2% to pass enterprise audit.",
  objective:
    "Design a semantic chunking pipeline, implement hybrid BM25 + Dense vector retrieval with reciprocal rank fusion, configure a parameter-efficient LoRA fine-tuning script, and establish RAG triad evaluation benchmarks.",
  estimatedMinutes: 60,
  difficulty: "Intermediate",
  prerequisites: ["Vector databases (Qdrant/Pinecone/Chroma)", "RAG pipelines (LangChain/LlamaIndex)", "LoRA / PEFT concepts (Rank r, Alpha, Target modules)", "RAG Triad metrics (Faithfulness, Context Relevance)"],
  learningOutcomes: [
    "Semantic document chunking vs naive character splitting",
    "Hybrid sparse-dense retrieval and Reciprocal Rank Fusion (RRF)",
    "LoRA (Low-Rank Adaptation) hyperparameters and fine-tuning mechanics",
    "Automated RAG evaluation using LLM-as-a-judge frameworks (Ragas/TruLens)",
  ],
  skills: ["RAG Architecture", "LoRA Fine-tuning", "Vector Databases", "Hybrid Search", "RAG Evaluation (Faithfulness)"],
  materials: [
    {
      id: "mat-ai-jun-1",
      title: "Retrieval Telemetry & Hallucination Log",
      type: "logs",
      description: "Production logs capturing failed clause retrieval and hallucinated answer generation.",
      filename: "rag_telemetry_failure.log",
      relevance: "Used in Task 1 to diagnose chunk fragmentation and low semantic similarity scores.",
      content: `[QUERY] "What is the liability cap under Section 14.2 for data breaches?"
[RETRIEVAL] Chunks retrieved (Top 3 Dense Cosine):
- Chunk #891 (Score 0.71): "...shall be governed by the laws of Delaware. Section 14.2: In no event shall..." [Truncated at 1000 chars!]
- Chunk #892 (Score 0.68): "...aggregate liability exceed two times (2x) the fees paid in preceding 12 months..." [Missing section reference!]
- Chunk #412 (Score 0.64): "...indemnification for third party IP infringement under Section 12..."
[GENERATION] LLM Output: "Section 14.2 specifies that liability is unlimited for data breaches." -> [CRITICAL HALLUCINATION: Model hallucinated because Chunk #891 cut off the limitation clause!]`,
    },
    {
      id: "mat-ai-jun-2",
      title: "LoRA Configuration Specification (HuggingFace PEFT)",
      type: "config",
      description: "Baseline LoraConfig parameters for domain adaptation.",
      filename: "lora_config.py",
      relevance: "Used in Task 2 to configure parameter-efficient adapter layers.",
      content: `from peft import LoraConfig, TaskType

# Baseline config needing domain optimization
peft_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj"], # Missing k_proj, o_proj for deep reasoning
    bias="none"
)`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Diagnose Chunk Fragmentation & Hybrid Retrieval Strategy",
      type: "investigation",
      dimension: "Pipeline Architecture & Retrieval",
      objective: "Analyze why naive chunking caused the hallucination and specify hybrid search.",
      context: "Inspect rag_telemetry_failure.log in Materials.",
      prompt:
        "Review the failure log in Materials:\n1. Why did naive 1000-character chunking cause the LLM to hallucinate that liability is unlimited?\n2. Propose a semantic chunking strategy (e.g. Markdown/Header-aware chunking with recursive boundary splitting and 150-token overlap).\n3. Explain how Hybrid Search (BM25 for exact terms like 'Section 14.2' + Dense Vector for conceptual similarity) with Reciprocal Rank Fusion (RRF) prevents this retrieval failure.",
      constraints: ["Explain the Reciprocal Rank Fusion (RRF) formula: score = sum(1 / (k + rank))."],
      expectedOutput: "A structured architectural analysis detailing chunking flaws and hybrid retrieval mechanics.",
      acceptanceCriteria: [
        "Identifies that chunk boundary split the condition from the liability cap figure",
        "Proposes recursive document chunking respecting section headings with token overlap",
        "Articulates the necessity of BM25 sparse keyword matching for alphanumeric legal clause numbers",
      ],
      skills: ["RAG Architecture", "Chunking Strategies", "Hybrid Search", "Reciprocal Rank Fusion"],
      evidenceRequired: ["Chunking root cause analysis", "RRF formula and explanation"],
      validationRules: [
        { id: "ai-jun-t1-rule1", description: "Semantic chunking proposal", type: "code_static", expectedSnippet: "overlap" },
        { id: "ai-jun-t1-rule2", description: "BM25 sparse search mention", type: "code_static", expectedSnippet: "BM25" },
      ],
      rubricWeight: 35,
      hints: ["Dense embeddings often struggle with exact alphanumeric strings like '14.2(b)'; BM25 excels at exact keyword indexing."],
      timeEstimateMins: 20,
    },
    {
      id: 2,
      title: "Configure PEFT / LoRA Domain Adaptation Script",
      type: "implementation",
      dimension: "Modeling Technique & Algorithms",
      objective: "Optimize the LoRA configuration and write a PyTorch / PEFT fine-tuning setup.",
      context: "Refactor lora_config.py for legal domain reasoning.",
      prompt:
        "Optimize the LoRA configuration:\n1. Explain the role of rank (r=16 vs r=64) and alpha (scaling factor = 2 * r) on adapter capacity.\n2. Expand target_modules to include attention projection layers (q_proj, k_proj, v_proj, o_proj) and MLP gates (gate_proj, up_proj, down_proj).\n3. Provide the complete Python snippet loading a base 8-bit quantized model (BitsAndBytesConfig) and applying get_peft_model.\n4. Calculate the percentage of trainable parameters vs frozen parameters.",
      constraints: ["Must include BitsAndBytes 8-bit or 4-bit quantization config and PEFT wrapper."],
      expectedOutput: "Python script configuring BitsAndBytes quantization, LoRA parameters, and model preparation.",
      acceptanceCriteria: [
        "Expands target_modules across attention and MLP projections",
        "Sets alpha appropriately relative to rank (e.g. r=32, alpha=64)",
        "Applies prepare_model_for_kbit_training and get_peft_model",
        "Calculates trainable parameter ratio (< 2% of base model)",
      ],
      skills: ["LoRA", "PEFT", "PyTorch", "Quantization (QLoRA)"],
      evidenceRequired: ["Python PEFT configuration code", "Trainable parameter calculation"],
      validationRules: [
        { id: "ai-jun-t2-rule1", description: "LoraConfig target modules", type: "code_static", expectedSnippet: "target_modules" },
        { id: "ai-jun-t2-rule2", description: "get_peft_model invocation", type: "code_static", expectedSnippet: "get_peft_model" },
      ],
      rubricWeight: 40,
      hints: ["Targeting all linear modules (attention + MLP) yields substantially better domain adaptation than only q_proj and v_proj."],
      timeEstimateMins: 24,
    },
    {
      id: 3,
      title: "RAG Triad Evaluation Benchmark & Guardrails",
      type: "communication",
      dimension: "Evaluation Metrics & Validation",
      objective: "Formulate an automated RAG evaluation framework using RAG Triad metrics.",
      context: "Establish automated evaluation in CI/CD before deploying models to production.",
      prompt:
        "Define the RAG Triad evaluation strategy:\n1. Faithfulness: How will you measure whether claims in the generated response are grounded in the retrieved context?\n2. Context Relevance: How will you quantify signal-to-noise ratio in retrieved chunks?\n3. Answer Relevance: How will you ensure the generated response directly addresses the user query?\n4. Outline an automated synthetic test set of 50 contract questions to run against every model pull request.",
      constraints: ["Must cover all 3 components of the RAG Triad."],
      expectedOutput: "A structured evaluation framework with metric formulas and synthetic test suite design.",
      acceptanceCriteria: [
        "Defines Faithfulness, Context Relevance, and Answer Relevance clearly",
        "Outlines scoring methodology (LLM-as-a-judge or NLI entailment)",
        "Specifies automated CI/CD gating criteria (e.g. Faithfulness score > 0.95)",
      ],
      skills: ["RAG Triad", "LLM Evaluation", "MLOps", "Automated Testing"],
      evidenceRequired: ["RAG Triad methodology document", "CI/CD gating criteria"],
      validationRules: [
        { id: "ai-jun-t3-rule1", description: "Faithfulness metric", type: "document_structure", expectedSnippet: "Faithfulness" },
        { id: "ai-jun-t3-rule2", description: "RAG triad sections", type: "document_structure", requiredSections: ["Faithfulness", "Context Relevance", "Answer Relevance"], minWordCount: 45 },
      ],
      rubricWeight: 25,
      hints: ["Use Natural Language Inference (NLI) or few-shot LLM prompts to classify each sentence in the answer as entailed or ungrounded."],
      timeEstimateMins: 16,
    },
  ],
  deliverable: {
    type: "Google Colab / GitHub Notebook URL + Evaluation Metrics Report",
    description: "Submit Colab/GitHub notebook link with PEFT code, hybrid search pipeline, and RAG triad report.",
    fields: [
      { name: "notebookUrl", label: "Colab / GitHub Notebook URL", type: "url", placeholder: "https://github.com/candidate/legal-rag-peft-pipeline", required: true, helpText: "Repository containing hybrid search script and LoRA configuration." },
      { name: "notes", label: "RAG Triad Evaluation & Architecture Write-up", type: "text", placeholder: "Document your hybrid search RRF setup, LoRA parameters, and faithfulness scores...", required: true, helpText: "Include your semantic chunking parameters and RAG evaluation benchmarks." },
    ],
    validationRules: [
      { id: "deliv-ai-jun-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "pipeline_architecture", name: "Pipeline Architecture & Retrieval", weight: 35, description: "Rigor of semantic chunking and hybrid BM25 + Dense vector search with Reciprocal Rank Fusion.", criteria: ["Overlapping semantic chunking", "Sound BM25 sparse integration", "Correct RRF scoring"] },
    { id: "modeling_technique", name: "LoRA / PEFT Fine-Tuning Configuration", weight: 35, description: "Technical correctness of PEFT target modules, rank/alpha scaling, and quantization setup.", criteria: ["Comprehensive target_modules", "Proper alpha/rank ratio", "Quantization best practices"] },
    { id: "evaluation_metrics", name: "RAG Triad Evaluation & Guardrails", weight: 30, description: "Clarity of automated Faithfulness, Context Relevance, and Answer Relevance benchmarks.", criteria: ["Complete RAG triad coverage", "Actionable CI/CD gating thresholds"] },
  ],
  hints: ["Ensure that the reciprocal rank fusion parameter k is set to standard default (e.g. k=60)."],
  progression: {
    onSuccess: {
      recommendedTrack: "AI",
      recommendedLevel: "senior",
      rationale: "Candidate demonstrated deep generative AI and retrieval mastery. Advance to Senior: Production Triton Model Serving & Real-Time Drift Detection.",
    },
    onRemediation: {
      recommendedTrack: "AI",
      recommendedLevel: "junior",
      targetSkill: "RAG Retrieval & Hybrid Search",
      rationale: "Review sparse BM25 indexing and semantic chunking before progressing to distributed model serving.",
    },
  },
};

export const AI_SENIOR_SIMULATION: SimulationDefinition = {
  id: "SIM-AI-SEN-001",
  version: "1.0.0",
  careerCode: "AI",
  level: "senior",
  title: "Production Triton Model Serving & Real-Time Data Drift Guardrails",
  status: "active",
  roleContext: {
    roleTitle: "Staff MLOps & Distributed Systems Architect",
    team: "Production Inference Platform & MLOps",
    companyContext: "Autonomous logistics platform orchestrating 10,000 edge robotic delivery vehicles.",
    reportingTo: "VP of Artificial Intelligence",
  },
  scenario:
    "The real-time computer vision and trajectory prediction models deployed across our robotic fleet are violating latency SLAs during peak traffic hours. Inference latency p99 has breached the 50ms safety deadline, peaking at 142ms on NVIDIA Triton Inference Server worker nodes, triggering emergency safety halts in 18 vehicles. Concurrently, rainy weather in several deployment regions caused significant covariate shift (data drift) in input camera telemetry, causing model accuracy to degrade by 28% without triggering any automated alerts. You must architect dynamic batching and TensorRT engine optimization on Triton to achieve p99 latency < 25ms, design a real-time data drift telemetry pipeline using EvidentlyAI and Kolmogorov-Smirnov statistical tests, and establish an automated canary retraining workflow.",
  businessContext:
    "Safety halts triggered a temporary fleet suspension by city transportation authorities. Immediate restoration of p99 < 25ms and automated drift alerting is mandatory to lift the operational embargo.",
  objective:
    "Optimize NVIDIA Triton model configuration with dynamic batching and TensorRT, build a real-time covariate drift detection pipeline, and design an automated retraining canary deployment architecture.",
  estimatedMinutes: 90,
  difficulty: "Advanced",
  prerequisites: ["NVIDIA Triton Inference Server (dynamic batching, model repository)", "TensorRT optimization / ONNX runtime", "Statistical drift detection (KS-test, Population Stability Index)", "MLOps CI/CD canary automation"],
  learningOutcomes: [
    "High-throughput low-latency inference serving with NVIDIA Triton",
    "TensorRT engine profiling and dynamic batching optimization",
    "Real-time covariate and concept drift detection algorithms",
    "Automated feedback loops and canary retraining pipelines",
  ],
  skills: ["NVIDIA Triton", "TensorRT", "MLOps", "Data Drift Telemetry", "Latency Optimization", "Canary Deployments"],
  materials: [
    {
      id: "mat-ai-sen-1",
      title: "Triton Inference Telemetry & Latency Profile (Perf_Analyzer)",
      type: "logs",
      description: "Performance metrics captured under 1,500 requests/sec load test.",
      filename: "triton_perf_analyzer.log",
      relevance: "Used in Task 1 to diagnose queuing delays and compute overhead.",
      content: `[PERF] Concurrency: 64 clients
[METRIC] Request Throughput: 482 infer/sec
[METRIC] Latency p50: 22.4 ms
[METRIC] Latency p95: 78.1 ms
[METRIC] Latency p99: 142.6 ms (BREACHED SLA: Max allowable = 25.0 ms)
[BREAKDOWN]
- Client Send/Receive: 4.2 ms
- Server Queue Time: 112.8 ms (QUEUE BACKLOG BOTTLENECK!)
- Compute Forward Time: 25.6 ms
GPU Utilization (NVIDIA A10G): 42% (Underutilized due to poor batching configuration!)`,
    },
    {
      id: "mat-ai-sen-2",
      title: "Current Triton config.pbtxt",
      type: "config",
      description: "Suboptimal model configuration currently deployed on Triton.",
      filename: "config.pbtxt",
      relevance: "Used in Task 1 to implement dynamic batching and instance groups.",
      content: `name: "trajectory_predictor"
platform: "onnxruntime_onnx"
max_batch_size: 1 # Flaw: Single-item batching prevents GPU tensor core acceleration!

# Missing dynamic_batching block!
# Missing instance_group multi-model execution!`,
    },
    {
      id: "mat-ai-sen-3",
      title: "EvidentlyAI Drift Telemetry Spec",
      type: "docs",
      description: "Specification for real-time streaming feature distribution monitoring.",
      filename: "drift_telemetry_spec.md",
      relevance: "Used in Task 2 to construct the drift detection service.",
      content: `## Data Drift Standards
- Continuous Numerical Features: Apply two-sample Kolmogorov-Smirnov (KS) test with p-value threshold alpha = 0.05
- Categorical Features: Apply Population Stability Index (PSI); alert when PSI > 0.25 (significant distribution shift)
- Latency Overhead: Drift calculation must run asynchronously off the critical inference path via Kafka stream tap`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Triton Optimization: Dynamic Batching & TensorRT",
      type: "implementation",
      dimension: "Inference Latency & Efficiency",
      objective: "Refactor config.pbtxt to resolve queue backlog and achieve p99 latency < 25ms.",
      context: "Examine triton_perf_analyzer.log and config.pbtxt.",
      prompt:
        "Refactor the Triton model configuration in config.pbtxt:\n1. Set max_batch_size to 32.\n2. Configure dynamic_batching with max_queue_delay_microseconds = 2000 (2ms) and preferred_batch_size [8, 16, 32].\n3. Configure instance_group to run 2 concurrent model instances on GPU 0.\n4. Enable TensorRT acceleration (optimization: execution_accelerators with tensorrt).\n5. Explain why server queue time drops from 112ms to < 4ms with these changes.",
      constraints: ["Must include dynamic_batching and instance_group configurations in pbtxt syntax."],
      expectedOutput: "Production-ready config.pbtxt file and latency drop explanation.",
      acceptanceCriteria: [
        "Configures max_batch_size: 32 with dynamic_batching block",
        "Sets max_queue_delay_microseconds to 2000",
        "Allocates 2 instances via instance_group",
        "Enables TensorRT execution accelerator",
      ],
      skills: ["NVIDIA Triton", "TensorRT", "GPU Optimization", "Dynamic Batching"],
      evidenceRequired: ["Refactored config.pbtxt", "Queue delay elimination rationale"],
      validationRules: [
        { id: "ai-sen-t1-rule1", description: "Dynamic batching in config", type: "code_static", expectedSnippet: "dynamic_batching" },
        { id: "ai-sen-t1-rule2", description: "Instance group multi-model", type: "code_static", expectedSnippet: "instance_group" },
      ],
      rubricWeight: 35,
      hints: ["Dynamic batching groups concurrent client requests within a 2ms window into a single batch, utilizing GPU Tensor Cores fully."],
      timeEstimateMins: 25,
    },
    {
      id: 2,
      title: "Real-Time Data Drift Telemetry Engine (EvidentlyAI / KS-Test)",
      type: "implementation",
      dimension: "Pipeline Architecture & Retrieval",
      objective: "Implement the streaming drift detection service using the Kolmogorov-Smirnov test and PSI.",
      context: "Build the asynchronous telemetry worker evaluating input features.",
      prompt:
        "Write the Python drift detection worker:\n1. Consume streaming inference request payloads from a Kafka topic asynchronously (without blocking inference).\n2. Compute two-sample Kolmogorov-Smirnov (KS) test between sliding 1-hour production window and baseline training dataset.\n3. Compute Population Stability Index (PSI) on weather and lighting category distributions.\n4. Emit a Prometheus alert when KS p-value < 0.05 or PSI > 0.25.",
      constraints: ["Must include Scipy KS-test (`scipy.stats.ks_2samp`) and PSI calculation function."],
      expectedOutput: "Complete Python script for streaming drift analysis and alerting.",
      acceptanceCriteria: [
        "Uses scipy.stats.ks_2samp for numerical feature comparison",
        "Implements correct Population Stability Index formula",
        "Executes asynchronously to prevent adding latency to the critical inference path",
        "Emits structured metric alerts",
      ],
      skills: ["Data Drift", "Statistical Testing", "EvidentlyAI", "Kafka / Streaming"],
      evidenceRequired: ["Python drift detection script", "PSI calculation logic"],
      validationRules: [
        { id: "ai-sen-t2-rule1", description: "KS-2samp statistical test", type: "code_static", expectedSnippet: "ks_2samp" },
        { id: "ai-sen-t2-rule2", description: "PSI calculation", type: "code_static", expectedSnippet: "psi" },
      ],
      rubricWeight: 35,
      hints: ["PSI formula: sum((Actual% - Expected%) * ln(Actual% / Expected%))."],
      timeEstimateMins: 30,
    },
    {
      id: 3,
      title: "Automated Canary Retraining & Governance Architecture",
      type: "architecture",
      dimension: "Reproducibility & Operational Clarity",
      objective: "Architect an automated closed-loop retraining pipeline triggered by drift alerts.",
      context: "Present the end-to-end MLOps architecture to the VP of AI.",
      prompt:
        "Architect the closed-loop MLOps pipeline:\n1. Trigger: How does the Prometheus drift alert initiate automated data collection and labeling?\n2. Retraining & Evaluation: Describe model retraining with newly weighted rainy weather telemetry and automated offline benchmark comparison against production model.\n3. Canary Deployment: Outline a 3-stage canary rollout (5% shadow traffic -> 20% canary -> 100% promotion) with automated rollback on latency or accuracy regression.",
      constraints: ["Include explicit shadow/canary routing and rollback trigger rules."],
      expectedOutput: "A comprehensive MLOps architectural design and deployment specification.",
      acceptanceCriteria: [
        "Specifies automated trigger connecting drift alerts to Airflow/Kubeflow retraining DAGs",
        "Outlines offline model governance validation gates",
        "Details shadow and canary deployment strategy with objective rollback thresholds",
      ],
      skills: ["MLOps Architecture", "Canary Deployments", "Kubeflow / Airflow", "Model Governance"],
      evidenceRequired: ["Architecture design write-up", "Canary rollback thresholds"],
      validationRules: [
        { id: "ai-sen-t3-rule1", description: "Canary rollout stages", type: "document_structure", expectedSnippet: "canary" },
        { id: "ai-sen-t3-rule2", description: "Architecture sections", type: "document_structure", requiredSections: ["Trigger", "Retraining", "Canary"], minWordCount: 50 },
      ],
      rubricWeight: 30,
      hints: ["Shadow deployment pipes 100% of live traffic to the candidate model without returning its predictions to the robot, verifying latency safety risk-free."],
      timeEstimateMins: 25,
    },
  ],
  deliverable: {
    type: "Google Colab / GitHub Notebook URL + Evaluation Metrics Report",
    description: "Submit repository containing config.pbtxt, Python drift detector, and MLOps architecture memo.",
    fields: [
      { name: "notebookUrl", label: "GitHub Repository URL", type: "url", placeholder: "https://github.com/candidate/triton-drift-mlops-platform", required: true, helpText: "Repository containing config.pbtxt, drift detection scripts, and architecture docs." },
      { name: "notes", label: "MLOps Architecture & Latency Profiling Report", type: "text", placeholder: "Paste your Triton configuration rationale, KS-test code, and canary rollout design...", required: true, helpText: "Include your p99 latency reduction metrics and drift detection formulas." },
    ],
    validationRules: [
      { id: "deliv-ai-sen-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "latency_optimization", name: "Triton Configuration & GPU Optimization", weight: 35, description: "Technical correctness of dynamic batching, instance groups, and TensorRT acceleration.", criteria: ["Correct dynamic_batching syntax", "Proper instance allocation", "Sound queue delay reduction"] },
    { id: "modeling_technique", name: "Data Drift Detection & Statistical Testing", weight: 35, description: "Mathematical soundness of KS-test and PSI implementation on streaming telemetry.", criteria: ["Accurate KS-2samp application", "Correct PSI formula", "Asynchronous non-blocking architecture"] },
    { id: "reproducibility", name: "Closed-Loop MLOps Architecture & Governance", weight: 30, description: "Maturity of shadow traffic validation, canary rollout stages, and automated rollback guardrails.", criteria: ["Safe shadow deployment design", "Clear rollback metrics", "End-to-end automation"] },
  ],
  hints: ["Ensure that dynamic batching max_queue_delay does not exceed 2000 microseconds, or latency under light load will suffer."],
  progression: {
    onSuccess: {
      recommendedTrack: "CYBER",
      recommendedLevel: "senior",
      rationale: "Candidate demonstrated elite systems performance and automated monitoring. Cross-track advance: Senior Cyber Security Zero-Trust & Supply Chain Triage.",
    },
    onRemediation: {
      recommendedTrack: "AI",
      recommendedLevel: "senior",
      targetSkill: "Triton Dynamic Batching & Profiling",
      rationale: "Practice tuning Triton queue delays and TensorRT engines before deploying edge safety-critical models.",
    },
  },
};
