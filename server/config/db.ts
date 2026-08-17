import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, Job, Application, SavedJob, PlatformStats } from '../models/types.ts';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  users: User[];
  jobs: Job[];
  applications: Application[];
  savedJobs: SavedJob[];
}

let db: DatabaseSchema = {
  users: [],
  jobs: [],
  applications: [],
  savedJobs: []
};

// Seed initial realistic data
export async function initializeDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const fileData = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(fileData);
      console.log(`[Database] Loaded ${db.users.length} users, ${db.jobs.length} jobs, ${db.applications.length} applications from ${DB_FILE}`);
      return;
    }
  } catch (err) {
    console.warn('[Database] Could not read existing db.json, generating fresh seed data...', err);
  }

  // Generate seed data
  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  const seedUsers: User[] = [
    {
      id: 'usr_seeker_1',
      name: 'Alex Morgan',
      email: 'seeker@jobboard.com',
      passwordHash: defaultPasswordHash,
      role: 'job_seeker',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      headline: 'Senior Full Stack Engineer | React, Node.js, Cloud Architecture',
      bio: 'Passionate software engineer with 6+ years of experience building modern web applications, scalable backend microservices, and interactive UI systems. Enthusiast for clean code and performance optimization.',
      skills: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL', 'GraphQL', 'Docker', 'AWS', 'Next.js'],
      experience: [
        {
          id: 'exp_1',
          title: 'Senior Frontend Developer',
          company: 'CloudPulse Technologies',
          location: 'San Francisco, CA',
          startDate: '2022-03-01',
          current: true,
          description: 'Led the UI redesign for enterprise analytics dashboards used by 45,000+ daily active users. Reduced bundle size by 35% and improved Core Web Vitals to 99%.'
        },
        {
          id: 'exp_2',
          title: 'Full Stack Software Engineer',
          company: 'Nexus Software Labs',
          location: 'San Jose, CA',
          startDate: '2019-06-01',
          endDate: '2022-02-01',
          current: false,
          description: 'Designed and deployed scalable REST and GraphQL APIs using Node.js and PostgreSQL. Built reusable React component design system.'
        }
      ],
      education: [
        {
          id: 'edu_1',
          school: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startYear: '2015',
          endYear: '2019'
        }
      ],
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeName: 'Alex_Morgan_Resume_2026.pdf',
      resumeUpdated: '2026-08-10T14:30:00Z',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/alexmorgan-demo',
        github: 'https://github.com/alexmorgan-dev',
        portfolio: 'https://alexmorgan.dev'
      },
      isActive: true,
      createdAt: '2026-01-15T09:00:00Z',
      updatedAt: '2026-08-10T14:30:00Z'
    },
    {
      id: 'usr_seeker_2',
      name: 'Elena Rostova',
      email: 'elena@jobboard.com',
      passwordHash: defaultPasswordHash,
      role: 'job_seeker',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 987-6543',
      location: 'New York, NY',
      headline: 'Product Designer & Design Systems Lead',
      bio: 'Crafting intuitive digital experiences with a deep focus on user-centered design, typography, accessibility, and high-conversion SaaS flows.',
      skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'User Research', 'Wireframing', 'Tailwind CSS'],
      experience: [
        {
          id: 'exp_3',
          title: 'Lead Product Designer',
          company: 'Veloce Digital',
          location: 'New York, NY',
          startDate: '2021-04-01',
          current: true,
          description: 'Architected comprehensive design system unifying 4 distinct product lines. Conducted 50+ user interviews.'
        }
      ],
      education: [
        {
          id: 'edu_2',
          school: 'Rhode Island School of Design',
          degree: 'BFA',
          fieldOfStudy: 'Graphic & Interaction Design',
          startYear: '2016',
          endYear: '2020'
        }
      ],
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeName: 'Elena_Rostova_Portfolio_Resume.pdf',
      resumeUpdated: '2026-08-01T10:00:00Z',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/elenarostova',
        portfolio: 'https://elenarostova.design'
      },
      isActive: true,
      createdAt: '2026-02-10T11:00:00Z',
      updatedAt: '2026-08-01T10:00:00Z'
    },
    {
      id: 'usr_emp_1',
      name: 'Sarah Chen',
      email: 'employer@jobboard.com',
      passwordHash: defaultPasswordHash,
      role: 'employer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 345-6789',
      location: 'Austin, TX',
      headline: 'Head of Talent & Engineering Recruitment at TechNova',
      bio: 'Passionate about building world-class engineering and product teams at high-growth tech companies.',
      skills: ['Technical Recruiting', 'Talent Acquisition', 'Engineering Leadership'],
      experience: [],
      education: [],
      companyName: 'TechNova Solutions',
      companyWebsite: 'https://technova.io',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      companySize: '250-500 employees',
      companyDescription: 'TechNova is a fast-growing cloud infrastructure and enterprise intelligence platform powering next-generation data workflows for Fortune 500 innovators.',
      isActive: true,
      createdAt: '2026-01-05T08:00:00Z',
      updatedAt: '2026-08-12T09:00:00Z'
    },
    {
      id: 'usr_emp_2',
      name: 'David Martinez',
      email: 'david@innovatech.com',
      passwordHash: defaultPasswordHash,
      role: 'employer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 456-7890',
      location: 'Seattle, WA',
      headline: 'VP of People at InnovaTech Dynamics',
      bio: 'Driving people-first culture and hiring exceptional builders in AI, cloud systems, and product engineering.',
      skills: ['Executive Hiring', 'HR Strategy', 'Culture Building'],
      experience: [],
      education: [],
      companyName: 'InnovaTech Dynamics',
      companyWebsite: 'https://innovatechdynamics.com',
      companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80',
      companySize: '500-1000 employees',
      companyDescription: 'InnovaTech builds autonomous AI agents and real-time distributed platforms helping organizations streamline complex operations.',
      isActive: true,
      createdAt: '2026-01-20T10:00:00Z',
      updatedAt: '2026-08-14T11:00:00Z'
    },
    {
      id: 'usr_admin_1',
      name: 'Marcus Vance',
      email: 'admin@jobboard.com',
      passwordHash: defaultPasswordHash,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 789-0123',
      location: 'San Francisco, CA',
      headline: 'Platform Administrator & Trust & Safety Lead',
      bio: 'Overseeing platform integrity, compliance, employer verifications, and marketplace quality control.',
      skills: ['Platform Governance', 'Trust & Safety', 'Data Analytics', 'Operations'],
      experience: [],
      education: [],
      companyName: 'JobBoard Global Inc.',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-15T12:00:00Z'
    }
  ];

  const seedJobs: Job[] = [
    {
      id: 'job_1',
      employerId: 'usr_emp_1',
      employerName: 'Sarah Chen',
      employerEmail: 'employer@jobboard.com',
      company: 'TechNova Solutions',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      companyWebsite: 'https://technova.io',
      companySize: '250-500 employees',
      companyAbout: 'TechNova is a premier cloud infrastructure and enterprise intelligence platform powering next-generation workflows.',
      title: 'Senior Full Stack Engineer',
      category: 'Software Engineering',
      location: 'San Francisco, United States',
      jobType: 'Full-time',
      remoteType: 'Remote',
      experienceLevel: 'Senior',
      salaryMin: 140000,
      salaryMax: 185000,
      salaryCurrency: 'USD',
      salaryPeriod: 'year',
      description: 'We are seeking an experienced Senior Full Stack Engineer to build and scale our flagship cloud management workspace. You will collaborate closely with product managers, UI/UX designers, and platform architects to deliver lightning-fast, resilient web applications that delight enterprise customers globally.',
      responsibilities: [
        'Architect, build, and maintain high-performance frontend interfaces using React, TypeScript, and Tailwind CSS.',
        'Design secure, scalable Node.js microservices and RESTful/GraphQL APIs.',
        'Implement robust caching, database indexing, and query optimization for distributed databases.',
        'Mentor junior and mid-level engineers through code reviews and collaborative architecture sessions.',
        'Partner with product and design to iterate rapidly on customer feedback and analytics insights.'
      ],
      requirements: [
        '5+ years of professional full-stack web development experience.',
        'Deep mastery of modern JavaScript/TypeScript, React 18+, Node.js, and Express.',
        'Strong understanding of relational (PostgreSQL) and NoSQL databases.',
        'Hands-on experience with Docker, CI/CD pipelines, and cloud platforms (AWS / GCP).',
        'Excellent written and verbal communication skills.'
      ],
      skills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'AWS', 'Docker'],
      benefits: [
        'Competitive equity compensation package',
        '100% employer-covered health, dental, and vision insurance',
        'Unlimited paid time off (PTO) and paid parental leave',
        '$3,000 annual learning and home office stipend',
        '401(k) matching up to 5%'
      ],
      deadline: '2026-09-30',
      status: 'Active',
      isFeatured: true,
      viewsCount: 642,
      applicationsCount: 14,
      createdAt: '2026-08-01T10:00:00Z',
      updatedAt: '2026-08-15T10:00:00Z'
    },
    {
      id: 'job_2',
      employerId: 'usr_emp_1',
      employerName: 'Sarah Chen',
      employerEmail: 'employer@jobboard.com',
      company: 'TechNova Solutions',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      companyWebsite: 'https://technova.io',
      companySize: '250-500 employees',
      companyAbout: 'TechNova is a premier cloud infrastructure and enterprise intelligence platform.',
      title: 'Staff UI/UX Product Designer',
      category: 'Design & Creative',
      location: 'London, UK',
      jobType: 'Full-time',
      remoteType: 'Hybrid',
      experienceLevel: 'Lead',
      salaryMin: 150000,
      salaryMax: 195000,
      salaryCurrency: 'USD',
      salaryPeriod: 'year',
      description: 'Join TechNova as our Staff Product Designer to lead design strategy, define design system foundations, and shape the end-to-end user experience for enterprise observability dashboards.',
      responsibilities: [
        'Own the product design lifecycle from user research and wireframing to high-fidelity interactive prototypes.',
        'Expand and govern our multi-product Figma design system.',
        'Collaborate closely with frontend engineers to ensure pixel-perfect, accessible component implementations.',
        'Conduct usability testing and translate customer feedback into actionable UX improvements.'
      ],
      requirements: [
        '6+ years designing B2B SaaS or developer tools with proven track record.',
        'Expertise in Figma, design systems, typography, and micro-interactions.',
        'Strong foundational knowledge of HTML/CSS capabilities and accessibility standards (WCAG 2.1 AA).',
        'Strong portfolio demonstrating complex workflows simplified into elegant UI.'
      ],
      skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'User Research', 'Information Architecture'],
      benefits: [
        'Top-tier medical, vision, and dental coverage',
        'Generous stock options grant',
        'Flexible hybrid schedule (2 days in London office, 3 days remote)',
        'Annual wellness & gym reimbursement'
      ],
      deadline: '2026-09-15',
      status: 'Active',
      isFeatured: true,
      viewsCount: 428,
      applicationsCount: 8,
      createdAt: '2026-08-04T12:00:00Z',
      updatedAt: '2026-08-14T15:00:00Z'
    },
    {
      id: 'job_3',
      employerId: 'usr_emp_2',
      employerName: 'David Martinez',
      employerEmail: 'david@innovatech.com',
      company: 'InnovaTech Dynamics',
      companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80',
      companyWebsite: 'https://innovatechdynamics.com',
      companySize: '500-1000 employees',
      companyAbout: 'InnovaTech builds autonomous AI agents and real-time distributed platforms.',
      title: 'DevOps & Cloud Infrastructure Specialist',
      category: 'DevOps & Cloud',
      location: 'Lagos, Nigeria',
      jobType: 'Full-time',
      remoteType: 'Remote',
      experienceLevel: 'Mid-level',
      salaryMin: 130000,
      salaryMax: 165000,
      salaryCurrency: 'USD',
      salaryPeriod: 'year',
      description: 'We are looking for a DevOps Engineer in Lagos / West Africa to strengthen our Kubernetes clusters, automate multi-region infrastructure provisioning, and enhance platform reliability.',
      responsibilities: [
        'Manage and scale multi-tenant Kubernetes clusters across AWS and GCP.',
        'Write clean, modular Terraform configurations for infrastructure as code (IaC).',
        'Build automated CI/CD pipelines with GitHub Actions.',
        'Implement proactive monitoring, alerting, and observability using Prometheus and Grafana.'
      ],
      requirements: [
        '3+ years in DevOps, SRE, or Cloud Infrastructure roles.',
        'Strong hands-on experience with Kubernetes, Terraform, and AWS/GCP services.',
        'Proficiency with Linux shell scripting and Python or Go for automation.',
        'Familiarity with SOC2 compliance and zero-trust security practices.'
      ],
      skills: ['Kubernetes', 'Terraform', 'AWS', 'Docker', 'CI/CD', 'Prometheus', 'Linux'],
      benefits: [
        'Comprehensive health insurance',
        'Remote work equipment allowance ($2,500)',
        'Generous paid annual leave',
        'Matching 401(k)'
      ],
      deadline: '2026-10-01',
      status: 'Active',
      isFeatured: false,
      viewsCount: 310,
      applicationsCount: 6,
      createdAt: '2026-08-06T09:30:00Z',
      updatedAt: '2026-08-16T08:00:00Z'
    },
    {
      id: 'job_4',
      employerId: 'usr_emp_2',
      employerName: 'David Martinez',
      employerEmail: 'david@innovatech.com',
      company: 'InnovaTech Dynamics',
      companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80',
      companyWebsite: 'https://innovatechdynamics.com',
      companySize: '500-1000 employees',
      companyAbout: 'InnovaTech builds autonomous AI agents and real-time distributed platforms.',
      title: 'AI / Machine Learning Engineer',
      category: 'Data Science & AI',
      location: 'New York, United States',
      jobType: 'Full-time',
      remoteType: 'Hybrid',
      experienceLevel: 'Senior',
      salaryMin: 160000,
      salaryMax: 210000,
      salaryCurrency: 'USD',
      salaryPeriod: 'year',
      description: 'Join our AI Research & Applications group to build high-throughput LLM reasoning pipelines, multimodal fine-tuning systems, and production agent orchestration engines.',
      responsibilities: [
        'Fine-tune and deploy open-source and proprietary foundation models for enterprise document synthesis.',
        'Build robust retrieval-augmented generation (RAG) pipelines with vector databases (Pinecone / pgvector).',
        'Optimize model inference latencies using ONNX, TensorRT, and quantized weights.',
        'Evaluate hallucination metrics and safety guardrails across client workloads.'
      ],
      requirements: [
        '4+ years practical machine learning engineering experience in production.',
        'Strong proficiency in Python, PyTorch, LangChain/LlamaIndex, and Hugging Face.',
        'Hands-on experience deploying models on GPU clusters with Triton or vLLM.',
        'MS or PhD in Computer Science, AI, or equivalent field preferred.'
      ],
      skills: ['Python', 'PyTorch', 'Machine Learning', 'RAG', 'Vector Databases', 'Transformers', 'FastAPI'],
      benefits: [
        'High-growth equity grant',
        'Full medical, dental, vision coverage',
        'Relocation assistance to NYC available',
        'Annual attendance at top AI conferences (NeurIPS, ICML)'
      ],
      deadline: '2026-09-20',
      status: 'Active',
      isFeatured: true,
      viewsCount: 890,
      applicationsCount: 22,
      createdAt: '2026-08-08T14:00:00Z',
      updatedAt: '2026-08-16T12:00:00Z'
    },
    {
      id: 'job_5',
      employerId: 'usr_emp_1',
      employerName: 'Sarah Chen',
      employerEmail: 'employer@jobboard.com',
      company: 'TechNova Solutions',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      companyWebsite: 'https://technova.io',
      companySize: '250-500 employees',
      companyAbout: 'TechNova is a premier cloud infrastructure platform.',
      title: 'Principal Product Manager - Developer Experience',
      category: 'Product Management',
      location: 'San Francisco, CA',
      jobType: 'Full-time',
      remoteType: 'Remote',
      experienceLevel: 'Executive',
      salaryMin: 175000,
      salaryMax: 225000,
      salaryCurrency: 'USD',
      salaryPeriod: 'year',
      description: 'Lead the vision, roadmap, and delivery of TechNova’s next-gen SDKs, CLI tools, and developer documentation portal.',
      responsibilities: [
        'Define developer experience strategy and multi-quarter roadmaps.',
        'Conduct deep customer discovery with technical leaders and developers.',
        'Coordinate cross-functionally with engineering, developer relations, and marketing.',
        'Track product metrics (time-to-first-hello-world, API retention, NPS).'
      ],
      requirements: [
        '6+ years of technical product management experience in B2B/developer platforms.',
        'Former software engineering background or strong technical acumen.',
        'Proven track record scaling API/developer tool adoption.'
      ],
      skills: ['Product Strategy', 'Developer Experience', 'API Design', 'Roadmapping', 'Agile', 'Data Analytics'],
      benefits: [
        'Substantial equity package',
        'Premium health insurance',
        'Flexible work anywhere policy',
        'Annual executive leadership coaching'
      ],
      deadline: '2026-09-30',
      status: 'Active',
      isFeatured: false,
      viewsCount: 380,
      applicationsCount: 5,
      createdAt: '2026-08-10T11:00:00Z',
      updatedAt: '2026-08-15T16:00:00Z'
    },
    {
      id: 'job_6',
      employerId: 'usr_emp_2',
      employerName: 'David Martinez',
      employerEmail: 'david@innovatech.com',
      company: 'InnovaTech Dynamics',
      companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80',
      companyWebsite: 'https://innovatechdynamics.com',
      companySize: '500-1000 employees',
      companyAbout: 'InnovaTech builds autonomous AI agents and platforms.',
      title: 'Junior Frontend Developer',
      category: 'Software Engineering',
      location: 'Chicago, IL',
      jobType: 'Full-time',
      remoteType: 'Remote',
      experienceLevel: 'Entry-level',
      salaryMin: 75000,
      salaryMax: 95000,
      salaryCurrency: 'USD',
      salaryPeriod: 'year',
      description: 'Great opportunity for an ambitious early-career developer to learn from experienced mentors while building intuitive customer portals using React, TypeScript, and Tailwind CSS.',
      responsibilities: [
        'Implement clean, responsive UI components from Figma design specs.',
        'Integrate frontend components with REST API endpoints.',
        'Write unit and integration tests using Vitest and React Testing Library.',
        'Participate in daily standups, sprint planning, and code reviews.'
      ],
      requirements: [
        '1+ years experience or strong project portfolio in React and modern JavaScript.',
        'Solid understanding of HTML5, CSS3, Tailwind CSS, and responsive layout principles.',
        'Passion for learning and taking initiative.'
      ],
      skills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Git', 'HTML/CSS'],
      benefits: [
        'Structured mentorship and pair programming program',
        'Health, dental, and vision insurance',
        '$1,500 annual tech book and course allowance'
      ],
      deadline: '2026-10-15',
      status: 'Active',
      isFeatured: false,
      viewsCount: 520,
      applicationsCount: 31,
      createdAt: '2026-08-12T08:00:00Z',
      updatedAt: '2026-08-16T09:00:00Z'
    },
    {
      id: 'job_7',
      employerId: 'usr_emp_1',
      employerName: 'Sarah Chen',
      employerEmail: 'employer@jobboard.com',
      company: 'TechNova Solutions',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      companyWebsite: 'https://technova.io',
      companySize: '250-500 employees',
      companyAbout: 'TechNova is a premier cloud infrastructure platform.',
      title: 'Growth Marketing Lead',
      category: 'Marketing & Sales',
      location: 'Denver, CO',
      jobType: 'Full-time',
      remoteType: 'Hybrid',
      experienceLevel: 'Mid-level',
      salaryMin: 110000,
      salaryMax: 140000,
      salaryCurrency: 'USD',
      salaryPeriod: 'year',
      description: 'Drive multi-channel acquisition funnels, SEO initiatives, and content-led demand generation to accelerate our enterprise self-serve pipeline.',
      responsibilities: [
        'Manage paid search, LinkedIn campaigns, and performance marketing budgets.',
        'Optimize conversion rate (CRO) on landing pages and product trial onboarding.',
        'Collaborate with product and sales to deliver high-intent enterprise pipeline.'
      ],
      requirements: [
        '3+ years B2B SaaS growth marketing experience.',
        'Proficiency with Google Analytics 4, HubSpot, and Webflow/CMS.',
        'Data-driven mindset with strong analytical and reporting skills.'
      ],
      skills: ['SEO', 'Growth Marketing', 'Content Strategy', 'HubSpot', 'Google Analytics', 'Conversion Rate Optimization'],
      benefits: [
        'Competitive base + quarterly performance bonus',
        'Health & dental insurance',
        'Flexible PTO'
      ],
      deadline: '2026-09-25',
      status: 'Active',
      isFeatured: false,
      viewsCount: 295,
      applicationsCount: 7,
      createdAt: '2026-08-11T13:00:00Z',
      updatedAt: '2026-08-15T11:00:00Z'
    },
    {
      id: 'job_8',
      employerId: 'usr_emp_2',
      employerName: 'David Martinez',
      employerEmail: 'david@innovatech.com',
      company: 'InnovaTech Dynamics',
      companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80',
      companyWebsite: 'https://innovatechdynamics.com',
      companySize: '500-1000 employees',
      companyAbout: 'InnovaTech builds autonomous AI agents and platforms.',
      title: 'Cybersecurity & Compliance Analyst',
      category: 'Security & QA',
      location: 'Boston, MA',
      jobType: 'Full-time',
      remoteType: 'On-site',
      experienceLevel: 'Mid-level',
      salaryMin: 125000,
      salaryMax: 155000,
      salaryCurrency: 'USD',
      salaryPeriod: 'year',
      description: 'Safeguard our cloud assets, lead internal vulnerability assessments, and coordinate SOC2 and ISO27001 audit controls.',
      responsibilities: [
        'Conduct regular vulnerability scans, penetration test coordinations, and code reviews.',
        'Maintain security incident response protocols and audit logging.',
        'Work with engineering teams to remediate automated security findings.'
      ],
      requirements: [
        '3+ years experience in cybersecurity, cloud security, or compliance auditing.',
        'Familiarity with AWS security services (GuardDuty, AWS IAM, KMS).',
        'Security certifications (CISSP, CISM, CompTIA Security+) a strong plus.'
      ],
      skills: ['Cybersecurity', 'SOC 2', 'AWS Security', 'Vulnerability Assessment', 'ISO 27001', 'Network Security'],
      benefits: [
        'Comprehensive healthcare package',
        '401(k) matching up to 6%',
        'Tuition reimbursement for advanced security credentials'
      ],
      deadline: '2026-10-10',
      status: 'Active',
      isFeatured: false,
      viewsCount: 210,
      applicationsCount: 4,
      createdAt: '2026-08-13T10:00:00Z',
      updatedAt: '2026-08-16T14:00:00Z'
    }
  ];

  const seedApplications: Application[] = [
    {
      id: 'app_1',
      jobId: 'job_1',
      jobTitle: 'Senior Full Stack Engineer',
      companyName: 'TechNova Solutions',
      employerId: 'usr_emp_1',
      applicantId: 'usr_seeker_1',
      applicantName: 'Alex Morgan',
      applicantEmail: 'seeker@jobboard.com',
      applicantPhone: '+1 (555) 234-5678',
      applicantHeadline: 'Senior Full Stack Engineer | React, Node.js, Cloud Architecture',
      applicantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      applicantLocation: 'San Francisco, CA',
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeName: 'Alex_Morgan_Resume_2026.pdf',
      coverLetter: 'I have been following TechNova Solutions with great excitement. Having built high-scale enterprise cloud interfaces and Node.js microservices for 6+ years, I would love the opportunity to contribute to your core architecture and team velocity.',
      portfolioUrl: 'https://alexmorgan.dev',
      status: 'interview',
      employerNotes: 'Strong engineering background. Impressive portfolio and deep React/Node knowledge. Scheduled for technical round on Thursday.',
      appliedAt: '2026-08-05T14:00:00Z',
      updatedAt: '2026-08-12T16:30:00Z'
    },
    {
      id: 'app_2',
      jobId: 'job_4',
      jobTitle: 'AI / Machine Learning Engineer',
      companyName: 'InnovaTech Dynamics',
      employerId: 'usr_emp_2',
      applicantId: 'usr_seeker_1',
      applicantName: 'Alex Morgan',
      applicantEmail: 'seeker@jobboard.com',
      applicantPhone: '+1 (555) 234-5678',
      applicantHeadline: 'Senior Full Stack Engineer | React, Node.js, Cloud Architecture',
      applicantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      applicantLocation: 'San Francisco, CA',
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeName: 'Alex_Morgan_Resume_2026.pdf',
      coverLetter: 'Experienced full stack developer eager to apply my systems engineering background to production AI pipelines and vector search integration.',
      portfolioUrl: 'https://alexmorgan.dev',
      status: 'reviewing',
      employerNotes: 'Reviewing candidate background with ML team lead.',
      appliedAt: '2026-08-10T09:15:00Z',
      updatedAt: '2026-08-14T11:00:00Z'
    },
    {
      id: 'app_3',
      jobId: 'job_2',
      jobTitle: 'Staff UI/UX Product Designer',
      companyName: 'TechNova Solutions',
      employerId: 'usr_emp_1',
      applicantId: 'usr_seeker_2',
      applicantName: 'Elena Rostova',
      applicantEmail: 'elena@jobboard.com',
      applicantPhone: '+1 (555) 987-6543',
      applicantHeadline: 'Product Designer & Design Systems Lead',
      applicantAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      applicantLocation: 'New York, NY',
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeName: 'Elena_Rostova_Portfolio_Resume.pdf',
      coverLetter: 'With over 5 years designing intricate SaaS platforms and multi-brand design systems in Figma, I am eager to help shape TechNova’s UX foundations.',
      portfolioUrl: 'https://elenarostova.design',
      status: 'accepted',
      employerNotes: 'Outstanding portfolio, clear communicator, culture fit confirmed. Offer letter sent and accepted.',
      appliedAt: '2026-08-06T10:00:00Z',
      updatedAt: '2026-08-15T18:00:00Z'
    }
  ];

  const seedSavedJobs: SavedJob[] = [
    {
      id: 'sav_1',
      userId: 'usr_seeker_1',
      jobId: 'job_2',
      savedAt: '2026-08-08T12:00:00Z'
    },
    {
      id: 'sav_2',
      userId: 'usr_seeker_1',
      jobId: 'job_5',
      savedAt: '2026-08-11T16:20:00Z'
    }
  ];

  db = {
    users: seedUsers,
    jobs: seedJobs,
    applications: seedApplications,
    savedJobs: seedSavedJobs
  };

  saveDatabase();
  console.log('[Database] Seeded initial production database with sample users, jobs, applications, and bookmarks.');
}

export function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Database] Error persisting database:', err);
  }
}

// Database helper functions
export const Database = {
  // Users
  getUsers: () => db.users,
  findUserById: (id: string) => db.users.find(u => u.id === id),
  findUserByEmail: (email: string) => db.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  createUser: (user: User) => {
    db.users.push(user);
    saveDatabase();
    return user;
  },
  updateUser: (id: string, updates: Partial<User>) => {
    const idx = db.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    db.users[idx] = { ...db.users[idx], ...updates, updatedAt: new Date().toISOString() };
    saveDatabase();
    return db.users[idx];
  },
  deleteUser: (id: string) => {
    const idx = db.users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    db.users.splice(idx, 1);
    // Also remove applications and saved jobs
    db.applications = db.applications.filter(a => a.applicantId !== id);
    db.savedJobs = db.savedJobs.filter(s => s.userId !== id);
    saveDatabase();
    return true;
  },

  // Jobs
  getJobs: () => db.jobs,
  findJobById: (id: string) => db.jobs.find(j => j.id === id),
  createJob: (job: Job) => {
    db.jobs.unshift(job);
    saveDatabase();
    return job;
  },
  updateJob: (id: string, updates: Partial<Job>) => {
    const idx = db.jobs.findIndex(j => j.id === id);
    if (idx === -1) return null;
    db.jobs[idx] = { ...db.jobs[idx], ...updates, updatedAt: new Date().toISOString() };
    saveDatabase();
    return db.jobs[idx];
  },
  deleteJob: (id: string) => {
    const idx = db.jobs.findIndex(j => j.id === id);
    if (idx === -1) return false;
    db.jobs.splice(idx, 1);
    // clean related applications & saved
    db.applications = db.applications.filter(a => a.jobId !== id);
    db.savedJobs = db.savedJobs.filter(s => s.jobId !== id);
    saveDatabase();
    return true;
  },
  incrementJobViews: (id: string) => {
    const job = db.jobs.find(j => j.id === id);
    if (job) {
      job.viewsCount = (job.viewsCount || 0) + 1;
      saveDatabase();
    }
  },

  // Applications
  getApplications: () => db.applications,
  findApplicationById: (id: string) => db.applications.find(a => a.id === id),
  findApplicationsByApplicant: (applicantId: string) => db.applications.filter(a => a.applicantId === applicantId),
  findApplicationsByEmployer: (employerId: string) => db.applications.filter(a => a.employerId === employerId),
  findApplicationsByJob: (jobId: string) => db.applications.filter(a => a.jobId === jobId),
  hasApplied: (jobId: string, applicantId: string) => db.applications.some(a => a.jobId === jobId && a.applicantId === applicantId),
  createApplication: (app: Application) => {
    db.applications.unshift(app);
    // increment job application count
    const job = db.jobs.find(j => j.id === app.jobId);
    if (job) {
      job.applicationsCount = (job.applicationsCount || 0) + 1;
    }
    saveDatabase();
    return app;
  },
  deleteApplication: (id: string, applicantId?: string) => {
    const idx = db.applications.findIndex(a => a.id === id && (!applicantId || a.applicantId === applicantId));
    if (idx === -1) return false;
    const [removedApp] = db.applications.splice(idx, 1);
    const job = db.jobs.find(j => j.id === removedApp.jobId);
    if (job && job.applicationsCount > 0) {
      job.applicationsCount -= 1;
    }
    saveDatabase();
    return true;
  },
  updateApplicationStatus: (id: string, status: Application['status'], notes?: string) => {
    const app = db.applications.find(a => a.id === id);
    if (!app) return null;
    app.status = status;
    if (notes !== undefined) {
      app.employerNotes = notes;
    }
    app.updatedAt = new Date().toISOString();
    saveDatabase();
    return app;
  },

  // Saved Jobs
  getSavedJobsByUser: (userId: string) => db.savedJobs.filter(s => s.userId === userId),
  isJobSaved: (userId: string, jobId: string) => db.savedJobs.some(s => s.userId === userId && s.jobId === jobId),
  saveJob: (userId: string, jobId: string) => {
    if (db.savedJobs.some(s => s.userId === userId && s.jobId === jobId)) {
      return false;
    }
    db.savedJobs.push({
      id: `sav_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      jobId,
      savedAt: new Date().toISOString()
    });
    saveDatabase();
    return true;
  },
  unsaveJob: (userId: string, jobId: string) => {
    const initialLen = db.savedJobs.length;
    db.savedJobs = db.savedJobs.filter(s => !(s.userId === userId && s.jobId === jobId));
    const removed = db.savedJobs.length < initialLen;
    if (removed) saveDatabase();
    return removed;
  },

  // Analytics & Stats
  getPlatformStats: (): PlatformStats => {
    const totalUsers = db.users.length;
    const totalJobSeekers = db.users.filter(u => u.role === 'job_seeker').length;
    const totalEmployers = db.users.filter(u => u.role === 'employer').length;
    const totalJobs = db.jobs.length;
    const activeJobs = db.jobs.filter(j => j.status === 'Active').length;
    const totalApplications = db.applications.length;
    
    // Calculate applications in last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const applicationsThisWeek = db.applications.filter(a => new Date(a.appliedAt) >= oneWeekAgo).length;

    // Top categories
    const categoryMap: Record<string, number> = {};
    db.jobs.forEach(j => {
      categoryMap[j.category] = (categoryMap[j.category] || 0) + 1;
    });
    const topCategories = Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalUsers,
      totalJobSeekers,
      totalEmployers,
      totalJobs,
      activeJobs,
      totalApplications,
      applicationsThisWeek,
      topCategories,
      recentActivityCount: db.applications.length + db.jobs.length
    };
  }
};
