export type Stat = {
  label: string;
  value: string;
  helper: string;
  icon?: string;
};

export type Service = {
  slug: string;
  name: string;
  description: string;
  details: string;
  highlights: string[];
  icon: string;
  image: string;
};

export type Faq = {
  question: string;
  answer: string;
  key?: string; // Added to support keys if needed
};

export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
};

export type Leader = {
  name: string;
  title: string;
  bio: string;
  quote?: string;
  portrait: string;
};

export type Brand = {
  name: string;
  description: string;
  sector: string;
  logo: string;
};

export type Download = {
  label: string;
  href: string;
};

export type FeatureIcon =
  | "battery"
  | "motor"
  | "air"
  | "noise"
  | "safety"
  | "connectivity"
  | "control";

export type ProductFeatureHighlight = {
  icon: FeatureIcon;
  text: string;
};

export type Product = {
  slug: string;
  brand: string;
  model: string;
  name: string;
  price: number;
  categories: string[];
  subCategories: string[];
  featuredHighlights: string[];
  specs: Record<string, string>;
  images: string[];
  createdAt?: any;
  createdBy?: string;
  updatedAt?: any;
  updatedBy?: string;
};

export type ProductCategory = {
  slug: string;
  name: string;
  tagline: string;
  brandColor: string;
  description: string;
  heroImage: string;
  focus: string;
  products: Product[];
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover: string;
  content: string[];
  tag: "News" | "Event" | "Insight";
};

export type CareerRole = {
  slug: string;
  title: string;
  location: string;
  position: string;
  deadline: string;
  url: string;
  summary: string;
  description?: string;
  keyResponsibilities?: string[];
  requirements?: string[];
  whatWeOffer?: string[];
  howToApply?: string;
};

export const siteNav = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/brands", label: "Brands" },
  { href: "/careers", label: "Careers" },
  { href: "/blog", label: "Blog" },
  { href: "/contact-us", label: "Contact" },
] as const;

type HeroCTAConfig = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type HeroContent = {
  eyebrow?: string;
  title: string;
  description: string;
  media: string;
  ctas: HeroCTAConfig[];
};

export const heroContent: HeroContent = {
  eyebrow: "Infrastructure partner since 2003",
  title: "Driven by quality, guided by standards.",
  description:
    "Dhinimex delivers electrical, water supply, and engineering solutions built for Cambodia’s growth. We combine 21 years of field expertise with rigorous testing and responsive service.",
  ctas: [
    { href: "/contact-us", label: "Request a quote", variant: "primary" },
    { href: "/about", label: "Our story", variant: "secondary" },
  ],
  media: "https://images.unsplash.com/photo-1509390968897-1a1d8d2dbf51",
};

export const stats: Stat[] = [
  {
    label: "Years of Experience",
    value: "21+",
    helper: "Supplying Cambodia since 2003.",
    icon: "/years-of-experience.png",
  },
  {
    label: "Team Members",
    value: "500+",
    helper: "Engineering, fabrication, utilities.",
    icon: "/team-members.png",
  },
  {
    label: "Companies in the Group",
    value: "18",
    helper: "Across 5 scientific sectors.",
  },
  {
    label: "Projects Delivered",
    value: "1,200+",
    helper: "Power, water, and industrial sites.",
  },
];

export const businessPillars = [
  {
    name: "Electrical Systems",
    description:
      "Manufacturing, installation, and testing for distribution networks, substations, and protection schemes.",
    icon: "bxs-bolt",
  },
  {
    name: "Water Infrastructure",
    description:
      "Utilities-grade pumping, purification, and distribution equipment that keeps communities supplied.",
    icon: "bxs-droplet",
  },
  {
    name: "Engineering & Consultation",
    description:
      "Testing labs, relay coordination, diagnostics, and turnkey EPC execution backed by experienced teams.",
    icon: "bxs-compass",
  },
];

export const whyChooseUs = [
  {
    title: "Professional team",
    detail:
      "Skilled engineers, technicians, and project managers who align with international standards on every build.",
    icon: "/professional-team.png",
  },
  {
    title: "Reliable & safe",
    detail:
      "Rigorous QA, certified materials, and proven routines such as oil purification and routine/type testing.",
    icon: "/reliable-and-safe.png",
  },
  {
    title: "Clear communication",
    detail:
      "Transparent BOQs, weekly reporting, and collaborative reviews throughout each project stage.",
    icon: "/clear-communication.png",
  },
  {
    title: "On-time delivery",
    detail:
      "Dedicated logistics teams and in-house fabrication ensure schedules remain on track.",
    icon: "/on-time-delivery.png",
  },
];

export const services: Service[] = [
  {
    slug: "manufacturing-and-repair",
    name: "Manufacturing and Repair",
    description:
      "We design and manufacture high-quality electrical equipment, including high-quality cables and conductors, distribution transformers, control panels, and concrete poles.",
    details:
      "High-quality conductors and transformer designs that meet TIS, IEC, and ANSI/IEEE requirements. Services include refurbishment, rewinding, and accelerated testing for legacy fleets.",
    highlights: [
      "Distribution transformers up to 35kV",
      "Custom LV/MV control panels",
      "Concrete poles and steel structures",
    ],
    icon: "/manufacturing-and-repair.png",
    image: "/manufacturing-repair.png",
  },
  {
    slug: "construction-and-installation",
    name: "Construction and Installation",
    description:
      "Advanced electric meters and monitor. We deliver end-to-end power infrastructure solutions—from poles and transformers to fully equipped substations. Ordering systems to monitor and control energy consumption accurately.",
    details:
      "We handle design, BOQ preparation, procurement, installation, commissioning, and handover for MV/LV networks, capacitor banks, and integrated monitoring systems.",
    highlights: [
      "MV 22kV & 35kV distribution lines",
      "Substation assembly & testing",
      "Advanced metering infrastructure",
    ],
    icon: "/construction-and-installation.png",
    image: "/construction-installation.png",
  },
  {
    slug: "testing-and-engineering-consultation",
    name: "Testing and Engineering Consultation",
    description:
      "From relay setting and transformer oil purification to system diagnostics, our testing services are designed to maximize performance and extend equipment lifespan. We deliver precise, trusted results to support smooth operations.",
    details:
      "Our in-house engineers provide commissioning support, thermographic inspections, and predictive maintenance programs to maximize uptime.",
    highlights: [
      "Protection & relay coordination",
      "Field testing labs",
      "Condition-based maintenance",
    ],
    icon: "/testing-and-eng-consultation.png",
    image: "/testing-engineering.png",
  },
  {
    slug: "utilities-provider",
    name: "Utilities Provider",
    description:
      "Beyond equipment and services, Dhinimex is a trusted utilities provider, delivering both electrical and water infrastructure across provinces in Cambodia.",
    details:
      "We invest in generation, distribution, and water networks, operating with modern monitoring systems and round-the-clock support.",
    highlights: [
      "Provincial utility concessions",
      "Water treatment plants",
      "Smart meter deployments",
    ],
    icon: "/utilities-provider.png",
    image: "/utilities-elec-provider.png",
  },
  {
    slug: "electrical-and-heavy-equipment-supply",
    name: "Electrical and Heavy Equipment Supply",
    description:
      "We provide a comprehensive range of high-quality electrical and heavy equipment solutions to support power distribution, installation, and maintenance projects.",
    details:
      "Our extensive inventory includes MV/LV cables, switchgear, transformers, protection devices, and construction machinery to meet diverse project needs.",
    highlights: [
      "MV/LV cables and accessories",
      "Switchgear and protection devices",
      "Construction equipment rental",
    ],
    icon: "/manufacturing-and-repair.png",
    image: "/utilities-elec-provider.png",
  },
  {
    slug: "water-and-utility",
    name: "Water & Utility",
    description:
      "Pumps, motors, and water treatment tools to support efficient water and utility management.",
    details:
      "We supply and install water pumping systems, treatment equipment, and utility management solutions for municipal and industrial applications.",
    highlights: [
      "Water pumps and motors",
      "Treatment equipment",
      "Utility management systems",
    ],
    icon: "/utilities-provider.png",
    image: "/water-supply.png",
  },
];

export const faqs: Faq[] = [
  {
    question: "What is your service area?",
    answer:
      "We provide comprehensive solutions in: MV 22kV and 35kV electricity distribution network construction, LV distribution network and distribution transformer substations, Metering systems, protection, and switching device installation, Switchgear, LVDB panels, and capacitor bank installations, Auto voltage regulator (AVR) and SVR installations, On- and off-grid solar system deployment, Water distribution network installation, Maintenance and troubleshooting services.",
  },
  {
    question: "How many years of experience do you have?",
    answer:
      "We bring nearly 22 years of proven expertise across multiple engineering and construction disciplines.",
  },
  {
    question: "What services do you offer?",
    answer:
      "Electrical and heavy equipment supply, Construction and installation services, Engineering and consultation services, Manufacturing and repair services.",
  },
  {
    question: "Do you have enough manpower and machinery to complete projects?",
    answer:
      "Yes. Our team consists of qualified engineers, skilled workers, and technicians dedicated to delivering projects efficiently. We are equipped with modern tools and machinery, ensuring projects are completed on time and to the highest quality standards.",
  },
  {
    question: "What is the construction process?",
    answer:
      "Our process follows a structured approach: 1. Site visit and consultation with the project owner, 2. Preparation of BOQ and detailed drawings, 3. Proposal submission and customer approval, 4. Procurement and delivery of equipment, 5. Construction, testing, and commissioning, 6. Project handover and after-sales support.",
  },
  {
    question: "What happens if the project goes over budget?",
    answer:
      "We work closely with clients to prepare BOQs that align with budget requirements. If additional work is required beyond the agreed scope, we will communicate transparently and reach a mutual agreement before proceeding.",
  },
  {
    question: "How long does it take to get an estimate?",
    answer:
      "Following a site inspection and consultation, we provide estimates, BOQs, and drawings for approval within approximately one week.",
  },
  {
    question: "Will I be able to request changes during the project?",
    answer:
      "Yes. Any changes requested during the project will be reviewed, discussed, and agreed upon to ensure alignment with client expectations.",
  },
];

export const timeline: TimelineEvent[] = [
  {
    year: "2003",
    title: "Humble beginnings",
    description:
      "Dhinimex launches as a trade-based supplier focused on electrical appliances and water supply components.",
  },
  {
    year: "2012",
    title: "Manufacturing scale-up",
    description:
      "In-house fabrication for transformers, conductors, and panel boards accelerates, unlocking EPC delivery.",
  },
  {
    year: "2016",
    title: "Utilities expansion",
    description:
      "The group invests in provincial utilities, operating electrical and water concessions with smart monitoring.",
  },
  {
    year: "2021",
    title: "Innovation & testing labs",
    description:
      "Engineering consultation and testing units launch to deliver relay coordination, diagnostics, and predictive maintenance.",
  },
  {
    year: "Today",
    title: "18 companies, 6 nationalities",
    description:
      "Dhinimex employs 500+ professionals across five scientific and technological sectors with a global outlook.",
  },
];

export const leadership: Leader[] = [
  {
    name: "Vong Sorphorn",
    title: "Chairwoman of the Board",
    bio: "Founded Dhinimex in 2003 and continues to guide the company with a focus on ethics, transparency, and service quality.",
    quote:
      "We earn trust by upholding strong ethical standards and delivering excellence in every engagement.",
    portrait: "https://www.dhinimex.com/wp-content/uploads/2025/10/BOD_2.jpg",
  },
  {
    name: "Sutharsan Chelladurai",
    title: "Managing Director",
    bio: "Oversees EPC execution, manufacturing, and utilities operations with a leadership philosophy grounded in responsibility.",
    quote:
      "Leadership is taking responsibility, inspiring with vision, and delivering results that shape a better future.",
    portrait: "https://www.dhinimex.com/wp-content/uploads/2025/10/MD_2.jpg",
  },
  {
    name: "Gheknai Kong",
    title: "Deputy Managing Director Finance & Audit",
    bio: "Drives financial strategy and governance, ensuring disciplined growth across the group’s portfolio.",
    quote: "Passion and discipline make you a better person.",
    portrait: "https://www.dhinimex.com/wp-content/uploads/2025/10/Ms-Nai_2-1.jpg",
  },
];

export const brands: Brand[] = [
  {
    name: "Fujitsu",
    description:
      "Advanced electrical and automation equipment relied on by Cambodian utilities and industries.",
    sector: "Electrical",
    logo: "https://www.dhinimex.com/wp-content/uploads/2025/09/ALL-LOGO-27.png",
  },
  {
    name: "Kyoritsu",
    description: "Precision measurement instruments for commissioning and maintenance teams.",
    sector: "Instrumentation",
    logo: "https://www.dhinimex.com/wp-content/uploads/2025/09/ALL-LOGO-26.png",
  },
  {
    name: "Eaton",
    description: "Power quality, switchgear, and control solutions built to global standards.",
    sector: "Power",
    logo: "https://www.dhinimex.com/wp-content/uploads/2025/09/ALL-LOGO-25.png",
  },
  {
    name: "KCC",
    description: "High-performance materials and coatings used across our infrastructure projects.",
    sector: "Industrial",
    logo: "https://www.dhinimex.com/wp-content/uploads/2025/09/ALL-LOGO-24.png",
  },
  {
    name: "RAJ",
    description: "Specialized electrical accessories and components for distribution networks.",
    sector: "Accessories",
    logo: "https://www.dhinimex.com/wp-content/uploads/2025/09/ALL-LOGO-23.png",
  },
];

const brandFiles = [
  "01", "02", "03", "05", "06", "07", "08", "09", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19",
  "20", "21", "22", "23", "26", "27"
];

export const homePageBrands = brandFiles.map((num) => ({
  name: `Brand ${num}`,
  logo: `/brands/ALL-LOGO-${num}.png`,
}));

import { productCategories as categories } from "./product-categories";
export const productCategories = categories;

export const posts: Post[] = [
  {
    slug: "exploring-culture-together",
    title: "Exploring culture together",
    date: "2025-08-11",
    tag: "Event",
    excerpt: "Team moments in Siem Reap celebrating craftsmanship and community.",
    cover: "https://www.dhinimex.com/wp-content/uploads/2025/08/img-post_1.png",
    content: [
      "Team members from across Cambodia traveled to Siem Reap to explore heritage sites, strengthen collaboration, and celebrate the culture that inspires our craft.",
      "Workshops focused on leadership, safety, and innovation—reinforcing how Dhinimex combines tradition with forward-looking engineering.",
    ],
  },
  {
    slug: "utilities-upgrade-program",
    title: "Provincial utilities upgrade program kicks off",
    date: "2025-10-04",
    tag: "News",
    excerpt:
      "Dhinimex partners with provincial authorities to expand reliable electricity and water access.",
    cover: "https://www.dhinimex.com/wp-content/uploads/2025/08/img-post_1.png",
    content: [
      "The multi-phase program covers MV extensions, new compact substations, and booster pumps that deliver safe power and water to growing communities.",
      "Local teams are trained on asset care, while remote monitoring dashboards provide transparency to stakeholders.",
    ],
  },
  {
    slug: "engineering-talent-drive",
    title: "Engineering talent drive 2025",
    date: "2025-09-20",
    tag: "Insight",
    excerpt:
      "We are hiring technical managers, supervisors, and graduates to support regional expansion.",
    cover: "https://www.dhinimex.com/wp-content/uploads/2025/08/img-post_1.png",
    content: [
      "With 18 companies in the group, career paths span manufacturing, utilities, project delivery, and corporate services.",
      "Candidates are encouraged to apply via recruitment@dhinimex.com with CVs and cover letters noting their target role.",
    ],
  },
];

export const careers: CareerRole[] = [
  {
    slug: "technical-manager",
    title: "Technical Manager",
    location: "Phnom Penh",
    position: "Full-time",
    deadline: "September 20, 2026",
    url: "https://www.dhinimex.com/careers/technical-manager/",
    summary:
      "Lead multi-disciplinary project teams delivering MV/LV infrastructure and utility assets.",
    description:
      "We are seeking a **Technical Manager** to lead engineering operations, product development, and technical services. This role includes managing project planning, budgets, documentation, and compliance while providing technical leadership to engineering, sales, and customer service teams.",
    keyResponsibilities: [
      "Lead product development and technical improvements",
      "Manage engineering activities, budgets, and schedules",
      "Prepare and oversee technical documentation (drawings, BOQs, schematics)",
      "Provide technical training and support to internal teams",
      "Supervise bids, proposals, contracts, and implementation",
      "Conduct market studies and competitor analysis",
      "Lead maintenance, repair, and improvement of facilities",
      "Recruit, train, and mentor engineering staff",
      "Monitor after-sales performance and customer satisfaction",
      "Collaborate with IT for system integration and support",
      "Report on project outcomes, customer feedback, and service metrics.",
    ],
    requirements: [
      "Bachelor's degree in Engineering (Master's preferred)",
      "Minimum 5 years' engineering experience, with at least 2 in management",
      "Proficiency in AutoCAD, Microsoft Office, and MV/LV equipment knowledge",
      "Familiarity with Cambodian technical standards",
      "Strong leadership and team management skills",
      "Proficiency in Khmer and English.",
    ],
    whatWeOffer: [
      "Competitive salary (negotiable based on experience)",
      "Annual salary increments and performance bonus",
      "Staff trips, annual events, and incentive programs",
      "Internal and external training opportunities",
      "Training in technical and managerial skills.",
    ],
    howToApply:
      "Submit your CV to **recruitment@dhinimex.com** with the subject line: _Technical Manager Application_.",
  },
  {
    slug: "technical-supervisor",
    title: "Technical Supervisor",
    location: "Phnom Penh",
    position: "Full-time",
    deadline: "September 20, 2026",
    url: "https://www.dhinimex.com/careers/technical-supervisor/",
    summary:
      "Oversee field crews, safety routines, and quality checks across construction sites.",
    description:
      "We are hiring a Technical Supervisor to oversee engineering projects, guide technical teams, and ensure compliance with company standards. The role involves supervising project execution, maintenance, after-sales service, and technical documentation while coordinating with the Technical Manager.",
    keyResponsibilities: [
      "Supervise and guide technical teams to deliver projects on time and within budget",
      "Support the Technical Manager in planning, documentation, and project execution",
      "Ensure compliance with engineering standards, drawings, and BOQs",
      "Supervise maintenance schedules and after-sales services",
      "Provide training, technical testing, and guidance to sales and customer support teams",
      "Prepare bids, proposals, and budget estimates for projects",
      "Collaborate with IT for system integration and technical support",
      "Generate reports on after-sales service, project performance, and customer satisfaction.",
    ],
    requirements: [
      "Bachelor’s degree in Electrical Engineering",
      "Minimum 3 years’ experience, including 1 year in a supervisory role",
      "Proficiency in AutoCAD, Microsoft Office, and knowledge of MV/LV equipment",
      "Familiarity with Cambodian technical standards and regulations",
      "Strong leadership, communication, and team coordination skills",
      "Fluency in English.",
    ],
    whatWeOffer: [
      "Competitive salary (negotiable based on experience)",
      "Annual salary increments and performance bonus",
      "Staff trips, annual events, and incentive programs",
      "Internal and external training opportunities",
      "Technical and soft skills training.",
    ],
    howToApply:
      "Submit your CV to **hr@dhinimex.com** with the subject line: _Technical Supervisor Application_.",
  },
  {
    slug: "admin-hr-team-leader",
    title: "Admin & HR Team Leader",
    location: "Phnom Penh",
    position: "Full-time",
    deadline: "September 20, 2026",
    url: "https://www.dhinimex.com/careers/admin-hr-team-leader/",
    summary:
      "Drive recruitment, engagement, and learning programs for a 500+ person workforce.",
    description:
      "We are looking for an **Admin & HR Team Leader** to implement HR policies, ensure compliance, and manage day-to-day HR and administrative functions across the group. This role will oversee recruitment, employee relations, organizational charts, performance appraisals, and training initiatives while providing leadership and support to HR staff.",
    keyResponsibilities: [
      "Implement HR policies and ensure compliance across branch companies",
      "Oversee recruitment, onboarding, and employee engagement activities",
      "Manage organizational charts, employee records, and payroll reports",
      "Lead annual performance appraisals and staff development programs",
      "Provide training and mentorship to HR staff and new hires",
      "Coordinate company events and administrative duties",
      "Resolve HR-related queries and grievances from staff and partners",
      "Prepare reports on headcount, turnover, and HR performance.",
    ],
    requirements: [
      "Bachelor’s degree in Business Administration or HR Management",
      "Minimum 2–3 years of HR and administrative experience",
      "Strong knowledge of HR policies, labor compliance, and employee management",
      "Computer literacy (Excel, Email, Internet, Word)",
      "Strong communication skills in Khmer and English",
      "Ability to work under pressure and manage deadlines",
      "Strong skills in team leadership, time management, and problem-solving.",
    ],
    whatWeOffer: [
      "Competitive salary (negotiable based on experience)",
      "Annual salary increments and performance bonus",
      "Staff trips, annual events, and incentive programs",
      "Internal and external training opportunities.",
    ],
    howToApply:
      "Submit your CV to **hr@dhinimex.com** with the subject line: _Admin & HR Team Leader Application_.",
  },
  {
    slug: "legal-officer",
    title: "Legal Officer",
    location: "Phnom Penh",
    position: "Full-time",
    deadline: "September 20, 2026",
    url: "https://www.dhinimex.com/careers/legal-officer/",
    summary:
      "Support compliance, contracts, and regulatory submissions for utilities concessions.",
    description:
      "We are seeking a **Legal Officer** to provide legal support across the organization. This role involves reviewing contracts, ensuring regulatory compliance, advising management on legal risks, and coordinating with external legal counsel. The Legal Officer will also support board activities, prepare shareholder documentation, and act as a liaison with auditors, regulators, and government bodies.",
    keyResponsibilities: [
      "Review and draft contracts, agreements, and other legal documents",
      "Support legal due diligence, regulatory filings, licensing, and contract renewals",
      "Maintain legal records, company registrations, and compliance logs",
      "Coordinate with external counsel for litigation or specialized matters",
      "Monitor regulatory updates and communicate internal implications",
      "Assist with board resolutions, meeting minutes, and shareholder documentation",
      "Advise management on legal risks of strategic decisions",
      "Liaise with auditors, regulators, and government authorities.",
    ],
    requirements: [
      "Bachelor’s degree in Law (LL.B); Master’s or legal certifications are a plus",
      "2–5 years’ experience in a legal or corporate environment, preferably multi-industry",
      "Strong knowledge of Cambodian corporate, labor, and commercial law",
      "Excellent legal drafting and document review skills",
      "High level of integrity, confidentiality, and professional ethics",
      "Proficiency in Khmer and English (written and spoken)",
      "Strong organizational and communication skills.",
    ],
    whatWeOffer: [
      "Competitive salary and benefits",
      "Opportunities for career growth in corporate legal practice",
      "Supportive, professional environment.",
    ],
    howToApply:
      "Submit your CV to **recruitment@dhinimex.com** with the subject line: _Legal Officer Application_.",
  },
  {
    slug: "design-engineer",
    title: "Design Engineer (Electrical)",
    location: "Phnom Penh",
    position: "Full-time",
    deadline: "September 20, 2026",
    url: "https://www.dhinimex.com/careers/design-engineer/",
    summary:
      "Develop LV/MV drawings, calculations, and material submittals that meet Dhinimex standards.",
    description:
      "We’re looking for a **Junior Design Engineer (Electrical)** to support our engineering team in designing, developing, and implementing electrical systems. You’ll assist in project planning, preparation of technical documentation, and coordination with project stakeholders to ensure quality and compliance with industry standards.",
    keyResponsibilities: [
      "Assist in electrical system design and technical drafting",
      "Prepare wiring diagrams, layout plans, and technical specifications",
      "Collaborate with senior engineers and project managers to execute designs",
      "Review and ensure designs meet safety, regulatory, and performance standards",
      "Support in testing and troubleshooting electrical components and systems",
      "Attend site visits as needed to gather data and verify installations",
      "Maintain project documentation and assist in project monitoring",
      "Perform additional duties as assigned.",
    ],
    requirements: [
      "Bachelor’s degree in Electrical Engineering or related field",
      "Entry-level or up to 1-2 years of experience preferred, internships or academic projects considered",
      "Basic knowledge of electrical systems, wiring, and design tools",
      "Good understanding of safety standards and regulatory requirements",
      "Strong analytical, problem-solving, and technical skills",
      "Effective communication, ability to work in teams, and attention to detail.",
    ],
    whatWeOffer: [
      "Structured onboarding and mentorship by experienced engineers",
      "Opportunities for professional growth and skill development",
      "Project exposure to varied engineering challenges",
      "Supportive work environment and collaborative culture.",
    ],
    howToApply:
      "Submit your CV to **recruitment@dhinimex.com** with the subject line: _Design Engineer (Electrical) Application_.",
  },
  {
    slug: "sales-and-marketing-executive",
    title: "Sales & Marketing Executive",
    location: "Phnom Penh",
    position: "Full-time",
    deadline: "September 20, 2026",
    url: "https://www.dhinimex.com/careers/sales-and-marketing-executive/",
    summary:
      "Engage public and private sector clients with tailored equipment and services proposals.",
    description:
      "We are seeking a **Sales and Marketing Executive (Outdoor)** to join our dynamic team. In this role, you will manage customer relationships, achieve sales targets, and expand market reach through proactive fieldwork. You will represent the company directly to clients, ensuring that products and promotions are effectively presented while maintaining strong service and accountability.",
    keyResponsibilities: [
      "Set personal sales targets, including customer targets with detailed products, SKUs, and amounts",
      "Prepare market route visit plans, expense budgets, and customer lists",
      "Travel within assigned territories to conduct face-to-face meetings with customers and prospects",
      "Present product samples, promotions, prices, and related programs to customers",
      "Submit purchase orders to head office and coordinate payment collection with collectors",
      "Reconcile daily cash collections with the Accountant",
      "Organize and maintain product displays at customer shops, ensuring cleanliness, proper arrangement, and stock availability",
      "Prepare daily Market Visit Reports after customer visits",
      "Provide Daily Sales Reports, market insights, competitor updates, and report regularly to Supervisor/Manager",
      "Perform additional duties as assigned by superiors",
    ],
    requirements: [
      "Bachelor’s degree in Business Administration (Marketing or related field preferred)",
      "Minimum 1 year of experience in selling electrical and/or electronic products",
      "Experience working in upcountry sales is an advantage",
      "Strong work ethic with flexibility to achieve targets",
      "Honest, adaptable, friendly, confident, and a strong team player with a “can-do” attitude",
      "Effective communication, interpersonal, presentation, and negotiation skills",
      "Service-minded with strong customer relationship focus",
      "Valid driving license is an advantage.",
    ],
    whatWeOffer: [
      "Competitive compensation package with performance incentives",
      "Opportunities for career growth and professional development",
      "Supportive and collaborative work environment",
      "Exposure to diverse markets and customer networks.",
    ],
    howToApply:
      "Submit your CV to **recruitment@dhinimex.com** with the subject line: _Sales and Marketing Executive (Outdoor) Application_.",
  },
  {
    slug: "sales-executive",
    title: "Sales Executive (Projection)",
    location: "Phnom Penh",
    position: "Full-time",
    deadline: "September 30, 2025",
    url: "https://www.dhinimex.com/careers/sales-executive/",
    summary:
      "Forecast demand and support market entry initiatives for new products.",
    description:
      "We are looking for a **Sales Executive (Sales Projection)** who will be responsible for forecasting sales, developing strategies to achieve these forecasts, and supporting overall corporate sales growth. You will analyze market trends, work with internal teams, and help shape goals that align with business objectives.",
    keyResponsibilities: [
      "Prepare sales forecasts and projections based on market data and past performance",
      "Monitor actual sales versus projections, identify gaps, and adjust strategies accordingly",
      "Collaborate with marketing, operations, and finance teams to align sales plans",
      "Engage with customers to understand demand patterns and market needs",
      "Generate monthly/quarterly reports on sales performance and trends",
      "Assist in preparing budgets and targets for the sales department",
      "Maintain awareness of competitor activity and market developments",
      "Take on additional tasks as required by senior management.",
    ],
    requirements: [
      "Bachelor’s degree in Business, Marketing, Finance, or related field",
      "Minimum 1 year of experience in sales forecasting or related sales roles",
      "Analytical skills with the ability to interpret market data and adjust plans",
      "Strong communication, negotiation, and stakeholder management skills",
      "Proactive, self-motivated, able to work under pressure and meet targets",
      "Team-oriented with a result-driven mindset.",
    ],
    whatWeOffer: [
      "Competitive salary and performance-based incentives",
      "Career development opportunities in sales and strategy",
      "Collaborative environment and mentorship support",
      "Chance to contribute to the company’s growth strategy.",
    ],
    howToApply:
      "Submit your CV to **recruitment@dhinimex.com** with the subject line: _Sales Executive (Sales Projection) Application_.",
  },
];

export function getCareer(slug: string) {
  return careers.find((career) => career.slug === slug);
}

export const contactInfo = {
  address: "#245, St. Tep Phan (182), Tuk Laak 2, Khan Toul Kork, Phnom Penh, Cambodia",
  email: "info@dhinimex.com.kh",
  salesEmail: "sales@dhinimex.com",
  phones: ["011 753 940", "017 777 844", "017 777 944"],
  hours: "Monday – Saturday / 8:00AM – 5:00PM",
  mapEmbed:
    "https://maps.google.com/maps?q=Dhinimex+Co.,+Ltd,+Phnom+Penh&t=&z=15&ie=UTF8&iwloc=&output=embed",
  googleMapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Dhinimex+Co.,+Ltd,+Phnom+Penh",
  social: [
    { label: "Facebook", href: "https://www.facebook.com/dhinimex/" },
    { label: "Telegram", href: "https://t.me/dhinimexofficial" },
    { label: "LinkedIn", href: "https://kh.linkedin.com/company/dhinimex-co-ltd" },
    { label: "TikTok", href: "https://www.tiktok.com/@dhinimex.com" },
    { label: "YouTube", href: "https://www.youtube.com/@dhinimex9070" },
  ],
};

export const newsHero = {
  title: "News & Events",
  description:
    "Stories from our teams, partners, and communities—covering engineering milestones, cultural moments, and talent highlights.",
};

export function getCategory(slug: string) {
  return productCategories.find((category) => category.slug === slug);
}

export function getProduct(categorySlug: string, productSlug: string) {
  const category = getCategory(categorySlug);
  if (!category) return undefined;
  return {
    category,
    product: category.products.find((product) => product.slug === productSlug),
  };
}

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
