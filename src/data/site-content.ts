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
  titleKh?: string;
  date: string;
  excerpt: string;
  excerptKh?: string;
  cover: string;
  content: string[];
  contentKh?: string[];
  images?: string[];
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
  { href: "/news", label: "News" },
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

export const getHeroContent = (language: 'en' | 'kh'): HeroContent => ({
  eyebrow: language === 'kh' ? "ដៃគូហេដ្ឋារចនាសម្ព័ន្ធតាំងពីឆ្នាំ 2003" : "Infrastructure partner since 2003",
  title: language === 'kh' ? "ជំរុញដោយគុណភាព ណែនាំដោយស្តង់ដារ។" : "Driven by quality, guided by standards.",
  description: language === 'kh'
    ? "ធិនីម៉ិចផ្តល់ជូននូវដំណោះស្រាយអគ្គិសនី ការផ្គត់ផ្គង់ទឹក និងវិស្វកម្មដែលបានកសាងឡើងសម្រាប់ការរីកចម្រើនរបស់ប្រទេសកម្ពុជា។ យើងរួមបញ្ចូលគ្នានូវបទពិសោធន៍ 21 ឆ្នាំក្នុងវិស័យនេះ ជាមួយនឹងការធ្វើតេស្តដ៏ម៉ត់ចត់ និងសេវាកម្មរហ័ស។"
    : "Dhinimex delivers electrical, water supply, and engineering solutions built for Cambodia’s growth. We combine 21 years of field expertise with rigorous testing and responsive service.",
  ctas: [
    { href: "/contact-us", label: language === 'kh' ? "ស្នើសុំតម្លៃ" : "Request a quote", variant: "primary" },
    { href: "/about", label: language === 'kh' ? "រឿងរ៉ាវរបស់យើង" : "Our story", variant: "secondary" },
  ],
  media: "https://images.unsplash.com/photo-1509390968897-1a1d8d2dbf51",
});

export const getStats = (language: 'en' | 'kh'): Stat[] => [
  {
    label: language === 'kh' ? "បទពិសោធន៍ការងារ" : "Years of Experience",
    value: "21+",
    helper: language === 'kh' ? "ផ្គត់ផ្គង់នៅកម្ពុជាតាំងពីឆ្នាំ 2003។" : "Supplying Cambodia since 2003.",
    icon: "/years-of-experience.png",
  },
  {
    label: language === 'kh' ? "សមាជិកក្រុម" : "Team Members",
    value: "500+",
    helper: language === 'kh' ? "វិស្វកម្ម ការផលិត ឧបករណ៍ប្រើប្រាស់។" : "Engineering, fabrication, utilities.",
    icon: "/team-members.png",
  },
  {
    label: language === 'kh' ? "ក្រុមហ៊ុនក្នុងក្រុម" : "Companies in the Group",
    value: "18",
    helper: language === 'kh' ? "ឆ្លងកាត់វិស័យវិទ្យាសាស្ត្រចំនួន 5។" : "Across 5 scientific sectors.",
  },
  {
    label: language === 'kh' ? "គម្រោងដែលបានបញ្ចប់" : "Projects Delivered",
    value: "1,200+",
    helper: language === 'kh' ? "ថាមពល ទឹក និងតំបន់ឧស្សាហកម្ម។" : "Power, water, and industrial sites.",
  },
];

export const getBusinessPillars = (language: 'en' | 'kh') => [
  {
    name: language === 'kh' ? "ប្រព័ន្ធអគ្គិសនី" : "Electrical Systems",
    description: language === 'kh'
      ? "ការផលិត ការដំឡើង និងការធ្វើតេស្តសម្រាប់បណ្តាញចែកចាយ អនុស្ថានីយ និងគម្រោងការពារ។"
      : "Manufacturing, installation, and testing for distribution networks, substations, and protection schemes.",
    icon: "bxs-bolt",
  },
  {
    name: language === 'kh' ? "ហេដ្ឋារចនាសម្ព័ន្ធទឹក" : "Water Infrastructure",
    description: language === 'kh'
      ? "ឧបករណ៍បូមទឹក ចម្រោះទឹក និងចែកចាយកម្រិតស្តង់ដារដែលរក្សាការផ្គត់ផ្គង់ដល់សហគមន៍។"
      : "Utilities-grade pumping, purification, and distribution equipment that keeps communities supplied.",
    icon: "bxs-droplet",
  },
  {
    name: language === 'kh' ? "វិស្វកម្ម & ការប្រឹក្សា" : "Engineering & Consultation",
    description: language === 'kh'
      ? "មន្ទីរពិសោធន៍ ការសម្របសម្រួលបញ្ជូនត ការធ្វើរោគវិនិច្ឆ័យ និងការប្រតិបត្តិ EPC ប្រកបដោយប្រសិទ្ធភាពគាំទ្រដោយក្រុមដែលមានបទពិសោធន៍។"
      : "Testing labs, relay coordination, diagnostics, and turnkey EPC execution backed by experienced teams.",
    icon: "bxs-compass",
  },
];

export const getWhyChooseUs = (language: 'en' | 'kh') => [
  {
    title: language === 'kh' ? "ក្រុមការងារអាជីព" : "Professional team",
    detail: language === 'kh'
      ? "វិស្វករ អ្នកបច្ចេកទេស និងអ្នកគ្រប់គ្រងគម្រោងដែលមានជំនាញ ដែលស្របតាមស្តង់ដារអន្តរជាតិលើរាល់ការសាងសង់។"
      : "Skilled engineers, technicians, and project managers who align with international standards on every build.",
    icon: "/professional-team.png",
  },
  {
    title: language === 'kh' ? "អាចទុកចិត្តបាន & សុវត្ថិភាព" : "Reliable & safe",
    detail: language === 'kh'
      ? "QA ដ៏តឹងរ៉ឹង សម្ភារៈដែលបានបញ្ជាក់ និងទម្លាប់ដែលបានបង្ហាញឱ្យឃើញ ដូចជាការចម្រោះប្រេង និងការធ្វើតេស្តជាប្រចាំ/ប្រភេទ។"
      : "Rigorous QA, certified materials, and proven routines such as oil purification and routine/type testing.",
    icon: "/reliable-and-safe.png",
  },
  {
    title: language === 'kh' ? "ការប្រាស្រ័យទាក់ទងច្បាស់លាស់" : "Clear communication",
    detail: language === 'kh'
      ? "BOQ តម្លាភាព ការរាយការណ៍ប្រចាំសប្តាហ៍ និងការពិនិត្យរួមគ្នានៅទូទាំងដំណាក់កាលគម្រោងនីមួយៗ។"
      : "Transparent BOQs, weekly reporting, and collaborative reviews throughout each project stage.",
    icon: "/clear-communication.png",
  },
  {
    title: language === 'kh' ? "ការដឹកជញ្ជូនទាន់ពេលវេលា" : "On-time delivery",
    detail: language === 'kh'
      ? "ក្រុមភស្តុភារដែលខិតខំប្រឹងប្រែង និងការផលិតក្នុងស្រុកធានាថាកាលវិភាគនៅតែដើរតាមគន្លង។"
      : "Dedicated logistics teams and in-house fabrication ensure schedules remain on track.",
    icon: "/on-time-delivery.png",
  },
];

export const getServices = (language: 'en' | 'kh'): Service[] => [
  {
    slug: "manufacturing-and-repair",
    name: language === 'kh' ? "ការផលិត និងការជួសជុល" : "Manufacturing and Repair",
    description: language === 'kh'
      ? "យើងរចនា និងផលិតឧបករណ៍អគ្គិសនីដែលមានគុណភាពខ្ពស់ រួមទាំងខ្សែ និងឧបករណ៍ចម្លងដែលមានគុណភាពខ្ពស់ ម៉ាស៊ីនបំប្លែងចែកចាយ ផ្ទាំងបញ្ជា និងបង្គោលបេតុង។"
      : "We design and manufacture high-quality electrical equipment, including high-quality cables and conductors, distribution transformers, control panels, and concrete poles.",
    details: language === 'kh'
      ? "ឧបករណ៍ចម្លង និងម៉ាស៊ីនបំប្លែងគុណភាពខ្ពស់ដែលបំពេញតាមតម្រូវការ TIS, IEC, និង ANSI/IEEE។ សេវាកម្មរួមមានការកែលម្អ ការរុំឡើងវិញ និងការធ្វើតេស្តលឿនសម្រាប់កងនាវាចាស់។"
      : "High-quality conductors and transformer designs that meet TIS, IEC, and ANSI/IEEE requirements. Services include refurbishment, rewinding, and accelerated testing for legacy fleets.",
    highlights: language === 'kh'
      ? [
          "ម៉ាស៊ីនបំប្លែងចែកចាយរហូតដល់ 35kV",
          "ផ្ទាំងបញ្ជា LV/MV តាមតម្រូវការ",
          "បង្គោលបេតុង និងរចនាសម្ព័ន្ធដែក",
        ]
      : [
          "Distribution transformers up to 35kV",
          "Custom LV/MV control panels",
          "Concrete poles and steel structures",
        ],
    icon: "/manufacturing-and-repair.png",
    image: "/manufacturing-repair.png",
  },
  {
    slug: "construction-and-installation",
    name: language === 'kh' ? "ការសាងសង់ និងការដំឡើង" : "Construction and Installation",
    description: language === 'kh'
      ? "ឧបករណ៍វាស់ស្ទង់អគ្គិសនីកម្រិតខ្ពស់ និងម៉ូនីទ័រ។ យើងផ្តល់ជូននូវដំណោះស្រាយហេដ្ឋារចនាសម្ព័ន្ធថាមពលពីចុងដល់ចុង—ពីបង្គោល និងម៉ាស៊ីនបំប្លែង រហូតដល់អនុស្ថានីយដែលបំពាក់យ៉ាងពេញលេញ។ ប្រព័ន្ធបញ្ជាទិញដើម្បីត្រួតពិនិត្យ និងគ្រប់គ្រងការប្រើប្រាស់ថាមពលយ៉ាងត្រឹមត្រូវ។"
      : "Advanced electric meters and monitor. We deliver end-to-end power infrastructure solutions—from poles and transformers to fully equipped substations. Ordering systems to monitor and control energy consumption accurately.",
    details: language === 'kh'
      ? "យើងគ្រប់គ្រងការរចនា ការរៀបចំ BOQ ការលទ្ធកម្ម ការដំឡើង ការដាក់ឱ្យដំណើរការ និងការប្រគល់សម្រាប់បណ្តាញ MV/LV កុងដង់សឺរ និងប្រព័ន្ធត្រួតពិនិត្យរួមបញ្ចូលគ្នា។"
      : "We handle design, BOQ preparation, procurement, installation, commissioning, and handover for MV/LV networks, capacitor banks, and integrated monitoring systems.",
    highlights: language === 'kh'
      ? [
          "ខ្សែចែកចាយ MV 22kV & 35kV",
          "ការដំឡើង & ការធ្វើតេស្តអនុស្ថានីយ",
          "ហេដ្ឋារចនាសម្ព័ន្ធវាស់ស្ទង់កម្រិតខ្ពស់",
        ]
      : [
          "MV 22kV & 35kV distribution lines",
          "Substation assembly & testing",
          "Advanced metering infrastructure",
        ],
    icon: "/construction-and-installation.png",
    image: "/construction-installation.png",
  },
  {
    slug: "testing-and-engineering-consultation",
    name: language === 'kh' ? "ការធ្វើតេស្ត និងការប្រឹក្សាវិស្វកម្ម" : "Testing and Engineering Consultation",
    description: language === 'kh'
      ? "ពីការកំណត់បញ្ជូនត និងការចម្រោះប្រេងម៉ាស៊ីនបំប្លែង រហូតដល់ការធ្វើរោគវិនិច្ឆ័យប្រព័ន្ធ សេវាកម្មធ្វើតេស្តរបស់យើងត្រូវបានរចនាឡើងដើម្បីបង្កើនដំណើរការអតិបរមា និងពន្យារអាយុកាលឧបករណ៍។ យើងផ្តល់នូវលទ្ធផលច្បាស់លាស់ និងគួរឱ្យទុកចិត្តដើម្បីគាំទ្រប្រតិបត្តិការរលូន។"
      : "From relay setting and transformer oil purification to system diagnostics, our testing services are designed to maximize performance and extend equipment lifespan. We deliver precise, trusted results to support smooth operations.",
    details: language === 'kh'
      ? "វិស្វករក្នុងស្រុករបស់យើងផ្តល់ការគាំទ្រក្នុងការដាក់ឱ្យដំណើរការ ការត្រួតពិនិត្យកម្ដៅ និងកម្មវិធីថែទាំព្យាករណ៍ដើម្បីបង្កើនពេលវេលាដំណើរការអតិបរមា។"
      : "Our in-house engineers provide commissioning support, thermographic inspections, and predictive maintenance programs to maximize uptime.",
    highlights: language === 'kh'
      ? [
          "ការការពារ & ការសម្របសម្រួលបញ្ជូនត",
          "មន្ទីរពិសោធន៍ធ្វើតេស្តវាល",
          "ការថែទាំផ្អែកលើស្ថានភាព",
        ]
      : [
          "Protection & relay coordination",
          "Field testing labs",
          "Condition-based maintenance",
        ],
    icon: "/testing-and-eng-consultation.png",
    image: "/testing-engineering.png",
  },
  {
    slug: "utilities-provider",
    name: language === 'kh' ? "អ្នកផ្តល់សេវាទឹកភ្លើង" : "Utilities Provider",
    description: language === 'kh'
      ? "លើសពីឧបករណ៍ និងសេវាកម្ម ធិនីម៉ិចគឺជាអ្នកផ្តល់សេវាទឹកភ្លើងដែលគួរឱ្យទុកចិត្ត ដោយផ្តល់នូវហេដ្ឋារចនាសម្ព័ន្ធអគ្គិសនី និងទឹកនៅទូទាំងខេត្តក្នុងប្រទេសកម្ពុជា។"
      : "Beyond equipment and services, Dhinimex is a trusted utilities provider, delivering both electrical and water infrastructure across provinces in Cambodia.",
    details: language === 'kh'
      ? "យើងវិនិយោគលើការផលិត ការចែកចាយ និងបណ្តាញទឹក ដោយដំណើរការជាមួយប្រព័ន្ធត្រួតពិនិត្យទំនើប និងការគាំទ្រពេញមួយម៉ោង។"
      : "We invest in generation, distribution, and water networks, operating with modern monitoring systems and round-the-clock support.",
    highlights: language === 'kh'
      ? [
          "សម្បទានសេវាខេត្ត",
          "រោងចក្រប្រព្រឹត្តិកម្មទឹក",
          "ការដាក់ពង្រាយម៉ែត្រឆ្លាតវៃ",
        ]
      : [
          "Provincial utility concessions",
          "Water treatment plants",
          "Smart meter deployments",
        ],
    icon: "/utilities-provider.png",
    image: "/utilities-elec-provider.png",
  },
  {
    slug: "electrical-and-heavy-equipment-supply",
    name: language === 'kh' ? "ការផ្គត់ផ្គង់អគ្គិសនី និងឧបករណ៍ធុនធ្ងន់" : "Electrical and Heavy Equipment Supply",
    description: language === 'kh'
      ? "យើងផ្តល់ជូននូវដំណោះស្រាយឧបករណ៍អគ្គិសនី និងឧបករណ៍ធុនធ្ងន់ដែលមានគុណភាពខ្ពស់យ៉ាងទូលំទូលាយ ដើម្បីគាំទ្រដល់ការចែកចាយថាមពល ការដំឡើង និងគម្រោងថែទាំ។"
      : "We provide a comprehensive range of high-quality electrical and heavy equipment solutions to support power distribution, installation, and maintenance projects.",
    details: language === 'kh'
      ? "សារពើភ័ណ្ឌដ៏ទូលំទូលាយរបស់យើងរួមមានខ្សែ MV/LV ឧបករណ៍ប្តូរ ម៉ាស៊ីនបំប្លែង ឧបករណ៍ការពារ និងគ្រឿងចក្រសំណង់ដើម្បីបំពេញតម្រូវការគម្រោងចម្រុះ។"
      : "Our extensive inventory includes MV/LV cables, switchgear, transformers, protection devices, and construction machinery to meet diverse project needs.",
    highlights: language === 'kh'
      ? [
          "ខ្សែ MV/LV និងគ្រឿងបន្លាស់",
          "ឧបករណ៍ប្តូរ និងឧបករណ៍ការពារ",
          "ការជួលគ្រឿងចក្រសំណង់",
        ]
      : [
          "MV/LV cables and accessories",
          "Switchgear and protection devices",
          "Construction equipment rental",
        ],
    icon: "/manufacturing-and-repair.png",
    image: "/utilities-elec-provider.png",
  },
  {
    slug: "water-and-utility",
    name: language === 'kh' ? "ទឹក & សេវា" : "Water & Utility",
    description: language === 'kh'
      ? "ម៉ាស៊ីនបូម ម៉ូទ័រ និងឧបករណ៍ប្រព្រឹត្តិកម្មទឹក ដើម្បីគាំទ្រដល់ការគ្រប់គ្រងទឹក និងសេវាប្រកបដោយប្រសិទ្ធភាព។"
      : "Pumps, motors, and water treatment tools to support efficient water and utility management.",
    details: language === 'kh'
      ? "យើងផ្គត់ផ្គង់ និងដំឡើងប្រព័ន្ធបូមទឹក ឧបករណ៍ប្រព្រឹត្តិកម្ម និងដំណោះស្រាយគ្រប់គ្រងសេវាសម្រាប់កម្មវិធីក្រុង និងឧស្សាហកម្ម។"
      : "We supply and install water pumping systems, treatment equipment, and utility management solutions for municipal and industrial applications.",
    highlights: language === 'kh'
      ? [
          "ម៉ាស៊ីនបូមទឹក និងម៉ូទ័រ",
          "ឧបករណ៍ប្រព្រឹត្តិកម្ម",
          "ប្រព័ន្ធគ្រប់គ្រងសេវា",
        ]
      : [
          "Water pumps and motors",
          "Treatment equipment",
          "Utility management systems",
        ],
    icon: "/utilities-provider.png",
    image: "/water-supply.png",
  },
];

export const getFaqs = (language: 'en' | 'kh'): Faq[] => [
  {
    question: language === 'kh' ? "តើតំបន់សេវាកម្មរបស់អ្នកគឺជាអ្វី?" : "What is your service area?",
    answer: language === 'kh'
      ? "យើងផ្តល់នូវដំណោះស្រាយទូលំទូលាយនៅក្នុង៖ ការសាងសង់បណ្តាញចែកចាយអគ្គិសនី MV 22kV និង 35kV, បណ្តាញចែកចាយ LV និងអនុស្ថានីយម៉ាស៊ីនបំប្លែងចែកចាយ, ប្រព័ន្ធវាស់ស្ទង់ ការការពារ និងការដំឡើងឧបករណ៍ប្តូរ, Switchgear, ផ្ទាំង LVDB និងការដំឡើងកុងដង់សឺរ, ការដំឡើងឧបករណ៍តម្រង់វ៉ុលស្វ័យប្រវត្តិ (AVR) និង SVR, ការដាក់ពង្រាយប្រព័ន្ធសូឡាភ្ជាប់បណ្តាញ និងក្រៅបណ្តាញ, ការដំឡើងបណ្តាញចែកចាយទឹក, សេវាកម្មថែទាំ និងដោះស្រាយបញ្ហា។"
      : "We provide comprehensive solutions in: MV 22kV and 35kV electricity distribution network construction, LV distribution network and distribution transformer substations, Metering systems, protection, and switching device installation, Switchgear, LVDB panels, and capacitor bank installations, Auto voltage regulator (AVR) and SVR installations, On- and off-grid solar system deployment, Water distribution network installation, Maintenance and troubleshooting services.",
  },
  {
    question: language === 'kh' ? "តើអ្នកមានបទពិសោធន៍ប៉ុន្មានឆ្នាំ?" : "How many years of experience do you have?",
    answer: language === 'kh'
      ? "យើងនាំយកជំនាញដែលបានបង្ហាញឱ្យឃើញជិត 22 ឆ្នាំនៅទូទាំងវិញ្ញាសាវិស្វកម្ម និងសំណង់ជាច្រើន។"
      : "We bring nearly 22 years of proven expertise across multiple engineering and construction disciplines.",
  },
  {
    question: language === 'kh' ? "តើអ្នកផ្តល់សេវាកម្មអ្វីខ្លះ?" : "What services do you offer?",
    answer: language === 'kh'
      ? "ការផ្គត់ផ្គង់អគ្គិសនី និងឧបករណ៍ធុនធ្ងន់, សេវាកម្មសាងសង់ និងដំឡើង, សេវាកម្មប្រឹក្សា និងវិស្វកម្ម, សេវាកម្មផលិត និងជួសជុល។"
      : "Electrical and heavy equipment supply, Construction and installation services, Engineering and consultation services, Manufacturing and repair services.",
  },
  {
    question: language === 'kh' ? "តើអ្នកមានកម្លាំងពលកម្ម និងគ្រឿងចក្រគ្រប់គ្រាន់ដើម្បីបញ្ចប់គម្រោងដែរឬទេ?" : "Do you have enough manpower and machinery to complete projects?",
    answer: language === 'kh'
      ? "បាទ/ចាស។ ក្រុមរបស់យើងមានវិស្វករដែលមានលក្ខណៈសម្បត្តិគ្រប់គ្រាន់ កម្មករជំនាញ និងអ្នកបច្ចេកទេសដែលខិតខំប្រឹងប្រែងក្នុងការផ្តល់គម្រោងប្រកបដោយប្រសិទ្ធភាព។ យើងត្រូវបានបំពាក់ដោយឧបករណ៍ និងគ្រឿងចក្រទំនើបៗ ដោយធានាថាគម្រោងត្រូវបានបញ្ចប់ទាន់ពេលវេលា និងស្របតាមស្តង់ដារគុណភាពខ្ពស់បំផុត។"
      : "Yes. Our team consists of qualified engineers, skilled workers, and technicians dedicated to delivering projects efficiently. We are equipped with modern tools and machinery, ensuring projects are completed on time and to the highest quality standards.",
  },
  {
    question: language === 'kh' ? "តើដំណើរការសាងសង់គឺជាអ្វី?" : "What is the construction process?",
    answer: language === 'kh'
      ? "ដំណើរការរបស់យើងអនុវត្តតាមវិធីសាស្រ្តដែលមានរចនាសម្ព័ន្ធ៖ 1. ការចុះមើលទីតាំង និងការពិគ្រោះយោបល់ជាមួយម្ចាស់គម្រោង, 2. ការរៀបចំ BOQ និងគំនូរលម្អិត, 3. ការដាក់ស្នើសំណើ និងការយល់ព្រមពីអតិថិជន, 4. ការលទ្ធកម្ម និងការដឹកជញ្ជូនឧបករណ៍, 5. ការសាងសង់ ការធ្វើតេស្ត និងការដាក់ឱ្យដំណើរការ, 6. ការប្រគល់គម្រោង និងការគាំទ្រក្រោយពេលលក់។"
      : "Our process follows a structured approach: 1. Site visit and consultation with the project owner, 2. Preparation of BOQ and detailed drawings, 3. Proposal submission and customer approval, 4. Procurement and delivery of equipment, 5. Construction, testing, and commissioning, 6. Project handover and after-sales support.",
  },
  {
    question: language === 'kh' ? "តើមានអ្វីកើតឡើងប្រសិនបើគម្រោងលើសពីថវិកា?" : "What happens if the project goes over budget?",
    answer: language === 'kh'
      ? "យើងធ្វើការយ៉ាងជិតស្និទ្ធជាមួយអតិថិជនដើម្បីរៀបចំ BOQ ដែលស្របតាមតម្រូវការថវិកា។ ប្រសិនបើការងារបន្ថែមត្រូវបានទាមទារលើសពីវិសាលភាពដែលបានព្រមព្រៀង យើងនឹងទំនាក់ទំនងដោយតម្លាភាព និងឈានដល់កិច្ចព្រមព្រៀងទៅវិញទៅមកមុនពេលបន្ត។"
      : "We work closely with clients to prepare BOQs that align with budget requirements. If additional work is required beyond the agreed scope, we will communicate transparently and reach a mutual agreement before proceeding.",
  },
  {
    question: language === 'kh' ? "តើត្រូវចំណាយពេលប៉ុន្មានដើម្បីទទួលបានការប៉ាន់ស្មាន?" : "How long does it take to get an estimate?",
    answer: language === 'kh'
      ? "បន្ទាប់ពីការត្រួតពិនិត្យទីតាំង និងការពិគ្រោះយោបល់ យើងផ្តល់ការប៉ាន់ស្មាន BOQ និងគំនូរសម្រាប់ការយល់ព្រមក្នុងរយៈពេលប្រហែលមួយសប្តាហ៍។"
      : "Following a site inspection and consultation, we provide estimates, BOQs, and drawings for approval within approximately one week.",
  },
  {
    question: language === 'kh' ? "តើខ្ញុំអាចស្នើសុំការផ្លាស់ប្តូរក្នុងអំឡុងពេលគម្រោងបានទេ?" : "Will I be able to request changes during the project?",
    answer: language === 'kh'
      ? "បាទ/ចាស។ រាល់ការផ្លាស់ប្តូរដែលបានស្នើសុំក្នុងអំឡុងពេលគម្រោងនឹងត្រូវបានពិនិត្យ ពិភាក្សា និងយល់ព្រមដើម្បីធានាបាននូវការស្របតាមការរំពឹងទុករបស់អតិថិជន។"
      : "Yes. Any changes requested during the project will be reviewed, discussed, and agreed upon to ensure alignment with client expectations.",
  },
];

export const getTimeline = (language: 'en' | 'kh'): TimelineEvent[] => [
  {
    year: "2003",
    title: language === 'kh' ? "ការចាប់ផ្តើមដ៏រាបទាប" : "Humble beginnings",
    description: language === 'kh'
      ? "ធិនីម៉ិចចាប់ផ្តើមជាអ្នកផ្គត់ផ្គង់ផ្អែកលើពាណិជ្ជកម្មដែលផ្តោតលើឧបករណ៍អគ្គិសនី និងសមាសធាតុផ្គត់ផ្គង់ទឹក។"
      : "Dhinimex launches as a trade-based supplier focused on electrical appliances and water supply components.",
  },
  {
    year: "2012",
    title: language === 'kh' ? "ការពង្រីកការផលិត" : "Manufacturing scale-up",
    description: language === 'kh'
      ? "ការផលិតក្នុងស្រុកសម្រាប់ម៉ាស៊ីនបំប្លែង ឧបករណ៍ចម្លង និងផ្ទាំងបន្ទះបង្កើនល្បឿន ដោយដោះសោការចែកចាយ EPC។"
      : "In-house fabrication for transformers, conductors, and panel boards accelerates, unlocking EPC delivery.",
  },
  {
    year: "2016",
    title: language === 'kh' ? "ការពង្រីកសេវា" : "Utilities expansion",
    description: language === 'kh'
      ? "ក្រុមនេះវិនិយោគលើសេវាខេត្ត ដោយដំណើរការសម្បទានអគ្គិសនី និងទឹកជាមួយនឹងការត្រួតពិនិត្យឆ្លាតវៃ។"
      : "The group invests in provincial utilities, operating electrical and water concessions with smart monitoring.",
  },
  {
    year: "2021",
    title: language === 'kh' ? "ការច្នៃប្រឌិត & មន្ទីរពិសោធន៍ធ្វើតេស្ត" : "Innovation & testing labs",
    description: language === 'kh'
      ? "អង្គភាពប្រឹក្សា និងធ្វើតេស្តវិស្វកម្មចាប់ផ្តើមផ្តល់នូវការសម្របសម្រួលបញ្ជូនត ការធ្វើរោគវិនិច្ឆ័យ និងការថែទាំព្យាករណ៍។"
      : "Engineering consultation and testing units launch to deliver relay coordination, diagnostics, and predictive maintenance.",
  },
  {
    year: language === 'kh' ? "ថ្ងៃនេះ" : "Today",
    title: language === 'kh' ? "ក្រុមហ៊ុន 18, សញ្ជាតិ 6" : "18 companies, 6 nationalities",
    description: language === 'kh'
      ? "ធិនីម៉ិចជួលអ្នកជំនាញជាង 500 នាក់នៅទូទាំងវិស័យវិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យាចំនួនប្រាំជាមួយនឹងទស្សនវិស័យសកល។"
      : "Dhinimex employs 500+ professionals across five scientific and technological sectors with a global outlook.",
  },
];

export const getLeadership = (language: 'en' | 'kh'): Leader[] => [
  {
    name: language === 'kh' ? "វង្ស សោភ័ណ្ឌ" : "Vong Sorphorn",
    title: language === 'kh' ? "ប្រធានក្រុមប្រឹក្សាភិបាល" : "Chairwoman of the Board",
    bio: language === 'kh'
      ? "បានបង្កើត ធិនីម៉ិចក្នុងឆ្នាំ 2003 ហើយបន្តដឹកនាំក្រុមហ៊ុនដោយផ្តោតលើក្រមសីលធម៌ តម្លាភាព និងគុណភាពសេវាកម្ម។"
      : "Founded Dhinimex in 2003 and continues to guide the company with a focus on ethics, transparency, and service quality.",
    quote: language === 'kh'
      ? "យើងទទួលបានការជឿទុកចិត្តដោយការប្រកាន់ខ្ជាប់នូវស្តង់ដារសីលធម៌ដ៏រឹងមាំ និងផ្តល់នូវភាពល្អឥតខ្ចោះនៅក្នុងរាល់ការចូលរួម។"
      : "We earn trust by upholding strong ethical standards and delivering excellence in every engagement.",
    portrait: "/bod.jpg",
  },
  {
    name: language === 'kh' ? "ស៊ូថាសាន ឆេឡាឌូរ៉ៃ" : "Sutharsan Chelladurai",
    title: language === 'kh' ? "នាយកគ្រប់គ្រង" : "Managing Director",
    bio: language === 'kh'
      ? "ត្រួតពិនិត្យការប្រតិបត្តិ EPC ការផលិត និងប្រតិបត្តិការសេវាជាមួយនឹងទស្សនវិជ្ជាភាពជាអ្នកដឹកនាំដែលផ្អែកលើការទទួលខុសត្រូវ។"
      : "Oversees EPC execution, manufacturing, and utilities operations with a leadership philosophy grounded in responsibility.",
    quote: language === 'kh'
      ? "ភាពជាអ្នកដឹកនាំគឺការទទួលខុសត្រូវ ការបំផុសគំនិតជាមួយនឹងចក្ខុវិស័យ និងការផ្តល់លទ្ធផលដែលបង្កើតអនាគតដ៏ល្អប្រសើរ។"
      : "Leadership is taking responsibility, inspiring with vision, and delivering results that shape a better future.",
    portrait: "/md.jpg",
  },
  {
    name: language === 'kh' ? "គង់ ហ្គេកណៃ" : "Kong Gheknai",
    title: language === 'kh' ? "អគ្គនាយករង ហិរញ្ញវត្ថុ & សវនកម្ម" : "Deputy Managing Director Finance & Audit",
    bio: language === 'kh'
      ? "ជំរុញយុទ្ធសាស្ត្រហិរញ្ញវត្ថុ និងអភិបាលកិច្ច ដោយធានាបាននូវកំណើនប្រកបដោយវិន័យនៅទូទាំងផលប័ត្ររបស់ក្រុម។"
      : "Drives financial strategy and governance, ensuring disciplined growth across the group’s portfolio.",
    quote: language === 'kh'
      ? "ចំណង់ចំណូលចិត្ត និងវិន័យធ្វើឱ្យអ្នកក្លាយជាមនុស្សកាន់តែប្រសើរ។"
      : "Passion and discipline make you a better person.",
    portrait: "/dmdf.jpg",
  },
  {
    name: language === 'kh' ? "ចាន់ តុលា" : "Chan Tola",
    title: language === 'kh' ? "អគ្គនាយករង ប្រតិបត្តិការ" : "Deputy Managing Director Operations",
    bio: language === 'kh'
      ? "ត្រួតពិនិត្យភាពល្អឥតខ្ចោះនៃប្រតិបត្តិការ និងការបង្កើនប្រសិទ្ធភាពដំណើរការនៅទូទាំងការផលិត សេវា និងការផ្តល់គម្រោង។"
      : "Oversees operational excellence and process optimization across manufacturing, utilities, and project delivery.",
    quote: language === 'kh'
      ? "ការទទួលខុសត្រូវផ្ទាល់ខ្លួននឹងពង្រឹងភាពល្អឥតខ្ចោះជារួម ដែលនាំឲ្យយើងទៅកាន់តែឆ្ងាយជាមួយគ្នា។"
      : "We go farther together when individual responsibility strengthens collective excellence.",
    portrait: "/dmdo.svg",
  },
];

export const getBrands = (language: 'en' | 'kh'): Brand[] => [
  {
    name: "Fujitsu",
    description: language === 'kh'
      ? "ឧបករណ៍អគ្គិសនី និងស្វ័យប្រវត្តិកម្មកម្រិតខ្ពស់ដែលពឹងផ្អែកដោយសេវា និងឧស្សាហកម្មកម្ពុជា។"
      : "Advanced electrical and automation equipment relied on by Cambodian utilities and industries.",
    sector: language === 'kh' ? "អគ្គិសនី" : "Electrical",
    logo: "https://www.dhinimex.com/wp-content/uploads/2025/09/ALL-LOGO-27.png",
  },
  {
    name: "Kyoritsu",
    description: language === 'kh'
      ? "ឧបករណ៍វាស់ស្ទង់ច្បាស់លាស់សម្រាប់ក្រុមដាក់ឱ្យដំណើរការ និងថែទាំ។"
      : "Precision measurement instruments for commissioning and maintenance teams.",
    sector: language === 'kh' ? "ឧបករណ៍" : "Instrumentation",
    logo: "https://www.dhinimex.com/wp-content/uploads/2025/09/ALL-LOGO-26.png",
  },
  {
    name: "Eaton",
    description: language === 'kh'
      ? "គុណភាពថាមពល ឧបករណ៍ប្តូរ និងដំណោះស្រាយត្រួតពិនិត្យដែលបានកសាងឡើងតាមស្តង់ដារសកល។"
      : "Power quality, switchgear, and control solutions built to global standards.",
    sector: language === 'kh' ? "ថាមពល" : "Power",
    logo: "https://www.dhinimex.com/wp-content/uploads/2025/09/ALL-LOGO-25.png",
  },
  {
    name: "KCC",
    description: language === 'kh'
      ? "សម្ភារៈ និងថ្នាំកូតដែលមានប្រសិទ្ធភាពខ្ពស់ត្រូវបានប្រើប្រាស់នៅទូទាំងគម្រោងហេដ្ឋារចនាសម្ព័ន្ធរបស់យើង។"
      : "High-performance materials and coatings used across our infrastructure projects.",
    sector: language === 'kh' ? "ឧស្សាហកម្ម" : "Industrial",
    logo: "https://www.dhinimex.com/wp-content/uploads/2025/09/ALL-LOGO-24.png",
  },
  {
    name: "RAJ",
    description: language === 'kh'
      ? "គ្រឿងបន្លាស់ និងសមាសធាតុអគ្គិសនីឯកទេសសម្រាប់បណ្តាញចែកចាយ។"
      : "Specialized electrical accessories and components for distribution networks.",
    sector: language === 'kh' ? "គ្រឿងបន្លាស់" : "Accessories",
    logo: "https://www.dhinimex.com/wp-content/uploads/2025/09/ALL-LOGO-23.png",
  },
];

const brandFiles = [
  "01", "02", "03", "05", "07", "10", "11", "12", "13", "14", "15", "16", "17", "27",
];

export const homePageBrands = brandFiles.map((num) => ({
  name: `Brand ${num}`,
  logo: `/brands/ALL-LOGO-${num}.png`,
}));

import { getProductCategories } from "./product-categories";
export { getProductCategories };

export const getPosts = (language: 'en' | 'kh'): Post[] => [
  {
    slug: "exploring-culture-together",
    title: language === 'kh' ? "ស្វែងយល់ពីវប្បធម៌ជាមួយគ្នា" : "Exploring culture together",
    date: "2025-08-11",
    tag: "Event",
    excerpt: language === 'kh'
      ? "ពេលវេលាក្រុមនៅសៀមរាបអបអរសាទរសិល្បៈហត្ថកម្ម និងសហគមន៍។"
      : "Team moments in Siem Reap celebrating craftsmanship and community.",
    cover: "https://www.dhinimex.com/wp-content/uploads/2025/08/img-post_1.png",
    content: language === 'kh'
      ? [
          "សមាជិកក្រុមមកពីទូទាំងប្រទេសកម្ពុជាបានធ្វើដំណើរទៅកាន់ខេត្តសៀមរាប ដើម្បីស្វែងយល់ពីតំបន់បេតិកភណ្ឌ ពង្រឹងកិច្ចសហការ និងអបអរសាទរវប្បធម៌ដែលជម្រុញសិល្បៈហត្ថកម្មរបស់យើង។",
          "សិក្ខាសាលាផ្តោតលើភាពជាអ្នកដឹកនាំ សុវត្ថិភាព និងការច្នៃប្រឌិត—ពង្រឹងរបៀបដែល ធិនីម៉ិចរួមបញ្ចូលប្រពៃណីជាមួយនឹងវិស្វកម្មដែលសម្លឹងទៅមុខ។",
        ]
      : [
          "Team members from across Cambodia traveled to Siem Reap to explore heritage sites, strengthen collaboration, and celebrate the culture that inspires our craft.",
          "Workshops focused on leadership, safety, and innovation—reinforcing how Dhinimex combines tradition with forward-looking engineering.",
        ],
  },
  {
    slug: "utilities-upgrade-program",
    title: language === 'kh' ? "កម្មវិធីធ្វើឱ្យប្រសើរឡើងសេវាខេត្តចាប់ផ្តើម" : "Provincial utilities upgrade program kicks off",
    date: "2025-10-04",
    tag: "News",
    excerpt: language === 'kh'
      ? "ធិនីម៉ិចសហការជាមួយអាជ្ញាធរខេត្តដើម្បីពង្រីកការចូលប្រើប្រាស់អគ្គិសនី និងទឹកដែលអាចទុកចិត្តបាន។"
      : "Dhinimex partners with provincial authorities to expand reliable electricity and water access.",
    cover: "https://www.dhinimex.com/wp-content/uploads/2025/08/img-post_1.png",
    content: language === 'kh'
      ? [
          "កម្មវិធីពហុដំណាក់កាលគ្របដណ្តប់លើការពង្រីក MV អនុស្ថានីយតូចៗថ្មី និងម៉ាស៊ីនបូមជំរុញដែលផ្តល់ថាមពល និងទឹកប្រកបដោយសុវត្ថិភាពដល់សហគមន៍ដែលកំពុងរីកចម្រើន។",
          "ក្រុមការងារក្នុងស្រុកត្រូវបានបណ្តុះបណ្តាលលើការថែទាំទ្រព្យសកម្ម ខណៈពេលដែលផ្ទាំងគ្រប់គ្រងការត្រួតពិនិត្យពីចម្ងាយផ្តល់នូវតម្លាភាពដល់អ្នកពាក់ព័ន្ធ។",
        ]
      : [
          "The multi-phase program covers MV extensions, new compact substations, and booster pumps that deliver safe power and water to growing communities.",
          "Local teams are trained on asset care, while remote monitoring dashboards provide transparency to stakeholders.",
        ],
  },
  {
    slug: "engineering-talent-drive",
    title: language === 'kh' ? "យុទ្ធនាការស្វែងរកទេពកោសល្យវិស្វកម្ម 2025" : "Engineering talent drive 2025",
    date: "2025-09-20",
    tag: "Insight",
    excerpt: language === 'kh'
      ? "យើងកំពុងជ្រើសរើសអ្នកគ្រប់គ្រងបច្ចេកទេស អ្នកត្រួតពិនិត្យ និងនិស្សិតបញ្ចប់ការសិក្សាដើម្បីគាំទ្រការពង្រីកតំបន់។"
      : "We are hiring technical managers, supervisors, and graduates to support regional expansion.",
    cover: "https://www.dhinimex.com/wp-content/uploads/2025/08/img-post_1.png",
    content: language === 'kh'
      ? [
          "ជាមួយនឹងក្រុមហ៊ុនចំនួន 18 នៅក្នុងក្រុម ផ្លូវអាជីពលាតសន្ធឹងលើការផលិត សេវា ការផ្តល់គម្រោង និងសេវាកម្មសាជីវកម្ម។",
          "បេក្ខជនត្រូវបានលើកទឹកចិត្តឱ្យដាក់ពាក្យតាមរយៈ recruitment@dhinimex.com ជាមួយនឹង CV និងលិខិតចំណាប់អារម្មណ៍ដោយកត់សម្គាល់ពីតួនាទីគោលដៅរបស់ពួកគេ។",
        ]
      : [
          "With 18 companies in the group, career paths span manufacturing, utilities, project delivery, and corporate services.",
          "Candidates are encouraged to apply via recruitment@dhinimex.com with CVs and cover letters noting their target role.",
        ],
  },
];

export const getCareers = (language: 'en' | 'kh'): CareerRole[] => [
  {
    slug: "technical-manager",
    title: language === 'kh' ? "អ្នកគ្រប់គ្រងបច្ចេកទេស" : "Technical Manager",
    location: language === 'kh' ? "ភ្នំពេញ" : "Phnom Penh",
    position: language === 'kh' ? "ពេញម៉ោង" : "Full-time",
    deadline: language === 'kh' ? "20 កញ្ញា 2026" : "September 20, 2026",
    url: "https://www.dhinimex.com/careers/technical-manager/",
    summary: language === 'kh'
      ? "ដឹកនាំក្រុមគម្រោងពហុជំនាញដែលផ្តល់ហេដ្ឋារចនាសម្ព័ន្ធ MV/LV និងទ្រព្យសកម្មសេវា។"
      : "Lead multi-disciplinary project teams delivering MV/LV infrastructure and utility assets.",
    description: language === 'kh'
      ? "យើងកំពុងស្វែងរក **អ្នកគ្រប់គ្រងបច្ចេកទេស** ដើម្បីដឹកនាំប្រតិបត្តិការវិស្វកម្ម ការអភិវឌ្ឍផលិតផល និងសេវាកម្មបច្ចេកទេស។ តួនាទីនេះរួមបញ្ចូលទាំងការគ្រប់គ្រងការរៀបចំផែនការគម្រោង ថវិកា ឯកសារ និងការអនុលោមតាមច្បាប់ ខណៈពេលដែលផ្តល់ភាពជាអ្នកដឹកនាំបច្ចេកទេសដល់ផ្នែកវិស្វកម្ម ការលក់ និងក្រុមសេវាកម្មអតិថិជន។"
      : "We are seeking a **Technical Manager** to lead engineering operations, product development, and technical services. This role includes managing project planning, budgets, documentation, and compliance while providing technical leadership to engineering, sales, and customer service teams.",
    keyResponsibilities: language === 'kh'
      ? [
          "ដឹកនាំការអភិវឌ្ឍផលិតផល និងការកែលម្អបច្ចេកទេស",
          "គ្រប់គ្រងសកម្មភាពវិស្វកម្ម ថវិកា និងកាលវិភាគ",
          "រៀបចំ និងត្រួតពិនិត្យឯកសារបច្ចេកទេស (គំនូរ BOQ គ្រោងការណ៍)",
          "ផ្តល់ការបណ្តុះបណ្តាល និងការគាំទ្របច្ចេកទេសដល់ក្រុមផ្ទៃក្នុង",
          "ត្រួតពិនិត្យការដេញថ្លៃ សំណើ កិច្ចសន្យា និងការអនុវត្ត",
          "ធ្វើការសិក្សាទីផ្សារ និងការវិភាគគូប្រជែង",
          "ដឹកនាំការថែទាំ ជួសជុល និងកែលម្អបរិក្ខារ",
          "ជ្រើសរើស បណ្តុះបណ្តាល និងណែនាំបុគ្គលិកវិស្វកម្ម",
          "តាមដានដំណើរការក្រោយពេលលក់ និងការពេញចិត្តរបស់អតិថិជន",
          "សហការជាមួយ IT សម្រាប់ការរួមបញ្ចូលប្រព័ន្ធ និងការគាំទ្រ",
          "រាយការណ៍អំពីលទ្ធផលគម្រោង មតិកែលម្អរបស់អតិថិជន និងរង្វាស់សេវាកម្ម។",
        ]
      : [
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
    requirements: language === 'kh'
      ? [
          "បរិញ្ញាបត្រផ្នែកវិស្វកម្ម (អនុបណ្ឌិតត្រូវបានលើកទឹកចិត្ត)",
          "បទពិសោធន៍វិស្វកម្មយ៉ាងតិច 5 ឆ្នាំ ជាមួយនឹងយ៉ាងតិច 2 ឆ្នាំក្នុងការគ្រប់គ្រង",
          "ជំនាញក្នុង AutoCAD, Microsoft Office និងចំណេះដឹងឧបករណ៍ MV/LV",
          "ស្គាល់ស្តង់ដារបច្ចេកទេសកម្ពុជា",
          "ជំនាញភាពជាអ្នកដឹកនាំ និងការគ្រប់គ្រងក្រុមខ្លាំង",
          "ជំនាញភាសាខ្មែរ និងអង់គ្លេស។",
        ]
      : [
          "Bachelor's degree in Engineering (Master's preferred)",
          "Minimum 5 years' engineering experience, with at least 2 in management",
          "Proficiency in AutoCAD, Microsoft Office, and MV/LV equipment knowledge",
          "Familiarity with Cambodian technical standards",
          "Strong leadership and team management skills",
          "Proficiency in Khmer and English.",
        ],
    whatWeOffer: language === 'kh'
      ? [
          "ប្រាក់ខែប្រកួតប្រជែង (អាចចរចាបានផ្អែកលើបទពិសោធន៍)",
          "ការដំឡើងប្រាក់ខែប្រចាំឆ្នាំ និងប្រាក់រង្វាន់លើការអនុវត្ត",
          "ដំណើរកម្សាន្តបុគ្គលិក ព្រឹត្តិការណ៍ប្រចាំឆ្នាំ និងកម្មវិធីលើកទឹកចិត្ត",
          "ឱកាសបណ្តុះបណ្តាលផ្ទៃក្នុង និងខាងក្រៅ",
          "ការបណ្តុះបណ្តាលជំនាញបច្ចេកទេស និងការគ្រប់គ្រង។",
        ]
      : [
          "Competitive salary (negotiable based on experience)",
          "Annual salary increments and performance bonus",
          "Staff trips, annual events, and incentive programs",
          "Internal and external training opportunities",
          "Training in technical and managerial skills.",
        ],
    howToApply: language === 'kh'
      ? "ផ្ញើ CV របស់អ្នកទៅកាន់ **recruitment@dhinimex.com** ជាមួយនឹងប្រធានបទ៖ _ពាក្យសុំអ្នកគ្រប់គ្រងបច្ចេកទេស_។"
      : "Submit your CV to **recruitment@dhinimex.com** with the subject line: _Technical Manager Application_.",
  },
  {
    slug: "technical-supervisor",
    title: language === 'kh' ? "អ្នកត្រួតពិនិត្យបច្ចេកទេស" : "Technical Supervisor",
    location: language === 'kh' ? "ភ្នំពេញ" : "Phnom Penh",
    position: language === 'kh' ? "ពេញម៉ោង" : "Full-time",
    deadline: language === 'kh' ? "20 កញ្ញា 2026" : "September 20, 2026",
    url: "https://www.dhinimex.com/careers/technical-supervisor/",
    summary: language === 'kh'
      ? "ត្រួតពិនិត្យក្រុមការងារនៅការដ្ឋាន ទម្លាប់សុវត្ថិភាព និងការត្រួតពិនិត្យគុណភាពនៅទូទាំងការដ្ឋានសំណង់។"
      : "Oversee field crews, safety routines, and quality checks across construction sites.",
    description: language === 'kh'
      ? "យើងកំពុងជ្រើសរើសអ្នកត្រួតពិនិត្យបច្ចេកទេសដើម្បីត្រួតពិនិត្យគម្រោងវិស្វកម្ម ណែនាំក្រុមបច្ចេកទេស និងធានាការអនុលោមតាមស្តង់ដារក្រុមហ៊ុន។ តួនាទីនេះពាក់ព័ន្ធនឹងការត្រួតពិនិត្យការអនុវត្តគម្រោង ការថែទាំ សេវាកម្មក្រោយពេលលក់ និងឯកសារបច្ចេកទេស ខណៈពេលដែលសម្របសម្រួលជាមួយអ្នកគ្រប់គ្រងបច្ចេកទេស។"
      : "We are hiring a Technical Supervisor to oversee engineering projects, guide technical teams, and ensure compliance with company standards. The role involves supervising project execution, maintenance, after-sales service, and technical documentation while coordinating with the Technical Manager.",
    keyResponsibilities: language === 'kh'
      ? [
          "ត្រួតពិនិត្យ និងណែនាំក្រុមបច្ចេកទេសដើម្បីផ្តល់គម្រោងទាន់ពេលវេលា និងក្នុងកញ្ចប់ថវិកា",
          "គាំទ្រអ្នកគ្រប់គ្រងបច្ចេកទេសក្នុងការរៀបចំផែនការ ឯកសារ និងការអនុវត្តគម្រោង",
          "ធានាការអនុលោមតាមស្តង់ដារវិស្វកម្ម គំនូរ និង BOQ",
          "ត្រួតពិនិត្យកាលវិភាគថែទាំ និងសេវាកម្មក្រោយពេលលក់",
          "ផ្តល់ការបណ្តុះបណ្តាល ការធ្វើតេស្តបច្ចេកទេស និងការណែនាំដល់ផ្នែកលក់ និងក្រុមគាំទ្រអតិថិជន",
          "រៀបចំការដេញថ្លៃ សំណើ និងការប៉ាន់ស្មានថវិកាសម្រាប់គម្រោង",
          "សហការជាមួយ IT សម្រាប់ការរួមបញ្ចូលប្រព័ន្ធ និងការគាំទ្របច្ចេកទេស",
          "បង្កើតរបាយការណ៍ស្តីពីសេវាកម្មក្រោយពេលលក់ ដំណើរការគម្រោង និងការពេញចិត្តរបស់អតិថិជន។",
        ]
      : [
          "Supervise and guide technical teams to deliver projects on time and within budget",
          "Support the Technical Manager in planning, documentation, and project execution",
          "Ensure compliance with engineering standards, drawings, and BOQs",
          "Supervise maintenance schedules and after-sales services",
          "Provide training, technical testing, and guidance to sales and customer support teams",
          "Prepare bids, proposals, and budget estimates for projects",
          "Collaborate with IT for system integration and technical support",
          "Generate reports on after-sales service, project performance, and customer satisfaction.",
        ],
    requirements: language === 'kh'
      ? [
          "បរិញ្ញាបត្រផ្នែកវិស្វកម្មអគ្គិសនី",
          "បទពិសោធន៍យ៉ាងតិច 3 ឆ្នាំ រួមទាំង 1 ឆ្នាំក្នុងតួនាទីត្រួតពិនិត្យ",
          "ជំនាញក្នុង AutoCAD, Microsoft Office និងចំណេះដឹងឧបករណ៍ MV/LV",
          "ស្គាល់ស្តង់ដារបច្ចេកទេស និងបទប្បញ្ញត្តិកម្ពុជា",
          "ជំនាញភាពជាអ្នកដឹកនាំ ការទំនាក់ទំនង និងការសម្របសម្រួលក្រុមខ្លាំង",
          "ស្ទាត់ជំនាញភាសាអង់គ្លេស។",
        ]
      : [
          "Bachelor’s degree in Electrical Engineering",
          "Minimum 3 years’ experience, including 1 year in a supervisory role",
          "Proficiency in AutoCAD, Microsoft Office, and knowledge of MV/LV equipment",
          "Familiarity with Cambodian technical standards and regulations",
          "Strong leadership, communication, and team coordination skills",
          "Fluency in English.",
        ],
    whatWeOffer: language === 'kh'
      ? [
          "ប្រាក់ខែប្រកួតប្រជែង (អាចចរចាបានផ្អែកលើបទពិសោធន៍)",
          "ការដំឡើងប្រាក់ខែប្រចាំឆ្នាំ និងប្រាក់រង្វាន់លើការអនុវត្ត",
          "ដំណើរកម្សាន្តបុគ្គលិក ព្រឹត្តិការណ៍ប្រចាំឆ្នាំ និងកម្មវិធីលើកទឹកចិត្ត",
          "ឱកាសបណ្តុះបណ្តាលផ្ទៃក្នុង និងខាងក្រៅ",
          "ការបណ្តុះបណ្តាលជំនាញបច្ចេកទេស និងទន់។",
        ]
      : [
          "Competitive salary (negotiable based on experience)",
          "Annual salary increments and performance bonus",
          "Staff trips, annual events, and incentive programs",
          "Internal and external training opportunities",
          "Technical and soft skills training.",
        ],
    howToApply: language === 'kh'
      ? "ផ្ញើ CV របស់អ្នកទៅកាន់ **hr@dhinimex.com** ជាមួយនឹងប្រធានបទ៖ _ពាក្យសុំអ្នកត្រួតពិនិត្យបច្ចេកទេស_។"
      : "Submit your CV to **hr@dhinimex.com** with the subject line: _Technical Supervisor Application_.",
  },
  {
    slug: "admin-hr-team-leader",
    title: language === 'kh' ? "ប្រធានក្រុមរដ្ឋបាល & ធនធានមនុស្ស" : "Admin & HR Team Leader",
    location: language === 'kh' ? "ភ្នំពេញ" : "Phnom Penh",
    position: language === 'kh' ? "ពេញម៉ោង" : "Full-time",
    deadline: language === 'kh' ? "20 កញ្ញា 2026" : "September 20, 2026",
    url: "https://www.dhinimex.com/careers/admin-hr-team-leader/",
    summary: language === 'kh'
      ? "ជំរុញការជ្រើសរើស ការចូលរួម និងកម្មវិធីសិក្សាសម្រាប់កម្លាំងពលកម្មជាង 500 នាក់។"
      : "Drive recruitment, engagement, and learning programs for a 500+ person workforce.",
    description: language === 'kh'
      ? "យើងកំពុងស្វែងរក **ប្រធានក្រុមរដ្ឋបាល & ធនធានមនុស្ស** ដើម្បីអនុវត្តគោលនយោបាយធនធានមនុស្ស ធានាការអនុលោមតាមច្បាប់ និងគ្រប់គ្រងមុខងារធនធានមនុស្ស និងរដ្ឋបាលប្រចាំថ្ងៃនៅទូទាំងក្រុម។ តួនាទីនេះនឹងត្រួតពិនិត្យការជ្រើសរើស ទំនាក់ទំនងបុគ្គលិក តារាងរចនាសម្ព័ន្ធស្ថាប័ន ការវាយតម្លៃការអនុវត្ត និងគំនិតផ្តួចផ្តើមបណ្តុះបណ្តាល ខណៈពេលដែលផ្តល់ភាពជាអ្នកដឹកនាំ និងការគាំទ្រដល់បុគ្គលិកធនធានមនុស្ស។"
      : "We are looking for an **Admin & HR Team Leader** to implement HR policies, ensure compliance, and manage day-to-day HR and administrative functions across the group. This role will oversee recruitment, employee relations, organizational charts, performance appraisals, and training initiatives while providing leadership and support to HR staff.",
    keyResponsibilities: language === 'kh'
      ? [
          "អនុវត្តគោលនយោបាយធនធានមនុស្ស និងធានាការអនុលោមតាមច្បាប់នៅទូទាំងក្រុមហ៊ុនសាខា",
          "ត្រួតពិនិត្យការជ្រើសរើស ការទទួលបុគ្គលិកថ្មី និងសកម្មភាពចូលរួមរបស់បុគ្គលិក",
          "គ្រប់គ្រងតារាងរចនាសម្ព័ន្ធស្ថាប័ន កំណត់ត្រាបុគ្គលិក និងរបាយការណ៍ប្រាក់បៀវត្សរ៍",
          "ដឹកនាំការវាយតម្លៃការអនុវត្តប្រចាំឆ្នាំ និងកម្មវិធីអភិវឌ្ឍន៍បុគ្គលិក",
          "ផ្តល់ការបណ្តុះបណ្តាល និងការណែនាំដល់បុគ្គលិកធនធានមនុស្ស និងបុគ្គលិកថ្មី",
          "សម្របសម្រួលព្រឹត្តិការណ៍ក្រុមហ៊ុន និងភារកិច្ចរដ្ឋបាល",
          "ដោះស្រាយសំណួរទាក់ទងនឹងធនធានមនុស្ស និងបណ្តឹងពីបុគ្គលិក និងដៃគូ",
          "រៀបចំរបាយការណ៍ស្តីពីចំនួនបុគ្គលិក ចំនួនអ្នកលាឈប់ និងដំណើរការធនធានមនុស្ស។",
        ]
      : [
          "Implement HR policies and ensure compliance across branch companies",
          "Oversee recruitment, onboarding, and employee engagement activities",
          "Manage organizational charts, employee records, and payroll reports",
          "Lead annual performance appraisals and staff development programs",
          "Provide training and mentorship to HR staff and new hires",
          "Coordinate company events and administrative duties",
          "Resolve HR-related queries and grievances from staff and partners",
          "Prepare reports on headcount, turnover, and HR performance.",
        ],
    requirements: language === 'kh'
      ? [
          "បរិញ្ញាបត្រផ្នែកគ្រប់គ្រងពាណិជ្ជកម្ម ឬគ្រប់គ្រងធនធានមនុស្ស",
          "បទពិសោធន៍ធនធានមនុស្ស និងរដ្ឋបាលយ៉ាងតិច 2-3 ឆ្នាំ",
          "ចំណេះដឹងខ្លាំងអំពីគោលនយោបាយធនធានមនុស្ស ការអនុលោមតាមច្បាប់ការងារ និងការគ្រប់គ្រងបុគ្គលិក",
          "ចំណេះដឹងកុំព្យូទ័រ (Excel, Email, Internet, Word)",
          "ជំនាញទំនាក់ទំនងខ្លាំងជាភាសាខ្មែរ និងអង់គ្លេស",
          "សមត្ថភាពធ្វើការក្រោមសម្ពាធ និងគ្រប់គ្រងពេលវេលាកំណត់",
          "ជំនាញខ្លាំងក្នុងភាពជាអ្នកដឹកនាំក្រុម ការគ្រប់គ្រងពេលវេលា និងការដោះស្រាយបញ្ហា។",
        ]
      : [
          "Bachelor’s degree in Business Administration or HR Management",
          "Minimum 2–3 years of HR and administrative experience",
          "Strong knowledge of HR policies, labor compliance, and employee management",
          "Computer literacy (Excel, Email, Internet, Word)",
          "Strong communication skills in Khmer and English",
          "Ability to work under pressure and manage deadlines",
          "Strong skills in team leadership, time management, and problem-solving.",
        ],
    whatWeOffer: language === 'kh'
      ? [
          "ប្រាក់ខែប្រកួតប្រជែង (អាចចរចាបានផ្អែកលើបទពិសោធន៍)",
          "ការដំឡើងប្រាក់ខែប្រចាំឆ្នាំ និងប្រាក់រង្វាន់លើការអនុវត្ត",
          "ដំណើរកម្សាន្តបុគ្គលិក ព្រឹត្តិការណ៍ប្រចាំឆ្នាំ និងកម្មវិធីលើកទឹកចិត្ត",
          "ឱកាសបណ្តុះបណ្តាលផ្ទៃក្នុង និងខាងក្រៅ។",
        ]
      : [
          "Competitive salary (negotiable based on experience)",
          "Annual salary increments and performance bonus",
          "Staff trips, annual events, and incentive programs",
          "Internal and external training opportunities.",
        ],
    howToApply: language === 'kh'
      ? "ផ្ញើ CV របស់អ្នកទៅកាន់ **hr@dhinimex.com** ជាមួយនឹងប្រធានបទ៖ _ពាក្យសុំប្រធានក្រុមរដ្ឋបាល & ធនធានមនុស្ស_។"
      : "Submit your CV to **hr@dhinimex.com** with the subject line: _Admin & HR Team Leader Application_.",
  },
  {
    slug: "legal-officer",
    title: language === 'kh' ? "មន្ត្រីច្បាប់" : "Legal Officer",
    location: language === 'kh' ? "ភ្នំពេញ" : "Phnom Penh",
    position: language === 'kh' ? "ពេញម៉ោង" : "Full-time",
    deadline: language === 'kh' ? "20 កញ្ញា 2026" : "September 20, 2026",
    url: "https://www.dhinimex.com/careers/legal-officer/",
    summary: language === 'kh'
      ? "គាំទ្រការអនុលោមតាមច្បាប់ កិច្ចសន្យា និងការដាក់ស្នើបទប្បញ្ញត្តិសម្រាប់សម្បទានសេវា។"
      : "Support compliance, contracts, and regulatory submissions for utilities concessions.",
    description: language === 'kh'
      ? "យើងកំពុងស្វែងរក **មន្ត្រីច្បាប់** ដើម្បីផ្តល់ការគាំទ្រផ្នែកច្បាប់នៅទូទាំងស្ថាប័ន។ តួនាទីនេះពាក់ព័ន្ធនឹងការពិនិត្យកិច្ចសន្យា ធានាការអនុលោមតាមបទប្បញ្ញត្តិ ផ្តល់យោបល់ដល់ថ្នាក់គ្រប់គ្រងអំពីហានិភ័យផ្លូវច្បាប់ និងការសម្របសម្រួលជាមួយអ្នកប្រឹក្សាច្បាប់ខាងក្រៅ។ មន្ត្រីច្បាប់ក៏នឹងគាំទ្រសកម្មភាពក្រុមប្រឹក្សាភិបាល រៀបចំឯកសារម្ចាស់ភាគហ៊ុន និងដើរតួជាអ្នកទំនាក់ទំនងជាមួយសវនករ និយតករ និងស្ថាប័នរដ្ឋាភិបាល។"
      : "We are seeking a **Legal Officer** to provide legal support across the organization. This role involves reviewing contracts, ensuring regulatory compliance, advising management on legal risks, and coordinating with external legal counsel. The Legal Officer will also support board activities, prepare shareholder documentation, and act as a liaison with auditors, regulators, and government bodies.",
    keyResponsibilities: language === 'kh'
      ? [
          "ពិនិត្យ និងព្រាងកិច្ចសន្យា កិច្ចព្រមព្រៀង និងឯកសារច្បាប់ផ្សេងទៀត",
          "គាំទ្រការវាយតម្លៃផ្នែកច្បាប់ ការដាក់ឯកសារបទប្បញ្ញត្តិ ការផ្តល់អាជ្ញាប័ណ្ណ និងការបន្តកិច្ចសន្យា",
          "រក្សាកំណត់ត្រាច្បាប់ ការចុះបញ្ជីក្រុមហ៊ុន និងកំណត់ហេតុអនុលោមភាព",
          "សម្របសម្រួលជាមួយអ្នកប្រឹក្សាខាងក្រៅសម្រាប់ការប្តឹងផ្តល់ ឬបញ្ហាឯកទេស",
          "តាមដានការធ្វើបច្ចុប្បន្នភាពបទប្បញ្ញត្តិ និងទំនាក់ទំនងផលប៉ះពាល់ផ្ទៃក្នុង",
          "ជួយរៀបចំសេចក្តីសម្រេចរបស់ក្រុមប្រឹក្សាភិបាល កំណត់ហេតុប្រជុំ និងឯកសារម្ចាស់ភាគហ៊ុន",
          "ផ្តល់យោបល់ដល់ថ្នាក់គ្រប់គ្រងអំពីហានិភ័យផ្លូវច្បាប់នៃការសម្រេចចិត្តជាយុទ្ធសាស្ត្រ",
          "ទំនាក់ទំនងជាមួយសវនករ និយតករ និងអាជ្ញាធររដ្ឋាភិបាល។",
        ]
      : [
          "Review and draft contracts, agreements, and other legal documents",
          "Support legal due diligence, regulatory filings, licensing, and contract renewals",
          "Maintain legal records, company registrations, and compliance logs",
          "Coordinate with external counsel for litigation or specialized matters",
          "Monitor regulatory updates and communicate internal implications",
          "Assist with board resolutions, meeting minutes, and shareholder documentation",
          "Advise management on legal risks of strategic decisions",
          "Liaise with auditors, regulators, and government authorities.",
        ],
    requirements: language === 'kh'
      ? [
          "បរិញ្ញាបត្រច្បាប់ (LL.B); អនុបណ្ឌិត ឬវិញ្ញាបនបត្រច្បាប់គឺជាអត្ថប្រយោជន៍",
          "បទពិសោធន៍ 2-5 ឆ្នាំក្នុងបរិយាកាសច្បាប់ ឬសាជីវកម្ម និយមពហុឧស្សាហកម្ម",
          "ចំណេះដឹងខ្លាំងអំពីច្បាប់សាជីវកម្ម ការងារ និងពាណិជ្ជកម្មកម្ពុជា",
          "ជំនាញព្រាងច្បាប់ និងពិនិត្យឯកសារដ៏ល្អឥតខ្ចោះ",
          "កម្រិតខ្ពស់នៃសុចរិតភាព ការសម្ងាត់ និងក្រមសីលធម៌វិជ្ជាជីវៈ",
          "ជំនាញភាសាខ្មែរ និងអង់គ្លេស (សរសេរ និងនិយាយ)",
          "ជំនាញរៀបចំ និងទំនាក់ទំនងខ្លាំង។",
        ]
      : [
          "Bachelor’s degree in Law (LL.B); Master’s or legal certifications are a plus",
          "2–5 years’ experience in a legal or corporate environment, preferably multi-industry",
          "Strong knowledge of Cambodian corporate, labor, and commercial law",
          "Excellent legal drafting and document review skills",
          "High level of integrity, confidentiality, and professional ethics",
          "Proficiency in Khmer and English (written and spoken)",
          "Strong organizational and communication skills.",
        ],
    whatWeOffer: language === 'kh'
      ? [
          "ប្រាក់ខែ និងអត្ថប្រយោជន៍ប្រកួតប្រជែង",
          "ឱកាសសម្រាប់កំណើនអាជីពក្នុងការអនុវត្តច្បាប់សាជីវកម្ម",
          "បរិយាកាសគាំទ្រ និងវិជ្ជាជីវៈ។",
        ]
      : [
          "Competitive salary and benefits",
          "Opportunities for career growth in corporate legal practice",
          "Supportive, professional environment.",
        ],
    howToApply: language === 'kh'
      ? "ផ្ញើ CV របស់អ្នកទៅកាន់ **recruitment@dhinimex.com** ជាមួយនឹងប្រធានបទ៖ _ពាក្យសុំមន្ត្រីច្បាប់_។"
      : "Submit your CV to **recruitment@dhinimex.com** with the subject line: _Legal Officer Application_.",
  },
  {
    slug: "design-engineer",
    title: language === 'kh' ? "វិស្វកររចនា (អគ្គិសនី)" : "Design Engineer (Electrical)",
    location: language === 'kh' ? "ភ្នំពេញ" : "Phnom Penh",
    position: language === 'kh' ? "ពេញម៉ោង" : "Full-time",
    deadline: language === 'kh' ? "20 កញ្ញា 2026" : "September 20, 2026",
    url: "https://www.dhinimex.com/careers/design-engineer/",
    summary: language === 'kh'
      ? "អភិវឌ្ឍគំនូរ LV/MV ការគណនា និងការដាក់ស្នើសម្ភារៈដែលបំពេញតាមស្តង់ដារ ឌីនីម៉ិច។"
      : "Develop LV/MV drawings, calculations, and material submittals that meet Dhinimex standards.",
    description: language === 'kh'
      ? "យើងកំពុងស្វែងរក **វិស្វកររចនា (អគ្គិសនី) ថ្នាក់តូច** ដើម្បីគាំទ្រក្រុមវិស្វកម្មរបស់យើងក្នុងការរចនា អភិវឌ្ឍ និងអនុវត្តប្រព័ន្ធអគ្គិសនី។ អ្នកនឹងជួយក្នុងការរៀបចំផែនការគម្រោង ការរៀបចំឯកសារបច្ចេកទេស និងការសម្របសម្រួលជាមួយអ្នកពាក់ព័ន្ធគម្រោងដើម្បីធានាគុណភាព និងការអនុលោមតាមស្តង់ដារឧស្សាហកម្ម។"
      : "We’re looking for a **Junior Design Engineer (Electrical)** to support our engineering team in designing, developing, and implementing electrical systems. You’ll assist in project planning, preparation of technical documentation, and coordination with project stakeholders to ensure quality and compliance with industry standards.",
    keyResponsibilities: language === 'kh'
      ? [
          "ជួយក្នុងការរចនាប្រព័ន្ធអគ្គិសនី និងការព្រាងបច្ចេកទេស",
          "រៀបចំដ្យាក្រាមខ្សែភ្លើង ផែនការប្លង់ និងលក្ខណៈបច្ចេកទេស",
          "សហការជាមួយវិស្វករជាន់ខ្ពស់ និងអ្នកគ្រប់គ្រងគម្រោងដើម្បីអនុវត្តការរចនា",
          "ពិនិត្យ និងធានាថាការរចនាបំពេញតាមស្តង់ដារសុវត្ថិភាព បទប្បញ្ញត្តិ និងដំណើរការ",
          "គាំទ្រក្នុងការធ្វើតេស្ត និងដោះស្រាយបញ្ហាសមាសធាតុ និងប្រព័ន្ធអគ្គិសនី",
          "ចូលរួមការចុះមើលទីតាំងតាមតម្រូវការដើម្បីប្រមូលទិន្នន័យ និងផ្ទៀងផ្ទាត់ការដំឡើង",
          "រក្សាឯកសារគម្រោង និងជួយក្នុងការតាមដានគម្រោង",
          "អនុវត្តភារកិច្ចបន្ថែមតាមការចាត់តាំង។",
        ]
      : [
          "Assist in electrical system design and technical drafting",
          "Prepare wiring diagrams, layout plans, and technical specifications",
          "Collaborate with senior engineers and project managers to execute designs",
          "Review and ensure designs meet safety, regulatory, and performance standards",
          "Support in testing and troubleshooting electrical components and systems",
          "Attend site visits as needed to gather data and verify installations",
          "Maintain project documentation and assist in project monitoring",
          "Perform additional duties as assigned.",
        ],
    requirements: language === 'kh'
      ? [
          "បរិញ្ញាបត្រផ្នែកវិស្វកម្មអគ្គិសនី ឬមុខវិជ្ជាពាក់ព័ន្ធ",
          "កម្រិតចូល ឬបទពិសោធន៍រហូតដល់ 1-2 ឆ្នាំត្រូវបានផ្តល់អាទិភាព កម្មសិក្សា ឬគម្រោងសិក្សាត្រូវបានពិចារណា",
          "ចំណេះដឹងមូលដ្ឋានអំពីប្រព័ន្ធអគ្គិសនី ខ្សែភ្លើង និងឧបករណ៍រចនា",
          "ការយល់ដឹងល្អអំពីស្តង់ដារសុវត្ថិភាព និងតម្រូវការបទប្បញ្ញត្តិ",
          "ជំនាញវិភាគ ដោះស្រាយបញ្ហា និងបច្ចេកទេសខ្លាំង",
          "ការទំនាក់ទំនងប្រកបដោយប្រសិទ្ធភាព សមត្ថភាពធ្វើការជាក្រុម និងការយកចិត្តទុកដាក់លើព័ត៌មានលម្អិត។",
        ]
      : [
          "Bachelor’s degree in Electrical Engineering or related field",
          "Entry-level or up to 1-2 years of experience preferred, internships or academic projects considered",
          "Basic knowledge of electrical systems, wiring, and design tools",
          "Good understanding of safety standards and regulatory requirements",
          "Strong analytical, problem-solving, and technical skills",
          "Effective communication, ability to work in teams, and attention to detail.",
        ],
    whatWeOffer: language === 'kh'
      ? [
          "ការទទួលបុគ្គលិកថ្មីប្រកបដោយរចនាសម្ព័ន្ធ និងការណែនាំដោយវិស្វករដែលមានបទពិសោធន៍",
          "ឱកាសសម្រាប់កំណើនវិជ្ជាជីវៈ និងការអភិវឌ្ឍជំនាញ",
          "ការបង្ហាញគម្រោងទៅនឹងបញ្ហាប្រឈមវិស្វកម្មចម្រុះ",
          "បរិយាកាសការងារគាំទ្រ និងវប្បធម៌សហការ។",
        ]
      : [
          "Structured onboarding and mentorship by experienced engineers",
          "Opportunities for professional growth and skill development",
          "Project exposure to varied engineering challenges",
          "Supportive work environment and collaborative culture.",
        ],
    howToApply: language === 'kh'
      ? "ផ្ញើ CV របស់អ្នកទៅកាន់ **recruitment@dhinimex.com** ជាមួយនឹងប្រធានបទ៖ _ពាក្យសុំវិស្វកររចនា (អគ្គិសនី)_។"
      : "Submit your CV to **recruitment@dhinimex.com** with the subject line: _Design Engineer (Electrical) Application_.",
  },
  {
    slug: "sales-and-marketing-executive",
    title: language === 'kh' ? "ប្រតិបត្តិផ្នែកលក់ & ទីផ្សារ" : "Sales & Marketing Executive",
    location: language === 'kh' ? "ភ្នំពេញ" : "Phnom Penh",
    position: language === 'kh' ? "ពេញម៉ោង" : "Full-time",
    deadline: language === 'kh' ? "20 កញ្ញា 2026" : "September 20, 2026",
    url: "https://www.dhinimex.com/careers/sales-and-marketing-executive/",
    summary: language === 'kh'
      ? "ចូលរួមជាមួយអតិថិជនផ្នែកសាធារណៈ និងឯកជនជាមួយនឹងសំណើឧបករណ៍ និងសេវាកម្មដែលបានកែសម្រួល។"
      : "Engage public and private sector clients with tailored equipment and services proposals.",
    description: language === 'kh'
      ? "យើងកំពុងស្វែងរក **ប្រតិបត្តិផ្នែកលក់ និងទីផ្សារ (ក្រៅការិយាល័យ)** ដើម្បីចូលរួមជាមួយក្រុមដ៏ស្វាហាប់របស់យើង។ នៅក្នុងតួនាទីនេះ អ្នកនឹងគ្រប់គ្រងទំនាក់ទំនងអតិថិជន សម្រេចបានគោលដៅលក់ និងពង្រីកលទ្ធភាពទីផ្សារតាមរយៈការងារវាលសកម្ម។ អ្នកនឹងតំណាងឱ្យក្រុមហ៊ុនដោយផ្ទាល់ទៅកាន់អតិថិជន ដោយធានាថាផលិតផល និងការផ្សព្វផ្សាយត្រូវបានបង្ហាញយ៉ាងមានប្រសិទ្ធភាព ខណៈពេលដែលរក្សាបាននូវសេវាកម្ម និងគណនេយ្យភាពដ៏រឹងមាំ។"
      : "We are seeking a **Sales and Marketing Executive (Outdoor)** to join our dynamic team. In this role, you will manage customer relationships, achieve sales targets, and expand market reach through proactive fieldwork. You will represent the company directly to clients, ensuring that products and promotions are effectively presented while maintaining strong service and accountability.",
    keyResponsibilities: language === 'kh'
      ? [
          "កំណត់គោលដៅលក់ផ្ទាល់ខ្លួន រួមទាំងគោលដៅអតិថិជនដែលមានផលិតផល SKU និងចំនួនលម្អិត",
          "រៀបចំផែនការចុះទីផ្សារ ថវិកាចំណាយ និងបញ្ជីអតិថិជន",
          "ធ្វើដំណើរក្នុងតំបន់ដែលបានចាត់តាំងដើម្បីប្រជុំទល់មុខជាមួយអតិថិជន និងអតិថិជនសក្តានុពល",
          "បង្ហាញគំរូផលិតផល ការផ្សព្វផ្សាយ តម្លៃ និងកម្មវិធីពាក់ព័ន្ធដល់អតិថិជន",
          "បញ្ជូនការបញ្ជាទិញទៅការិយាល័យកណ្តាល និងសម្របសម្រួលការប្រមូលប្រាក់ជាមួយអ្នកប្រមូលប្រាក់",
          "ផ្ទៀងផ្ទាត់ការប្រមូលសាច់ប្រាក់ប្រចាំថ្ងៃជាមួយគណនេយ្យករ",
          "រៀបចំ និងថែរក្សាការតាំងបង្ហាញផលិតផលនៅហាងអតិថិជន ធានាភាពស្អាត ការរៀបចំត្រឹមត្រូវ និងភាពមានស្តុក",
          "រៀបចំរបាយការណ៍ចុះទីផ្សារប្រចាំថ្ងៃបន្ទាប់ពីជួបអតិថិជន",
          "ផ្តល់របាយការណ៍លក់ប្រចាំថ្ងៃ ព័ត៌មានទីផ្សារ ការធ្វើបច្ចុប្បន្នភាពគូប្រជែង និងរាយការណ៍ជាប្រចាំទៅកាន់អ្នកត្រួតពិនិត្យ/អ្នកគ្រប់គ្រង",
          "អនុវត្តភារកិច្ចបន្ថែមតាមការចាត់តាំងដោយថ្នាក់លើ",
        ]
      : [
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
    requirements: language === 'kh'
      ? [
          "បរិញ្ញាបត្រផ្នែកគ្រប់គ្រងពាណិជ្ជកម្ម (ទីផ្សារ ឬមុខវិជ្ជាពាក់ព័ន្ធត្រូវបានផ្តល់អាទិភាព)",
          "បទពិសោធន៍យ៉ាងតិច 1 ឆ្នាំក្នុងការលក់ផលិតផលអគ្គិសនី និង/ឬអេឡិចត្រូនិច",
          "បទពិសោធន៍ធ្វើការក្នុងការលក់តាមខេត្តគឺជាអត្ថប្រយោជន៍",
          "ក្រមសីលធម៌ការងារខ្លាំងជាមួយនឹងភាពបត់បែនដើម្បីសម្រេចគោលដៅ",
          "ស្មោះត្រង់ សម្របខ្លួនបាន រួសរាយរាក់ទាក់ ជឿជាក់ និងជាអ្នកធ្វើការជាក្រុមខ្លាំងជាមួយនឹងអាកប្បកិរិយា 'អាចធ្វើបាន'",
          "ជំនាញទំនាក់ទំនង អន្តរបុគ្គល ការបង្ហាញ និងការចរចាប្រកបដោយប្រសិទ្ធភាព",
          "មានគំនិតសេវាកម្មជាមួយនឹងការផ្តោតលើទំនាក់ទំនងអតិថិជនខ្លាំង",
          "ប័ណ្ណបើកបរដែលមានសុពលភាពគឺជាអត្ថប្រយោជន៍។",
        ]
      : [
          "Bachelor’s degree in Business Administration (Marketing or related field preferred)",
          "Minimum 1 year of experience in selling electrical and/or electronic products",
          "Experience working in upcountry sales is an advantage",
          "Strong work ethic with flexibility to achieve targets",
          "Honest, adaptable, friendly, confident, and a strong team player with a “can-do” attitude",
          "Effective communication, interpersonal, presentation, and negotiation skills",
          "Service-minded with strong customer relationship focus",
          "Valid driving license is an advantage.",
        ],
    whatWeOffer: language === 'kh'
      ? [
          "កញ្ចប់សំណងប្រកួតប្រជែងជាមួយនឹងការលើកទឹកចិត្តលើការអនុវត្ត",
          "ឱកាសសម្រាប់កំណើនអាជីព និងការអភិវឌ្ឍវិជ្ជាជីវៈ",
          "បរិយាកាសការងារគាំទ្រ និងសហការ",
          "ការបង្ហាញទៅកាន់ទីផ្សារ និងបណ្តាញអតិថិជនចម្រុះ។",
        ]
      : [
          "Competitive compensation package with performance incentives",
          "Opportunities for career growth and professional development",
          "Supportive and collaborative work environment",
          "Exposure to diverse markets and customer networks.",
        ],
    howToApply: language === 'kh'
      ? "ផ្ញើ CV របស់អ្នកទៅកាន់ **recruitment@dhinimex.com** ជាមួយនឹងប្រធានបទ៖ _ពាក្យសុំប្រតិបត្តិផ្នែកលក់ និងទីផ្សារ (ក្រៅការិយាល័យ)_។"
      : "Submit your CV to **recruitment@dhinimex.com** with the subject line: _Sales and Marketing Executive (Outdoor) Application_.",
  },
  {
    slug: "sales-executive",
    title: language === 'kh' ? "ប្រតិបត្តិផ្នែកលក់ (ការព្យាករណ៍)" : "Sales Executive (Projection)",
    location: language === 'kh' ? "ភ្នំពេញ" : "Phnom Penh",
    position: language === 'kh' ? "ពេញម៉ោង" : "Full-time",
    deadline: language === 'kh' ? "30 កញ្ញា 2025" : "September 30, 2025",
    url: "https://www.dhinimex.com/careers/sales-executive/",
    summary: language === 'kh'
      ? "ព្យាករណ៍តម្រូវការ និងគាំទ្រគំនិតផ្តួចផ្តើមចូលទីផ្សារសម្រាប់ផលិតផលថ្មី។"
      : "Forecast demand and support market entry initiatives for new products.",
    description: language === 'kh'
      ? "យើងកំពុងស្វែងរក **ប្រតិបត្តិផ្នែកលក់ (ការព្យាករណ៍ការលក់)** ដែលនឹងទទួលខុសត្រូវក្នុងការការព្យាករណ៍ការលក់ អភិវឌ្ឍយុទ្ធសាស្ត្រដើម្បីសម្រេចបាននូវការព្យាករណ៍ទាំងនេះ និងគាំទ្រកំណើនការលក់សាជីវកម្មទាំងមូល។ អ្នកនឹងវិភាគនិន្នាការទីផ្សារ ធ្វើការជាមួយក្រុមផ្ទៃក្នុង និងជួយបង្កើតគោលដៅដែលស្របតាមគោលបំណងអាជីវកម្ម។"
      : "We are looking for a **Sales Executive (Sales Projection)** who will be responsible for forecasting sales, developing strategies to achieve these forecasts, and supporting overall corporate sales growth. You will analyze market trends, work with internal teams, and help shape goals that align with business objectives.",
    keyResponsibilities: language === 'kh'
      ? [
          "រៀបចំការព្យាករណ៍ការលក់ និងការព្យាករណ៍ដោយផ្អែកលើទិន្នន័យទីផ្សារ និងដំណើរការកន្លងមក",
          "តាមដានការលក់ជាក់ស្តែងធៀបនឹងការព្យាករណ៍ កំណត់គម្លាត និងកែសម្រួលយុទ្ធសាស្ត្រទៅតាមនោះ",
          "សហការជាមួយក្រុមទីផ្សារ ប្រតិបត្តិការ និងហិរញ្ញវត្ថុដើម្បីតម្រឹមផែនការលក់",
          "ចូលរួមជាមួយអតិថិជនដើម្បីយល់ពីលំនាំតម្រូវការ និងតម្រូវការទីផ្សារ",
          "បង្កើតរបាយការណ៍ប្រចាំខែ/ត្រីមាសស្តីពីដំណើរការលក់ និងនិន្នាការ",
          "ជួយក្នុងការរៀបចំថវិកា និងគោលដៅសម្រាប់នាយកដ្ឋានលក់",
          "រក្សាការយល់ដឹងអំពីសកម្មភាពគូប្រជែង និងការអភិវឌ្ឍទីផ្សារ",
          "ទទួលយកភារកិច្ចបន្ថែមតាមការទាមទារដោយថ្នាក់គ្រប់គ្រងជាន់ខ្ពស់។",
        ]
      : [
          "Prepare sales forecasts and projections based on market data and past performance",
          "Monitor actual sales versus projections, identify gaps, and adjust strategies accordingly",
          "Collaborate with marketing, operations, and finance teams to align sales plans",
          "Engage with customers to understand demand patterns and market needs",
          "Generate monthly/quarterly reports on sales performance and trends",
          "Assist in preparing budgets and targets for the sales department",
          "Maintain awareness of competitor activity and market developments",
          "Take on additional tasks as required by senior management.",
        ],
    requirements: language === 'kh'
      ? [
          "បរិញ្ញាបត្រផ្នែកពាណិជ្ជកម្ម ទីផ្សារ ហិរញ្ញវត្ថុ ឬមុខវិជ្ជាពាក់ព័ន្ធ",
          "បទពិសោធន៍យ៉ាងតិច 1 ឆ្នាំក្នុងការព្យាករណ៍ការលក់ ឬតួនាទីលក់ដែលពាក់ព័ន្ធ",
          "ជំនាញវិភាគជាមួយនឹងសមត្ថភាពបកស្រាយទិន្នន័យទីផ្សារ និងកែសម្រួលផែនការ",
          "ជំនាញទំនាក់ទំនង ការចរចា និងការគ្រប់គ្រងអ្នកពាក់ព័ន្ធខ្លាំង",
          "សកម្ម លើកទឹកចិត្តខ្លួនឯង អាចធ្វើការក្រោមសម្ពាធ និងសម្រេចគោលដៅ",
          "តម្រង់ទិសក្រុមជាមួយនឹងផ្នត់គំនិតដែលជំរុញដោយលទ្ធផល។",
        ]
      : [
          "Bachelor’s degree in Business, Marketing, Finance, or related field",
          "Minimum 1 year of experience in sales forecasting or related sales roles",
          "Analytical skills with the ability to interpret market data and adjust plans",
          "Strong communication, negotiation, and stakeholder management skills",
          "Proactive, self-motivated, able to work under pressure and meet targets",
          "Team-oriented with a result-driven mindset.",
        ],
    whatWeOffer: language === 'kh'
      ? [
          "ប្រាក់ខែប្រកួតប្រជែង និងការលើកទឹកចិត្តផ្អែកលើការអនុវត្ត",
          "ឱកាសអភិវឌ្ឍន៍អាជីពក្នុងការលក់ និងយុទ្ធសាស្ត្រ",
          "បរិយាកាសសហការ និងការគាំទ្រការណែនាំ",
          "ឱកាសដើម្បីរួមចំណែកដល់យុទ្ធសាស្ត្រកំណើនរបស់ក្រុមហ៊ុន។",
        ]
      : [
          "Competitive salary and performance-based incentives",
          "Career development opportunities in sales and strategy",
          "Collaborative environment and mentorship support",
          "Chance to contribute to the company’s growth strategy.",
        ],
    howToApply: language === 'kh'
      ? "ផ្ញើ CV របស់អ្នកទៅកាន់ **recruitment@dhinimex.com** ជាមួយនឹងប្រធានបទ៖ _ពាក្យសុំប្រតិបត្តិផ្នែកលក់ (ការព្យាករណ៍ការលក់)_។"
      : "Submit your CV to **recruitment@dhinimex.com** with the subject line: _Sales Executive (Sales Projection) Application_.",
  },
];

export function getCareer(slug: string, language: 'en' | 'kh') {
  return getCareers(language).find((career) => career.slug === slug);
}

export const getContactInfo = (language: 'en' | 'kh') => ({
  address: language === 'kh'
    ? "ផ្ទះលេខ 245, ផ្លូវទេពផន (182), ទឹកល្អក់ 2, ខណ្ឌទួលគោក, រាជធានីភ្នំពេញ, កម្ពុជា"
    : "#245, St. Tep Phan (182), Tuk Laak 2, Khan Toul Kork, Phnom Penh, Cambodia",
  email: "info@dhinimex.com.kh",
  salesEmail: "sales@dhinimex.com",
  phones: ["011 753 940", "017 777 844", "017 777 944"],
  hours: language === 'kh'
    ? "ច័ន្ទ – សៅរ៍ / 8:00 ព្រឹក – 5:00 ល្ងាច"
    : "Monday – Saturday / 8:00AM – 5:00PM",
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
});

export const getNewsHero = (language: 'en' | 'kh') => ({
  title: language === 'kh' ? "ព័ត៌មាន & ព្រឹត្តិការណ៍" : "News & Events",
  description: language === 'kh'
    ? "រឿងរ៉ាវពីក្រុមការងារ ដៃគូ និងសហគមន៍របស់យើង—គ្របដណ្តប់លើព្រឹត្តិការណ៍វិស្វកម្ម ពេលវេលាវប្បធម៌ និងគំនួសពណ៌ទេពកោសល្យ។"
    : "Stories from our teams, partners, and communities—covering engineering milestones, cultural moments, and talent highlights.",
});

export function getCategory(slug: string, language: 'en' | 'kh' = 'en') {
  return getProductCategories(language).find((category) => category.slug === slug);
}

export function getProduct(categorySlug: string, productSlug: string, language: 'en' | 'kh' = 'en') {
  const category = getCategory(categorySlug, language);
  if (!category) return undefined;
  return {
    category,
    product: category.products.find((product) => product.slug === productSlug),
  };
}

export function getPost(slug: string, language: 'en' | 'kh') {
  return getPosts(language).find((post) => post.slug === slug);
}
