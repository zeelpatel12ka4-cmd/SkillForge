import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface JobListing {
  id: string | number;
  title: string;
  company: string;
  location: string;
  salary: string;
  track: string;
  code: string;
  dept: string;
  experienceLevel: string;
  simRequired: string;
  minScore: number;
  candidateScore?: number;
  tags: string[];
  description: string;
  status: "Active" | "Closed";
  posted: string;
  candidates?: number;
  shortlisted?: number;
  avgMatch?: number;
}

const DEFAULT_JOBS: JobListing[] = [
  {
    id: 1,
    title: "Software Developer (Backend)",
    company: "Swiggy",
    location: "Bengaluru (Hybrid)",
    salary: "₹18L - ₹26L",
    track: "Software Developer",
    code: "SD",
    dept: "Engineering",
    experienceLevel: "Junior / Mid",
    simRequired: "Production Incident Bugfix (Junior Level)",
    minScore: 75,
    candidateScore: 84,
    tags: ["Node.js", "PostgreSQL", "Reactive Streaming", "Redis"],
    description: "Seeking a backend engineer with demonstrated simulation capability in streaming architectures and high-throughput error resilience.",
    status: "Active",
    posted: "Live",
  },
  {
    id: 2,
    title: "Junior Data Analyst",
    company: "Razorpay",
    location: "Bengaluru / Remote",
    salary: "₹12L - ₹18L",
    track: "Data Analyst",
    code: "DA",
    dept: "Growth & Product",
    experienceLevel: "Junior",
    simRequired: "E-Commerce Funnel Drop-off Analysis (Junior Level)",
    minScore: 70,
    candidateScore: 78,
    tags: ["SQL", "Funnel Analytics", "Python", "Tableau"],
    description: "Analyze checkout drop-offs, payment gateway success rates, and customer conversion funnels for enterprise merchant products.",
    status: "Active",
    posted: "Live",
  },
  {
    id: 3,
    title: "Senior Backend Systems Engineer",
    company: "PhonePe",
    location: "Bengaluru",
    salary: "₹32L - ₹45L",
    track: "Software Developer",
    code: "SD",
    dept: "Core Platform",
    experienceLevel: "Senior",
    simRequired: "Flash Sale Concurrency Bug (Senior Level)",
    minScore: 85,
    candidateScore: 84,
    tags: ["Distributed Locks", "High Concurrency", "Java / Go", "Kafka"],
    description: "Architect high-reliability transaction settlement engines under flash-sale concurrency. Evaluated via Senior SD simulation.",
    status: "Active",
    posted: "Live",
  },
  {
    id: 4,
    title: "UI / UX Product Designer",
    company: "Cred",
    location: "Bengaluru",
    salary: "₹16L - ₹24L",
    track: "UI / UX Designer",
    code: "UX",
    dept: "Product Design",
    experienceLevel: "Junior / Mid",
    simRequired: "Checkout Cart Abandonment Redesign",
    minScore: 75,
    candidateScore: 68,
    tags: ["Figma", "Design Systems", "Prototyping", "Micro-interactions"],
    description: "Design intuitive member workflows, financial gamification mechanics, and sleek dark mode design systems.",
    status: "Active",
    posted: "Live",
  },
];

const LOCAL_STORAGE_CUSTOM_JOBS = "skillforge_custom_jobs";

export const jobService = {
  /**
   * Get all active job listings (default + recruiter created)
   */
  getJobs(): JobListing[] {
    if (typeof window === "undefined") return DEFAULT_JOBS;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CUSTOM_JOBS);
      const customJobs: JobListing[] = stored ? JSON.parse(stored) : [];
      return [...customJobs, ...DEFAULT_JOBS];
    } catch {
      return DEFAULT_JOBS;
    }
  },

  /**
   * Get single job by ID
   */
  getJobById(id: string | number): JobListing | undefined {
    const jobs = this.getJobs();
    return jobs.find((j) => String(j.id) === String(id));
  },

  /**
   * Create a new job from the Recruiter ATS
   */
  async createJob(params: {
    title: string;
    description: string;
    level: string;
    requiredSkills: string[];
    preferredSkills?: string[];
    experience?: string;
    criteria?: string;
    company?: string;
  }): Promise<JobListing> {
    const customId = `job-${Date.now()}`;
    const code = params.title.toLowerCase().includes("data")
      ? "DA"
      : params.title.toLowerCase().includes("design") || params.title.toLowerCase().includes("ux")
      ? "UX"
      : params.title.toLowerCase().includes("product")
      ? "PM"
      : "SD";

    const newJob: JobListing = {
      id: customId,
      title: params.title,
      company: params.company || "Enterprise Partner",
      location: "Bengaluru (Hybrid)",
      salary: "₹16L - ₹28L",
      track: code === "DA" ? "Data Analyst" : code === "UX" ? "UI / UX Designer" : code === "PM" ? "Product Manager" : "Software Developer",
      code,
      dept: "Engineering & Systems",
      experienceLevel: params.level || "Mid-Level",
      simRequired: `${params.title} Assessment Simulation`,
      minScore: 75,
      candidateScore: 82,
      tags: params.requiredSkills.length > 0 ? params.requiredSkills : ["TypeScript", "APIs", "System Design"],
      description: params.description,
      status: "Active",
      posted: "Just now",
      candidates: 0,
      shortlisted: 0,
      avgMatch: 0,
    };

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_CUSTOM_JOBS);
        const list: JobListing[] = stored ? JSON.parse(stored) : [];
        const updated = [newJob, ...list];
        localStorage.setItem(LOCAL_STORAGE_CUSTOM_JOBS, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("skillforge_job_created", { detail: newJob }));
      } catch (err) {
        console.warn("Could not write job to localStorage:", err);
      }
    }

    // Live Supabase sync if table exists
    if (isSupabaseConfigured()) {
      try {
        await supabase.from("jobs").insert([
          {
            id: customId,
            title: newJob.title,
            company: newJob.company,
            career_code: newJob.code,
            description: newJob.description,
            required_skills: newJob.tags,
            experience_level: newJob.experienceLevel,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        console.warn("Supabase jobs table sync notice:", err);
      }
    }

    return newJob;
  },
};
