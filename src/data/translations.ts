export type Language = 'en' | 'kh';

export const translations = {
  en: {
    nav: {
      about: "About Us",
      business: "Business Portfolio",
      services: "Services",
      products: "Products",
      blog: "News",
      careers: "Careers",
      contact: "Contact Us",
      search: "Search...",
      searchPlaceholder: "Search for services, products, careers...",
      searchBtn: "Search",
      cancel: "Cancel",
      adminLogin: "Sign in",
      toggleLanguage: "Change language",
    },
    business: {
      trading: "Trading",
      manufacturing: "Manufacturing",
      electricity: "Electricity Distributions",
      water: "Water Supply",
      scientific: "Scientific",
    },
    common: {
      readMore: "Read More",
      viewAll: "View All",
      home: "Home",
    },
    footer: {
      aboutCopy: "Dhinimex Co., Ltd has been a registered company since 2003 and is one of the leading providers of electrical equipment supply, installation, and services across Cambodia.",
      quickLinks: "Quick Links",
      contactInfo: "Contact Info",
      copyright: "Copyright © {year} DHINIMEX. All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
    },
    about: {
      hero: {
        title: "Building Cambodia's Future Through Innovation and Excellence"
      },
      whoWeAre: {
        sectionTitle: "Who We Are",
        title: "Creating with Purpose",
        description: "In a fast-moving and increasingly complex global economy, our success depends on how faithfully we adhere to our core principles: delivering exceptional client service, acting with integrity and responsibility, and supporting the growth of our employees.",
        business: {
          title: "Our Business",
          description: "We are a leading corporation with assets and operations worldwide.",
          explore: "Explore Portfolio"
        },
        services: {
          title: "Our Services",
          description: "Electrical, water supply, and engineering solutions for Cambodia.",
          explore: "Explore Services"
        },
        history: {
          title: "Our History",
          description: "With a legacy dating back to 2003, we have demonstrated leadership.",
          explore: "Explore Here"
        }
      },
      vision: {
        sectionTitle: "Our Vision",
        title: "Innovating Locally, Impacting Globally",
        description: "Our vision is to become a leading corporation in electrical appliances, water supply, and technological innovation, delivering world-class solutions and service that drive sustainable growth and industry impact, both locally and internationally."
      },
      mission: {
        sectionTitle: "Our Mission",
        title: "Empowering Communities",
        description: "Our mission is to drive leadership in the electrical and technology sectors by delivering high-quality products and expert services, creating job opportunities, and expanding access to modern energy and clean water–especially in rural Cambodia. Through innovation, ethical practices, and professionalism, we aim to enhance our supply capabilities, empower communities, and establish a strong presence in the global market."
      },
      coreValues: {
        sectionTitle: "What We Stand For",
        title: "Core Values",
        values: [
          {
            title: "Quality Assurance",
            description: "We are committed to delivering only high-quality products that meet or exceed Cambodian and international standards such as TIS, IEC, ANSI/IEEE, or specific client requirements."
          },
          {
            title: "Technical Excellence",
            description: "Our equipment is built with premium materials, efficient design, and engineered to pass all routine and type tests for performance, safety, and longevity."
          },
          {
            title: "Customer Commitment",
            description: "We prioritize customer satisfaction by providing only products that meet rigorous internal quality controls, ensuring reliability and value in every solution delivered."
          },
          {
            title: "Standards-Driven Operations",
            description: "We design and manufacture with a dual focus on local and global standards, merging innovation with compliance to deliver dependable, future-ready solutions."
          },
          {
            title: "Integrity & Professionalism",
            description: "We adhere to ethical practices and professional conduct in every aspect of our operations—from product development to customer service and global partnerships."
          }
        ]
      },
      leadership: {
        sectionTitle: "Our Leadership",
        title: "Meet Our Chairwoman",
        description: "Guided by our chairwoman's vision and leadership, Dhinimex has established itself as a trusted and respected corporation within the industry.",
        chairwoman: {
          p1: "Dhinimex Group originated from a small-scale business founded in 2003 and has since grown into a well-recognized company known for its continuous development and meaningful contributions to both society and the nation.",
          p2: "The company's strength and longevity are rooted in its firm commitment to a core direction: to earn recognition and trust from customers by upholding strong ethical standards, transparency, and integrity. Dhinimex places high importance on excellent service and product quality, which are key factors behind its current success and sustained growth.",
          p3: "This progress has been made possible thanks to the dedicated efforts of a collaborative team that works like a family, with persistence, strong commitment, mutual support, and effective communication. The principle of unity as strength has been central to the company's advancement.",
          p4: "Today, Dhinimex continues to grow and actively promotes the development of its workforce through training and encouragement of innovative thinking. The company aspires to remain a leading choice at the national level while advancing its mission on the international stage."
        },
        management: {
          sectionTitle: "Directors",
          title: "Meet Our Management Team",
          description: "Dhinimex's management team brings together a diverse group of experienced professionals with deep expertise in engineering, finance, operations, and strategic development."
        },
        departments: {
          sectionTitle: "Management",
          title: "Department Managers",
          description: "Our department managers lead with expertise and dedication, driving excellence across every function of our business."
        }
      }
    },
    businessPage: {
      hero: {
        title: "DHINIMEX GROUP",
        description: "A journey of growth, innovation, and transformation. From humble beginnings in 2003 to becoming a diversified group of 18 companies across five sectors."
      },
      milestones: [
        {
          title: "Where Dhinimex Started",
          subtitle: "First Steps to Create Tomorrow",
          description: "Dhinimex Co., Ltd. was established as a trade-based supplier focused on electrical appliances and water supply components. From humble beginnings, the company laid the foundation for what would become a diversified group of companies serving Cambodia's infrastructure needs.",
          events: [
            "Founded Dhinimex as an electrical equipment trading company",
            "Expanded product range to include water supply components"
          ]
        },
        {
          title: "Diversifying into Utilities",
          subtitle: "Building Infrastructure for Communities",
          description: "The group expanded into utilities, investing in provincial electricity and water distribution concessions. This period marked the beginning of Dhinimex's transformation from a trading company into an integrated infrastructure provider.",
          events: [
            "Acquired first provincial electricity distribution license",
            "Launched water supply infrastructure division",
            "Expanded utilities coverage to multiple provinces",
            "Implemented smart monitoring systems across network"
          ]
        },
        {
          title: "Expanding into Manufacturing",
          subtitle: "Vertical Integration for Quality Control",
          description: "Dhinimex scaled up in-house fabrication capabilities, establishing manufacturing facilities for transformers, conductors, cables, and concrete poles. This vertical integration enabled end-to-end EPC delivery.",
          events: [
            "Established transformer manufacturing facility",
            "Opened cable and conductor production plant",
            "Achieved full vertical integration with testing labs"
          ]
        },
        {
          title: "Investment Portfolio Diversification",
          subtitle: "Strategic Growth and Partnerships",
          description: "Today, Dhinimex Group comprises 18 companies across five sectors, with strategic investments in various industries. The group continues to grow while maintaining its commitment to quality and innovation.",
          events: [
            "Restructured as Dhinimex Group with 18 companies",
            "Strategic investments in new technology ventures",
            "Launched innovation and testing laboratories"
          ]
        }
      ]
    },
    servicesPage: {
      hero: {
        title: "Comprehensive Solutions for Infrastructure",
        description: "From manufacturing and installation to testing and utilities provision, Dhinimex delivers end-to-end EPC services backed by 21+ years of expertise.",
        requestQuote: "Request a Quote",
        exploreServices: "Explore Services"
      },
      expertise: {
        sectionTitle: "Our Expertise",
        title: "Explore Our Services",
        description: "From design and manufacturing to installation and maintenance, we offer comprehensive solutions tailored to meet your infrastructure needs.",
        learnMore: "Learn more"
      },
      process: {
        sectionTitle: "Our Process",
        title: "How We Work",
        description: "Our structured approach ensures transparent communication, quality delivery, and customer satisfaction at every stage.",
        steps: [
          {
            title: "Consultation",
            description: "Site visit and consultation with the project owner to understand requirements.",
            step: "Step 01"
          },
          {
            title: "Planning",
            description: "Preparation of BOQ and detailed drawings for review and approval.",
            step: "Step 02"
          },
          {
            title: "Execution",
            description: "Procurement, construction, testing, and commissioning of the project.",
            step: "Step 03"
          },
          {
            title: "Handover",
            description: "Project handover with comprehensive documentation and after-sales support.",
            step: "Step 04"
          }
        ]
      },
      faq: {
        sectionTitle: "FAQ",
        title: "Frequently Asked Questions",
        description: "Get clear answers to common questions about our services, processes, and capabilities.",
        contactMore: "Have more questions? Contact us"
      },
      cta: {
        title: "Ready to Start Your Project?",
        description: "Contact us today for a consultation. Our team is ready to help you plan, design, and execute your infrastructure project with excellence.",
        getQuote: "Get a Free Quote",
        call: "Call: 011 753 940"
      },
      modal: {
        successTitle: "Thank You!",
        successDesc: "We'll get back to you within one business day.",
        title: "How can we help?",
        subtitle: "Fill out the form below and we'll get back to you shortly.",
        nameLabel: "Full Name",
        namePlaceholder: "Your name",
        phoneLabel: "Phone",
        phonePlaceholder: "12 345 6789",
        serviceLabel: "Service Category",
        serviceSelect: "Select a service",
        serviceOther: "Other / General Inquiry",
        messageLabel: "How can we help?",
        messagePlaceholder: "Tell us about your project or inquiry...",
        sending: "Sending...",
        send: "Send Message"
      }
    },
    productsPage: {
      loading: "Loading products...",
      hero: {
        title: "Industrial-Grade Tools for Utilities & Services",
        description: "Discover our curated selection of professional tools and equipment from leading brands, designed for construction, electrical work, and industrial applications.",
        viewAll: "View All Products",
        requestQuote: "Request Quote"
      },
      browse: {
        sectionTitle: "Browse Collection",
        title: "Shop by Categories",
        description: "Explore our comprehensive range of professional tools organized by category for easy discovery."
      },
      featured: {
        sectionTitle: "Top Picks",
        title: "Featured Products",
        description: "Discover our most popular tools and equipment, handpicked for quality and performance."
      },
      brands: {
        sectionTitle: "Our Partners",
        title: "Shop by Brand",
        description: "We proudly partner with industry-leading brands to bring you the best tools and equipment.",
        shopBrand: "Shop Brand"
      },
      listing: {
        home: "Home",
        products: "Products",
        allProducts: "All Products",
        filters: "Filters",
        clearAll: "Clear All",
        categories: "Categories",
        brands: "Brands",
        sortBy: "Sort By",
        showFilters: "Show Filters",
        hideFilters: "Hide Filters",
        items: "items",
        previous: "Previous",
        next: "Next",
        noProducts: "No products found",
        clearFilters: "Clear all filters"
      },
      cta: {
        title: "Need Help Finding the Right Product?",
        description: "Our team of experts is here to help you select the perfect tools and equipment for your project. Contact us for personalized recommendations and bulk pricing.",
        contact: "Contact Our Team",
        call: "Call: 011 753 940"
      },
      card: {
        requestQuote: "Request Quote",
        viewProduct: "View Product",
        noImage: "No Image"
      }
    },
    newsPage: {
      hero: {
        title: "News and Insights From Our Group",
        description: "Discover insights, project highlights, and company culture from across our business units."
      },
      loading: "Loading stories...",
      empty: {
        title: "No stories found",
        description: "Check back soon for new content in this category."
      },
      featured: {
        defaultTag: "Featured",
        readFull: "Read full story"
      },
      recent: {
        title: "Recent Stories",
        defaultTag: "News",
        readMore: "Read more"
      },
      more: {
        title: "More Stories",
        defaultTag: "News"
      }
    },
    careersPage: {
      hero: {
        sectionTitle: "Join Our Team",
        title: "Be part of our mission",
        description: "We're looking for passionate people to join us on our mission. We value flat hierarchies, clear communication, and full ownership and responsibility.",
        stats: {
          years: "Years of Excellence",
          team: "Team Members",
          sectors: "Business Sectors"
        },
        viewPositions: "View Open Positions",
        sendCv: "Send Your CV"
      },
      positions: {
        title: "Open Positions",
        rolesAvailable: "roles available",
        roleAvailable: "role available",
        deadline: "Deadline:",
        apply: "Apply",
        empty: {
          title: "No positions found",
          allDesc: "There are currently no open positions. Check back soon or send us your CV for future opportunities.",
          filterDesc: "No positions found in this category. Try a different category."
        }
      },
      cta: {
        title: "Don't see the right role?",
        description: "We're always looking for talented individuals. Send us your CV and we'll keep you in mind for future opportunities.",
        sendCv: "Send your CV",
        contact: "Contact Us"
      }
    },
    contactPage: {
      hero: {
        sectionTitle: "Contact Us",
        title: "Get In Touch",
        description: "Have a question or would like to learn more about our group? Get in touch with us and our team will be happy to assist."
      },
      form: {
        successTitle: "Message Sent Successfully!",
        successDesc: "Thank you for reaching out. Our team will get back to you within one business day.",
        sendAnother: "Send another message",
        nameLabel: "Your name *",
        namePlaceholder: "Sophea Bopha",
        emailLabel: "Email address *",
        emailPlaceholder: "you@email.com",
        phoneLabel: "Phone number",
        phonePlaceholder: "12 345 678",
        interestedIn: "Interested in",
        selectOption: "Select an option",
        messageLabel: "How can we help? *",
        messagePlaceholder: "Share a few details about your inquiry or project...",
        error: "Something went wrong. Please try again or contact us directly via email.",
        sending: "Sending...",
        send: "Send your message",
        terms1: "By clicking, you agree to our ",
        terms2: "Terms & Conditions",
        terms3: ", ",
        terms4: "Privacy and Data Protection Policy"
      },
      location: {
        sectionTitle: "Our Location",
        title: "Visit Us in Phnom Penh",
        address: "Address",
        getDirections: "Get directions",
        phone: "Phone",
        email: "Email",
        businessHours: "Business Hours",
        days: "Monday – Saturday",
        hours: "8:00 AM – 5:00 PM"
      }
    },

    admin: {
      dashboard: {
        title: "Admin Dashboard",
        desc: "Manage products, news posts, careers, customer inquiries, and QR codes.",
        products: "Products",
        posts: "News Posts",
        careers: "Careers",
        inquiries: "Inquiries",
        qrcode: "QR Code",
        database: "Database",
        manageProducts: "Manage Products",
        manageProductsDesc: "Manage your product catalog. Entries are instantly published to the live site.",
        content: "Content",
        managePosts: "Manage News Posts",
        managePostsDesc: "Create and manage news posts. Entries are instantly published to the live site.",
        manageCareers: "Manage Careers",
        manageCareersDesc: "Create and manage job openings. Entries are instantly published to the live site.",
        inbox: "Inbox",
        customerInquiries: "Customer Inquiries",
        customerInquiriesDesc: "View and manage messages sent via the contact form.",
        prepareSeed: "Prepare & Seed Data",
        addNewProduct: "+ Add New Product",
        addNewPost: "+ Add New Post",
        addNewCareer: "+ Add New Career",
        backToList: "← Back to List",
        open: "Open",
        noAccess: "No access",
        portal: "Portal",
        welcomeBack: "Welcome back",
        selectSection: "Select a section below to get started.",
      },
      prpo: {
        title: "Branch Functions",
        desc: "Submit purchase orders and track open PO deliveries across branches.",
        pageDesc: "Upload PR and PO files, check the purchase details, and submit the final PO record.",
        dashboard: "Dashboard",
        submitPo: "Submit PO",
        createSo: "Create SO",
        viewPo: "View PO",
        downloadPr: "Download PR",
        downloadPo: "Download PO",
        invoiceAttachment: "Invoice",
        invoiceLink: "Invoice link",
        deliveryNote: "Delivery Note",
        deliveryNoteLinks: "Delivery note links",
        viewInvoice: "View Invoice",
        viewDeliveryNote: "View Delivery Note",
      },
      internal: {
        title: "Internal Tooling",
        desc: "Book meeting rooms, company vehicles, and manage shared resources.",
        rooms: "Room Booking",
        cars: "Car Booking",
        myBookings: "My Bookings",
        admin: "Admin",
        resourceMgmt: "Resource Management",
        manageRoomsCars: "Manage rooms, cars, and approve booking requests.",
        findAndBook: "Find and book meeting rooms for your team.",
        requestVehicles: "Request company vehicles for your trips.",
        viewAndManage: "View and manage all your room and car bookings",
      },
      userMgmt: {
        title: "User Management",
        desc: "Create staff accounts, assign roles, and control access to features.",
        security: "Security",
        createUsersDesc: "Create internal users, reset passwords, and assign access for admin and internal features.",
        createNewUser: "Create New User",
        loginUses: "Login uses the username and password. Email is optional",
        username: "Username",
        firstName: "First Name",
        lastName: "Last Name",
        emailOpt: "Email (optional)",
        password: "Password",
        setPassword: "Set password",
        office: "Office",
        roleTitle: "Title",
        department: "Department",
        role: "Role",
        functionAccess: "Function Access",
        createUser: "Create User",
        creating: "Creating...",
        manageUsers: "Manage Users",
        refresh: "Refresh",
        user: "User",
        email: "Email",
        status: "Status",
        permissions: "Permissions",
        actions: "Actions",
        showing: "Showing",
        of: "of",
        previous: "Previous",
        page: "Page",
        next: "Next",
        active: "Active",
        inactive: "Inactive",
      },
      seed: {
        system: "System",
        seedDatabase: "Seed Database",
        reviewStatic: "Review static data and populate Firestore. This will overwrite existing entries with the same slugs.",
        backToDashboard: "← Back to Dashboard",
        totalCategories: "Total Categories",
        totalProducts: "Total Products",
        totalPosts: "Total Posts",
        totalCareers: "Total Careers",
        seedFromStatic: "Seed from Static Files",
        seedProducts: "Seed Products",
        seedNewsPosts: "Seed News Posts",
        seedCareers: "Seed Careers",
        seedFromWP: "Seed from Live WordPress Site",
        seedNewsWP: "Seed News Posts from WordPress",
        seedCareersWP: "Seed Careers from WordPress",
        dataPreview: "Data Preview (First Record)",
        categoryBreakdown: "Category Breakdown",
        brandCategory: "Brand/Category",
        slug: "Slug",
        productCount: "Product Count",
        seedBookingData: "Seed Booking System Data",
        populateDatabase: "This will populate your database with sample rooms and cars for testing",
        warning: "Warning",
        warningDesc: "This will add sample data to your database. Only run this once for initial setup or testing purposes.",
        sampleData: "Sample Data",
        roomsSample: "Rooms (4 sample rooms):",
        carsSample: "Cars (5 sample vehicles):",
        afterSeeding: "After Seeding",
        onceSeeded: "Once the data is seeded, you can:",
        viewBookRooms: "• View and book rooms from the Rooms page",
        requestCars: "• Request cars from the Cars page",
        editResources: "• Edit resources from the Admin page",
        addMore: "• Add more resources as needed",
        seedingDatabase: "Seeding Database...",
        seedSampleData: "🌱 Seed Database with Sample Data",
      },
      common: {
        signOut: "Sign Out",
        available: "Available",
        unavailable: "Unavailable",
        petrol: "Petrol",
        diesel: "Diesel",
        electric: "Electric",
        hybrid: "Hybrid",
      }
    },
    home: {
      hero: {
        title1: "Driven by Quality,",
        title2: "Guided by Standards",
        description: "Empowering progress with trusted expertise. Dhinimex delivers comprehensive electrical, water supply, and engineering solutions driven by innovation, quality, and a commitment to long-term impact.",
        learnMore: "Learn more about us"
      },
      stats: {
        slogan: "More Than a Company — A Growing Group",
        subSlogan: "Built over two decades, across industries",
        years: "Years of Experience",
        team: "Team Members",
        industries: "Industries",
        companies: "Companies in Group"
      },
      businessPortfolio: {
        sectionTitle: "Business Portfolio",
        title: "Our Family of Companies",
        description: "Over the past 20 years, Dhinimex Group has expanded into various industries. These are the associated brands and companies under the Dhinimex umbrella, each contributing to our mission of excellence.",
        explore: "Explore all our businesses"
      },
      servicesCarousel: {
        sectionTitle: "Our Services",
        title1: "What Problem Can We ",
        title2: "Solve Together?",
        viewAll: "View all services",
        learnMore: "Learn more"
      },
      blogSection: {
        sectionTitle: "Latest Insights",
        title: "From Our News",
        viewAll: "View all articles",
        defaultTag: "Article",
        readMore: "Read more"
      }
    }
  },
  kh: {
    nav: {
      about: "អំពីយើង",
      business: "វិស័យអាជីវកម្ម",
      services: "សេវាកម្ម",
      products: "ផលិតផល",
      blog: "ព័ត៌មាន",
      careers: "ឱកាសការងារ",
      contact: "ទំនាក់ទំនង",
      search: "ស្វែងរក...",
      searchPlaceholder: "ស្វែងរកសេវាកម្ម ផលិតផល ឱកាសការងារ...",
      searchBtn: "ស្វែងរក",
      cancel: "បោះបង់",
      adminLogin: "ចូល",
      toggleLanguage: "ប្តូរភាសា",
    },
    business: {
      trading: "ពាណិជ្ជកម្ម",
      manufacturing: "ផលិតកម្ម",
      electricity: "ការចែកចាយអគ្គិសនី",
      water: "ការផ្គត់ផ្គង់ទឹក",
      scientific: "វិទ្យាសាស្ត្រ",
    },
    common: {
      readMore: "អានបន្ថែម",
      viewAll: "មើលទាំងអស់",
      home: "ទំព័រដើម",
    },
    footer: {
      aboutCopy: "ក្រុមហ៊ុន ឌីនីម៉ិច ឯ.ក ត្រូវបានចុះបញ្ជីតាំងពីឆ្នាំ ២០០៣ និងជាក្រុមហ៊ុនឈានមុខគេមួយក្នុងការផ្គត់ផ្គង់ ដំឡើង និងផ្តល់សេវាកម្មឧបករណ៍អគ្គិសនីនៅទូទាំងប្រទេសកម្ពុជា។",
      quickLinks: "តំណភ្ជាប់រហ័ស",
      contactInfo: "ព័ត៌មានទំនាក់ទំនង",
      copyright: "រក្សាសិទ្ធិ © {year} ឌីនីម៉ិច។ រក្សាសិទ្ធិគ្រប់យ៉ាង។",
      privacyPolicy: "គោលការណ៍ឯកជនភាព",
      termsOfService: "លក្ខខណ្ឌនៃសេវាកម្ម",
    },
    about: {
      hero: {
        title: "ការកសាងអនាគតរបស់ប្រទេសកម្ពុជាតាមរយៈនវានុវត្តន៍ និងឧត្តមភាព"
      },
      whoWeAre: {
        sectionTitle: "អំពីយើង",
        title: "ការបង្កើតប្រកបដោយគោលបំណង",
        description: "នៅក្នុងសេដ្ឋកិច្ចសកលដែលវិវឌ្ឍយ៉ាងលឿន និងកាន់តែស្មុគស្មាញ ភាពជោគជ័យរបស់យើងអាស្រ័យលើការប្រកាន់ខ្ជាប់យ៉ាងស្មោះត្រង់ចំពោះគោលការណ៍ស្នូលរបស់យើង៖ ការផ្តល់សេវាកម្មអតិថិជនដ៏ល្អឥតខ្ចោះ ការធ្វើសកម្មភាពប្រកបដោយសុចរិតភាព និងការទទួលខុសត្រូវ និងការគាំទ្រដល់ការរីកចម្រើនរបស់បុគ្គលិកយើង។",
        business: {
          title: "អាជីវកម្មរបស់យើង",
          description: "យើងគឺជាក្រុមហ៊ុនឈានមុខគេដែលមានទ្រព្យសកម្ម និងប្រតិបត្តិការទូទាំងពិភពលោក។",
          explore: "ស្វែងយល់ពីផលប័ត្រ"
        },
        services: {
          title: "សេវាកម្មរបស់យើង",
          description: "ដំណោះស្រាយអគ្គិសនី ការផ្គត់ផ្គង់ទឹក និងវិស្វកម្មសម្រាប់ប្រទេសកម្ពុជា។",
          explore: "ស្វែងយល់ពីសេវាកម្ម"
        },
        history: {
          title: "ប្រវត្តិរបស់យើង",
          description: "ជាមួយនឹងកេរ្តិ៍ដំណែលតាំងពីឆ្នាំ ២០០៣ យើងបានបង្ហាញពីភាពជាអ្នកដឹកនាំ។",
          explore: "ស្វែងយល់នៅទីនេះ"
        }
      },
      vision: {
        sectionTitle: "ចក្ខុវិស័យរបស់យើង",
        title: "នវានុវត្តន៍ក្នុងស្រុក ឥទ្ធិពលជាសកល",
        description: "ចក្ខុវិស័យរបស់យើងគឺចង់ក្លាយជាក្រុមហ៊ុនឈានមុខគេផ្នែកឧបករណ៍អគ្គិសនី ការផ្គត់ផ្គង់ទឹក និងនវានុវត្តន៍បច្ចេកវិទ្យា ដោយផ្តល់នូវដំណោះស្រាយ និងសេវាកម្មលំដាប់ថ្នាក់ពិភពលោក ដែលជំរុញកំណើនប្រកបដោយចីរភាព និងឥទ្ធិពលក្នុងឧស្សាហកម្ម ទាំងក្នុងស្រុក និងអន្តរជាតិ។"
      },
      mission: {
        sectionTitle: "បេសកកម្មរបស់យើង",
        title: "ការផ្តល់អំណាចដល់សហគមន៍",
        description: "បេសកកម្មរបស់យើងគឺជំរុញភាពជាអ្នកដឹកនាំក្នុងវិស័យអគ្គិសនី និងបច្ចេកវិទ្យា តាមរយៈការផ្តល់ផលិតផលគុណភាពខ្ពស់ និងសេវាកម្មជំនាញ ការបង្កើតឱកាសការងារ និងការពង្រីកលទ្ធភាពទទួលបានថាមពលទំនើប និងទឹកស្អាត ជាពិសេសនៅតាមជនបទនៃប្រទេសកម្ពុជា។ តាមរយៈនវានុវត្តន៍ ការអនុវត្តប្រកបដោយក្រមសីលធម៌ និងភាពជាអ្នកជំនាញ យើងមានគោលបំណងពង្រឹងសមត្ថភាពផ្គត់ផ្គង់របស់យើង ផ្តល់អំណាចដល់សហគមន៍ និងបង្កើតវត្តមានដ៏រឹងមាំនៅលើទីផ្សារពិភពលោក។"
      },
      coreValues: {
        sectionTitle: "អ្វីដែលយើងប្រកាន់ខ្ជាប់",
        title: "គុណតម្លៃស្នូល",
        values: [
          {
            title: "ការធានាគុណភាព",
            description: "យើងប្តេជ្ញាផ្តល់ជូនតែផលិតផលដែលមានគុណភាពខ្ពស់ ដែលបំពេញ ឬលើសពីស្តង់ដារកម្ពុជា និងអន្តរជាតិ ដូចជា TIS, IEC, ANSI/IEEE ឬតម្រូវការជាក់លាក់របស់អតិថិជន។"
          },
          {
            title: "ឧត្តមភាពបច្ចេកទេស",
            description: "ឧបករណ៍របស់យើងត្រូវបានសាងសង់ឡើងជាមួយនឹងវត្ថុធាតុដើមលំដាប់ខ្ពស់ ការរចនាប្រកបដោយប្រសិទ្ធភាព និងត្រូវបានវិស្វកម្មដើម្បីឆ្លងកាត់ការធ្វើតេស្តជាប្រចាំ និងប្រភេទសម្រាប់ការអនុវត្ត សុវត្ថិភាព និងភាពជាប់បានយូរ។"
          },
          {
            title: "ការប្តេជ្ញាចិត្តចំពោះអតិថិជន",
            description: "យើងផ្តល់អាទិភាពដល់ការពេញចិត្តរបស់អតិថិជនដោយផ្តល់ជូនតែផលិតផលដែលបំពេញតាមការត្រួតពិនិត្យគុណភាពផ្ទៃក្នុងយ៉ាងតឹងរ៉ឹង ធានាបាននូវភាពជឿជាក់ និងតម្លៃនៅក្នុងគ្រប់ដំណោះស្រាយដែលបានផ្តល់ជូន។"
          },
          {
            title: "ប្រតិបត្តិការជំរុញដោយស្តង់ដារ",
            description: "យើងរចនា និងផលិតដោយផ្តោតលើស្តង់ដារក្នុងស្រុក និងសកលលោក ដោយរួមបញ្ចូលនវានុវត្តន៍ជាមួយនឹងការអនុលោមតាម ដើម្បីផ្តល់នូវដំណោះស្រាយដែលអាចពឹងផ្អែកបាន និងត្រៀមរួចជាស្រេចសម្រាប់អនាគត។"
          },
          {
            title: "សុចរិតភាព និងភាពជាអ្នកជំនាញ",
            description: "យើងប្រកាន់ខ្ជាប់នូវការអនុវត្តប្រកបដោយក្រមសីលធម៌ និងការប្រព្រឹត្តប្រកបដោយវិជ្ជាជីវៈនៅក្នុងគ្រប់ទិដ្ឋភាពនៃប្រតិបត្តិការរបស់យើង ចាប់ពីការអភិវឌ្ឍន៍ផលិតផលរហូតដល់សេវាកម្មអតិថិជន និងភាពជាដៃគូសកល។"
          }
        ]
      },
      leadership: {
        sectionTitle: "ថ្នាក់ដឹកនាំរបស់យើង",
        title: "ជួបជាមួយប្រធានក្រុមប្រឹក្សាភិបាលរបស់យើង",
        description: "ក្រោមការដឹកនាំ និងចក្ខុវិស័យរបស់ប្រធានក្រុមប្រឹក្សាភិបាលរបស់យើង ឌីនីម៉ិច បានបង្កើតខ្លួនជាសាជីវកម្មដែលគួរឱ្យទុកចិត្ត និងគោរពនៅក្នុងឧស្សាហកម្មនេះ។",
        chairwoman: {
          p1: "ឌីនីម៉ិច គ្រុប មានប្រភពចេញពីអាជីវកម្មខ្នាតតូចដែលត្រូវបានបង្កើតឡើងក្នុងឆ្នាំ ២០០៣ ហើយចាប់តាំងពីពេលនោះមកបានរីកចម្រើនទៅជាក្រុមហ៊ុនដែលត្រូវបានទទួលស្គាល់យ៉ាងល្អ ដែលត្រូវបានគេស្គាល់សម្រាប់ការអភិវឌ្ឍជាបន្តបន្ទាប់ និងការចូលរួមចំណែកដ៏មានអត្ថន័យចំពោះសង្គម និងជាតិ។",
          p2: "ភាពរឹងមាំ និងអាយុកាលរបស់ក្រុមហ៊ុនគឺចាក់ឫសនៅក្នុងការប្តេជ្ញាចិត្តយ៉ាងមុតមាំរបស់ខ្លួនចំពោះទិសដៅស្នូល៖ ដើម្បីទទួលបានការទទួលស្គាល់ និងការទុកចិត្តពីអតិថិជនដោយការប្រកាន់ខ្ជាប់នូវស្តង់ដារសីលធម៌ តម្លាភាព និងសុចរិតភាពខ្ពស់។ ឌីនីម៉ិច ផ្តល់សារៈសំខាន់ខ្ពស់លើសេវាកម្មដ៏ល្អឥតខ្ចោះ និងគុណភាពផលិតផល ដែលជាកត្តាសំខាន់នៅពីក្រោយភាពជោគជ័យបច្ចុប្បន្ន និងកំណើនប្រកបដោយចីរភាព។",
          p3: "វឌ្ឍនភាពនេះអាចធ្វើទៅបានដោយសារការខិតខំប្រឹងប្រែងយ៉ាងយកចិត្តទុកដាក់របស់ក្រុមសហការដែលធ្វើការដូចជាគ្រួសារ ជាមួយនឹងការតស៊ូ ការប្តេជ្ញាចិត្តខ្ពស់ ការគាំទ្រគ្នាទៅវិញទៅមក និងការប្រាស្រ័យទាក់ទងប្រកបដោយប្រសិទ្ធភាព។ គោលការណ៍នៃសាមគ្គីភាពជាកម្លាំង គឺជាចំណុចកណ្តាលនៃការរីកចម្រើនរបស់ក្រុមហ៊ុន។",
          p4: "សព្វថ្ងៃនេះ ឌីនីម៉ិច បន្តរីកចម្រើន និងជំរុញយ៉ាងសកម្មនូវការអភិវឌ្ឍកម្លាំងពលកម្មរបស់ខ្លួនតាមរយៈការបណ្តុះបណ្តាល និងការលើកទឹកចិត្តឱ្យមានការគិតប្រកបដោយនវានុវត្តន៍។ ក្រុមហ៊ុនប្រាថ្នាចង់នៅតែជាជម្រើសឈានមុខគេនៅកម្រិតជាតិ ខណៈពេលដែលជំរុញបេសកកម្មរបស់ខ្លួននៅលើឆាកអន្តរជាតិ។"
        },
        management: {
          sectionTitle: "នាយកប្រតិបត្តិ",
          title: "ជួបជាមួយក្រុមគ្រប់គ្រងរបស់យើង",
          description: "ក្រុមគ្រប់គ្រងរបស់ ឌីនីម៉ិច ប្រមូលផ្តុំក្រុមអ្នកជំនាញដែលមានបទពិសោធន៍ចម្រុះ ជាមួយនឹងជំនាញស៊ីជម្រៅផ្នែកវិស្វកម្ម ហិរញ្ញវត្ថុ ប្រតិបត្តិការ និងការអភិវឌ្ឍយុទ្ធសាស្ត្រ។"
        },
        departments: {
          sectionTitle: "ការគ្រប់គ្រង",
          title: "ប្រធាននាយកដ្ឋាន",
          description: "ប្រធាននាយកដ្ឋានរបស់យើងដឹកនាំដោយជំនាញ និងការយកចិត្តទុកដាក់ ជំរុញឧត្តមភាពនៅគ្រប់មុខងារនៃអាជីវកម្មរបស់យើង។"
        }
      }
    },
    businessPage: {
      hero: {
        title: "ឌីនីម៉ិច គ្រុប",
        description: "ដំណើរនៃការរីកចម្រើន នវានុវត្តន៍ និងការផ្លាស់ប្តូរ។ ពីការចាប់ផ្តើមដ៏តូចតាចក្នុងឆ្នាំ ២០០៣ រហូតដល់ក្លាយជាសម្ព័ន្ធក្រុមហ៊ុនចម្រុះចំនួន ១៨ ក្នុងវិស័យចំនួន ៥។"
      },
      milestones: [
        {
          title: "កន្លែងដែល ឌីនីម៉ិច ចាប់ផ្តើម",
          subtitle: "ជំហានដំបូងដើម្បីបង្កើតអនាគត",
          description: "ក្រុមហ៊ុន ឌីនីម៉ិច ឯ.ក ត្រូវបានបង្កើតឡើងជាអ្នកផ្គត់ផ្គង់ផ្អែកលើពាណិជ្ជកម្មដែលផ្តោតលើឧបករណ៍អគ្គិសនី និងសមាសធាតុផ្គត់ផ្គង់ទឹក។ ពីការចាប់ផ្តើមដ៏តូចតាច ក្រុមហ៊ុនបានចាក់គ្រឹះសម្រាប់អ្វីដែលនឹងក្លាយជាសម្ព័ន្ធក្រុមហ៊ុនចម្រុះដែលបម្រើតម្រូវការហេដ្ឋារចនាសម្ព័ន្ធរបស់ប្រទេសកម្ពុជា។",
          events: [
            "បង្កើត ឌីនីម៉ិច ជាក្រុមហ៊ុនពាណិជ្ជកម្មឧបករណ៍អគ្គិសនី",
            "ពង្រីកជួរផលិតផលដើម្បីរួមបញ្ចូលសមាសធាតុផ្គត់ផ្គង់ទឹក"
          ]
        },
        {
          title: "ការធ្វើពិពិធកម្មទៅក្នុងសេវាកម្មទឹកភ្លើង",
          subtitle: "ការកសាងហេដ្ឋារចនាសម្ព័ន្ធសម្រាប់សហគមន៍",
          description: "សម្ព័ន្ធក្រុមហ៊ុនបានពង្រីកទៅក្នុងសេវាកម្មទឹកភ្លើង ដោយវិនិយោគលើសម្បទានចែកចាយអគ្គិសនី និងទឹកតាមខេត្ត។ រយៈពេលនេះបានកត់សម្គាល់ការចាប់ផ្តើមនៃការផ្លាស់ប្តូររបស់ ឌីនីម៉ិច ពីក្រុមហ៊ុនពាណិជ្ជកម្មទៅជាអ្នកផ្តល់ហេដ្ឋារចនាសម្ព័ន្ធរួមបញ្ចូលគ្នា។",
          events: [
            "ទទួលបានអាជ្ញាប័ណ្ណចែកចាយអគ្គិសនីខេត្តដំបូង",
            "បើកដំណើរការផ្នែកហេដ្ឋារចនាសម្ព័ន្ធផ្គត់ផ្គង់ទឹក",
            "ពង្រីកការគ្របដណ្តប់សេវាកម្មទឹកភ្លើងទៅកាន់ខេត្តជាច្រើន",
            "អនុវត្តប្រព័ន្ធត្រួតពិនិត្យឆ្លាតវៃនៅទូទាំងបណ្តាញ"
          ]
        },
        {
          title: "ការពង្រីកចូលទៅក្នុងផលិតកម្ម",
          subtitle: "សមាហរណកម្មបញ្ឈរសម្រាប់ការត្រួតពិនិត្យគុណភាព",
          description: "ឌីនីម៉ិច បានបង្កើនសមត្ថភាពផលិតក្នុងស្រុក ដោយបង្កើតរោងចក្រផលិតសម្រាប់ម៉ាស៊ីនបំប្លែង ខ្សែចម្លង ខ្សែកាប និងបង្គោលបេតុង។ សមាហរណកម្មបញ្ឈរនេះបានអនុញ្ញាតឱ្យមានការផ្តល់ជូន EPC ពីដើមដល់ចប់។",
          events: [
            "បង្កើតរោងចក្រផលិតម៉ាស៊ីនបំប្លែង",
            "បើករោងចក្រផលិតខ្សែកាប និងខ្សែចម្លង",
            "សម្រេចបានសមាហរណកម្មបញ្ឈរពេញលេញជាមួយមន្ទីរពិសោធន៍"
          ]
        },
        {
          title: "ការធ្វើពិពិធកម្មផលប័ត្រវិនិយោគ",
          subtitle: "កំណើនយុទ្ធសាស្ត្រ និងភាពជាដៃគូ",
          description: "សព្វថ្ងៃនេះ ឌីនីម៉ិច គ្រុប រួមមានក្រុមហ៊ុនចំនួន ១៨ ក្នុងវិស័យចំនួន ៥ ជាមួយនឹងការវិនិយោគជាយុទ្ធសាស្ត្រក្នុងឧស្សាហកម្មផ្សេងៗ។ សម្ព័ន្ធក្រុមហ៊ុនបន្តរីកចម្រើន ខណៈពេលដែលរក្សាការប្តេជ្ញាចិត្តរបស់ខ្លួនចំពោះគុណភាព និងនវានុវត្តន៍។",
          events: [
            "រៀបចំរចនាសម្ព័ន្ធឡើងវិញជា ឌីនីម៉ិច គ្រុប ដែលមានក្រុមហ៊ុនចំនួន ១៨",
            "ការវិនិយោគជាយុទ្ធសាស្ត្រក្នុងអាជីវកម្មបច្ចេកវិទ្យាថ្មីៗ",
            "បើកដំណើរការមន្ទីរពិសោធន៍នវានុវត្តន៍ និងធ្វើតេស្ត"
          ]
        }
      ]
    },
    servicesPage: {
      hero: {
        title: "ដំណោះស្រាយគ្រប់ជ្រុងជ្រោយសម្រាប់ហេដ្ឋារចនាសម្ព័ន្ធ",
        description: "ចាប់ពីការផលិត និងការដំឡើងរហូតដល់ការធ្វើតេស្ត និងការផ្តល់សេវាកម្មទឹកភ្លើង ឌីនីម៉ិច ផ្តល់ជូននូវសេវាកម្ម EPC ពីដើមដល់ចប់ ដែលគាំទ្រដោយជំនាញជាង ២១ ឆ្នាំ។",
        requestQuote: "ស្នើសុំសម្រង់តម្លៃ",
        exploreServices: "ស្វែងយល់ពីសេវាកម្ម"
      },
      expertise: {
        sectionTitle: "ជំនាញរបស់យើង",
        title: "ស្វែងយល់ពីសេវាកម្មរបស់យើង",
        description: "ចាប់ពីការរចនា និងការផលិតរហូតដល់ការដំឡើង និងការថែទាំ យើងផ្តល់ជូននូវដំណោះស្រាយគ្រប់ជ្រុងជ្រោយដែលតម្រូវតាមតម្រូវការហេដ្ឋារចនាសម្ព័ន្ធរបស់អ្នក។",
        learnMore: "ស្វែងយល់បន្ថែម"
      },
      process: {
        sectionTitle: "ដំណើរការរបស់យើង",
        title: "របៀបដែលយើងធ្វើការ",
        description: "វិធីសាស្រ្តដែលមានរចនាសម្ព័ន្ធរបស់យើងធានានូវការប្រាស្រ័យទាក់ទងប្រកបដោយតម្លាភាព ការផ្តល់ជូនប្រកបដោយគុណភាព និងការពេញចិត្តរបស់អតិថិជននៅគ្រប់ដំណាក់កាល។",
        steps: [
          {
            title: "ការពិគ្រោះយោបល់",
            description: "ការចុះពិនិត្យទីតាំង និងការពិគ្រោះយោបល់ជាមួយម្ចាស់គម្រោងដើម្បីយល់ពីតម្រូវការ។",
            step: "ជំហានទី ០១"
          },
          {
            title: "ការរៀបចំផែនការ",
            description: "ការរៀបចំ BOQ និងគំនូរលម្អិតសម្រាប់ការពិនិត្យ និងអនុម័ត។",
            step: "ជំហានទី ០២"
          },
          {
            title: "ការប្រតិបត្តិ",
            description: "ការលទ្ធកម្ម ការសាងសង់ ការធ្វើតេស្ត និងការដាក់ឱ្យដំណើរការគម្រោង។",
            step: "ជំហានទី ០៣"
          },
          {
            title: "ការប្រគល់ជូន",
            description: "ការប្រគល់គម្រោងជាមួយនឹងឯកសារគ្រប់ជ្រុងជ្រោយ និងការគាំទ្រក្រោយការលក់។",
            step: "ជំហានទី ០៤"
          }
        ]
      },
      faq: {
        sectionTitle: "សំណួរដែលសួរញឹកញាប់",
        title: "សំណួរដែលសួរញឹកញាប់",
        description: "ទទួលបានចម្លើយច្បាស់លាស់ចំពោះសំណួរទូទៅអំពីសេវាកម្ម ដំណើរការ និងសមត្ថភាពរបស់យើង។",
        contactMore: "មានសំណួរបន្ថែម? ទាក់ទងមកយើង"
      },
      cta: {
        title: "ត្រៀមខ្លួនដើម្បីចាប់ផ្តើមគម្រោងរបស់អ្នកហើយឬនៅ?",
        description: "ទាក់ទងមកយើងថ្ងៃនេះសម្រាប់ការពិគ្រោះយោបល់។ ក្រុមការងាររបស់យើងត្រៀមខ្លួនជាស្រេចដើម្បីជួយអ្នករៀបចំផែនការ រចនា និងប្រតិបត្តិគម្រោងហេដ្ឋារចនាសម្ព័ន្ធរបស់អ្នកប្រកបដោយឧត្តមភាព។",
        getQuote: "ទទួលបានសម្រង់តម្លៃឥតគិតថ្លៃ",
        call: "ទូរស័ព្ទ៖ 011 753 940"
      },
      modal: {
        successTitle: "សូមអរគុណ!",
        successDesc: "យើងនឹងទាក់ទងទៅអ្នកវិញក្នុងរយៈពេលមួយថ្ងៃធ្វើការ។",
        title: "តើយើងអាចជួយអ្នកយ៉ាងដូចម្តេច?",
        subtitle: "បំពេញទម្រង់បែបបទខាងក្រោម ហើយយើងនឹងទាក់ទងទៅអ្នកវិញក្នុងពេលឆាប់ៗនេះ។",
        nameLabel: "ឈ្មោះពេញ",
        namePlaceholder: "ឈ្មោះរបស់អ្នក",
        phoneLabel: "ទូរស័ព្ទ",
        phonePlaceholder: "12 345 6789",
        serviceLabel: "ប្រភេទសេវាកម្ម",
        serviceSelect: "ជ្រើសរើសសេវាកម្ម",
        serviceOther: "ផ្សេងៗ / សំណួរទូទៅ",
        messageLabel: "តើយើងអាចជួយអ្នកយ៉ាងដូចម្តេច?",
        messagePlaceholder: "ប្រាប់យើងអំពីគម្រោង ឬសំណួររបស់អ្នក...",
        sending: "កំពុងផ្ញើ...",
        send: "ផ្ញើសារ"
      }
    },
    productsPage: {
      loading: "កំពុងផ្ទុកផលិតផល...",
      hero: {
        title: "ឧបករណ៍កម្រិតឧស្សាហកម្មសម្រាប់សេវាកម្មទឹកភ្លើង",
        description: "ស្វែងយល់ពីជម្រើសឧបករណ៍ និងបរិក្ខារវិជ្ជាជីវៈដែលបានជ្រើសរើសយ៉ាងយកចិត្តទុកដាក់ពីម៉ាកយីហោឈានមុខគេ ដែលត្រូវបានរចនាឡើងសម្រាប់ការសាងសង់ ការងារអគ្គិសនី និងកម្មវិធីឧស្សាហកម្ម។",
        viewAll: "មើលផលិតផលទាំងអស់",
        requestQuote: "ស្នើសុំសម្រង់តម្លៃ"
      },
      browse: {
        sectionTitle: "ស្វែងរកបណ្តុំផលិតផល",
        title: "ទិញតាមប្រភេទ",
        description: "ស្វែងយល់ពីជួរឧបករណ៍វិជ្ជាជីវៈដ៏ទូលំទូលាយរបស់យើងដែលត្រូវបានរៀបចំតាមប្រភេទដើម្បីងាយស្រួលក្នុងការស្វែងរក។"
      },
      featured: {
        sectionTitle: "ជម្រើសកំពូល",
        title: "ផលិតផលលេចធ្លោ",
        description: "ស្វែងយល់ពីឧបករណ៍ និងបរិក្ខារពេញនិយមបំផុតរបស់យើង ដែលត្រូវបានជ្រើសរើសដោយដៃសម្រាប់គុណភាព និងដំណើរការ។"
      },
      brands: {
        sectionTitle: "ដៃគូរបស់យើង",
        title: "ទិញតាមម៉ាកយីហោ",
        description: "យើងមានមោទនភាពក្នុងការធ្វើជាដៃគូជាមួយម៉ាកយីហោឈានមុខគេក្នុងឧស្សាហកម្ម ដើម្បីនាំយកឧបករណ៍ និងបរិក្ខារល្អបំផុតមកឱ្យអ្នក។",
        shopBrand: "ទិញតាមម៉ាកយីហោ"
      },
      listing: {
        home: "ទំព័រដើម",
        products: "ផលិតផល",
        allProducts: "ផលិតផលទាំងអស់",
        filters: "តម្រង",
        clearAll: "សម្អាតទាំងអស់",
        categories: "ប្រភេទ",
        brands: "ម៉ាកយីហោ",
        sortBy: "តម្រៀបតាម",
        showFilters: "បង្ហាញតម្រង",
        hideFilters: "លាក់តម្រង",
        items: "មុខ",
        previous: "មុន",
        next: "បន្ទាប់",
        noProducts: "រកមិនឃើញផលិតផល",
        clearFilters: "សម្អាតតម្រងទាំងអស់"
      },
      cta: {
        title: "ត្រូវការជំនួយក្នុងការស្វែងរកផលិតផលត្រឹមត្រូវមែនទេ?",
        description: "ក្រុមអ្នកជំនាញរបស់យើងនៅទីនេះដើម្បីជួយអ្នកជ្រើសរើសឧបករណ៍ និងបរិក្ខារដ៏ល្អឥតខ្ចោះសម្រាប់គម្រោងរបស់អ្នក។ ទាក់ទងមកយើងសម្រាប់ការណែនាំផ្ទាល់ខ្លួន និងតម្លៃបោះដុំ។",
        contact: "ទាក់ទងក្រុមការងារយើង",
        call: "ទូរស័ព្ទ៖ 011 753 940"
      },
      card: {
        requestQuote: "ស្នើសុំសម្រង់តម្លៃ",
        viewProduct: "មើលផលិតផល",
        noImage: "គ្មានរូបភាព"
      }
    },
    newsPage: {
      hero: {
        title: "ព័ត៌មាន និងការយល់ដឹងពីសម្ព័ន្ធក្រុមហ៊ុនរបស់យើង",
        description: "ស្វែងយល់ពីការយល់ដឹង ចំណុចលេចធ្លោនៃគម្រោង និងវប្បធម៌ក្រុមហ៊ុនពីគ្រប់អង្គភាពអាជីវកម្មរបស់យើង។"
      },
      loading: "កំពុងផ្ទុកអត្ថបទ...",
      empty: {
        title: "រកមិនឃើញអត្ថបទ",
        description: "សូមត្រលប់មកវិញឆាប់ៗនេះសម្រាប់មាតិកាថ្មីនៅក្នុងប្រភេទនេះ។"
      },
      featured: {
        defaultTag: "លេចធ្លោ",
        readFull: "អានអត្ថបទពេញ"
      },
      recent: {
        title: "អត្ថបទថ្មីៗ",
        defaultTag: "ព័ត៌មាន",
        readMore: "អានបន្ថែម"
      },
      more: {
        title: "អត្ថបទបន្ថែម",
        defaultTag: "ព័ត៌មាន"
      }
    },
    careersPage: {
      hero: {
        sectionTitle: "ចូលរួមជាមួយក្រុមរបស់យើង",
        title: "ក្លាយជាផ្នែកមួយនៃបេសកកម្មរបស់យើង",
        description: "យើងកំពុងស្វែងរកបុគ្គលដែលមានចំណង់ចំណូលចិត្តដើម្បីចូលរួមជាមួយយើងក្នុងបេសកកម្មរបស់យើង។ យើងឱ្យតម្លៃលើរចនាសម្ព័ន្ធការងារស្មើភាព ការប្រាស្រ័យទាក់ទងច្បាស់លាស់ និងភាពជាម្ចាស់ និងការទទួលខុសត្រូវពេញលេញ។",
        stats: {
          years: "ឆ្នាំនៃឧត្តមភាព",
          team: "សមាជិកក្រុម",
          sectors: "វិស័យអាជីវកម្ម"
        },
        viewPositions: "មើលមុខតំណែងដែលកំពុងជ្រើសរើស",
        sendCv: "ផ្ញើប្រវត្តិរូបរបស់អ្នក"
      },
      positions: {
        title: "មុខតំណែងដែលកំពុងជ្រើសរើស",
        rolesAvailable: "មុខតំណែងដែលមាន",
        roleAvailable: "មុខតំណែងដែលមាន",
        deadline: "ថ្ងៃផុតកំណត់៖",
        apply: "ដាក់ពាក្យ",
        empty: {
          title: "រកមិនឃើញមុខតំណែង",
          allDesc: "បច្ចុប្បន្នមិនមានមុខតំណែងទំនេរទេ។ សូមត្រលប់មកវិញឆាប់ៗនេះ ឬផ្ញើប្រវត្តិរូបរបស់អ្នកមកយើងសម្រាប់ឱកាសនាពេលអនាគត។",
          filterDesc: "រកមិនឃើញមុខតំណែងនៅក្នុងប្រភេទនេះទេ។ សូមសាកល្បងប្រភេទផ្សេង។"
        }
      },
      cta: {
        title: "មិនឃើញតួនាទីត្រឹមត្រូវមែនទេ?",
        description: "យើងតែងតែស្វែងរកបុគ្គលដែលមានទេពកោសល្យ។ ផ្ញើប្រវត្តិរូបរបស់អ្នកមកយើង ហើយយើងនឹងរក្សាទុកវាសម្រាប់ឱកាសនាពេលអនាគត។",
        sendCv: "ផ្ញើប្រវត្តិរូបរបស់អ្នក",
        contact: "ទាក់ទងមកយើង"
      }
    },
    contactPage: {
      hero: {
        sectionTitle: "ទាក់ទងមកយើង",
        title: "ទំនាក់ទំនង",
        description: "មានសំណួរ ឬចង់ស្វែងយល់បន្ថែមអំពីសម្ព័ន្ធក្រុមហ៊ុនរបស់យើង? ទាក់ទងមកយើង ហើយក្រុមការងាររបស់យើងនឹងរីករាយក្នុងការជួយ។"
      },
      form: {
        successTitle: "សារបានផ្ញើដោយជោគជ័យ!",
        successDesc: "សូមអរគុណសម្រាប់ការទាក់ទងមកយើង។ ក្រុមការងាររបស់យើងនឹងទាក់ទងទៅអ្នកវិញក្នុងរយៈពេលមួយថ្ងៃធ្វើការ។",
        sendAnother: "ផ្ញើសារមួយទៀត",
        nameLabel: "ឈ្មោះរបស់អ្នក *",
        namePlaceholder: "សុភា បុប្ផា",
        emailLabel: "អាសយដ្ឋានអ៊ីមែល *",
        emailPlaceholder: "you@email.com",
        phoneLabel: "លេខទូរស័ព្ទ",
        phonePlaceholder: "12 345 678",
        interestedIn: "ចាប់អារម្មណ៍លើ",
        selectOption: "ជ្រើសរើសជម្រើសមួយ",
        messageLabel: "តើយើងអាចជួយអ្នកយ៉ាងដូចម្តេច? *",
        messagePlaceholder: "ចែករំលែកព័ត៌មានលម្អិតមួយចំនួនអំពីសំណួរ ឬគម្រោងរបស់អ្នក...",
        error: "មានបញ្ហាខ្លះកើតឡើង។ សូមព្យាយាមម្តងទៀត ឬទាក់ទងមកយើងដោយផ្ទាល់តាមរយៈអ៊ីមែល។",
        sending: "កំពុងផ្ញើ...",
        send: "ផ្ញើសាររបស់អ្នក",
        terms1: "ដោយចុច អ្នកយល់ព្រមនឹង ",
        terms2: "លក្ខខណ្ឌ",
        terms3: " និង ",
        terms4: "គោលការណ៍ឯកជនភាព និងការការពារទិន្នន័យ"
      },
      location: {
        sectionTitle: "ទីតាំងរបស់យើង",
        title: "មកលេងយើងនៅភ្នំពេញ",
        address: "អាសយដ្ឋាន",
        getDirections: "ស្វែងរកផ្លូវ",
        phone: "ទូរស័ព្ទ",
        email: "អ៊ីមែល",
        businessHours: "ម៉ោងធ្វើការ",
        days: "ច័ន្ទ – សៅរ៍",
        hours: "8:00 ព្រឹក – 5:00 ល្ងាច"
      }
    },

    admin: {
      dashboard: {
        title: "ផ្ទាំងគ្រប់គ្រង",
        desc: "គ្រប់គ្រងផលិតផល ព័ត៌មាន ឱកាសការងារ សំណួរអតិថិជន និងកូដ QR។",
        products: "ផលិតផល",
        posts: "ព័ត៌មាន",
        careers: "ឱកាសការងារ",
        inquiries: "សំណួរ",
        qrcode: "កូដ QR",
        database: "មូលដ្ឋានទិន្នន័យ",
        manageProducts: "គ្រប់គ្រងផលិតផល",
        manageProductsDesc: "គ្រប់គ្រងកាតាឡុកផលិតផលរបស់អ្នក។",
        content: "មាតិកា",
        managePosts: "គ្រប់គ្រងព័ត៌មាន",
        managePostsDesc: "បង្កើត និងគ្រប់គ្រងព័ត៌មាន។",
        manageCareers: "គ្រប់គ្រងឱកាសការងារ",
        manageCareersDesc: "បង្កើត និងគ្រប់គ្រងឱកាសការងារ។",
        inbox: "ប្រអប់សារ",
        customerInquiries: "សំណួរអតិថិជន",
        customerInquiriesDesc: "មើល និងគ្រប់គ្រងសារដែលបានផ្ញើតាមរយៈទម្រង់ទំនាក់ទំនង។",
        prepareSeed: "រៀបចំទិន្នន័យ",
        addNewProduct: "+ បន្ថែមផលិតផលថ្មី",
        addNewPost: "+ បន្ថែមព័ត៌មានថ្មី",
        addNewCareer: "+ បន្ថែមឱកាសការងារថ្មី",
        backToList: "← ត្រលប់ទៅបញ្ជី",
        open: "បើក",
        noAccess: "គ្មានសិទ្ធិចូល",
        portal: "វិបផតថល",
        welcomeBack: "សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ",
        selectSection: "ជ្រើសរើសផ្នែកខាងក្រោមដើម្បីចាប់ផ្តើម។",
      },
      prpo: {
        title: "មុខងារសាខា",
        desc: "បញ្ជូនការបញ្ជាទិញ និងតាមដានការដឹកជញ្ជូន PO បើកនៅទូទាំងសាខា។",
        pageDesc: "បង្ហោះឯកសារ PR និង PO ពិនិត្យព័ត៌មានលម្អិតនៃការទិញ និងបញ្ជូនកំណត់ត្រា PO ចុងក្រោយ។",
        dashboard: "ផ្ទាំងគ្រប់គ្រង",
        submitPo: "បញ្ជូន PO",
        createSo: "បង្កើត SO",
        viewPo: "មើល PO",
        downloadPr: "ទាញយក PR",
        downloadPo: "ទាញយក PO",
        invoiceAttachment: "វិក្កយបត្រ",
        invoiceLink: "តំណភ្ជាប់វិក្កយបត្រ",
        deliveryNote: "ប័ណ្ណដឹកជញ្ជូន",
        deliveryNoteLinks: "តំណភ្ជាប់ប័ណ្ណដឹកជញ្ជូន",
        viewInvoice: "មើលវិក្កយបត្រ",
        viewDeliveryNote: "មើលប័ណ្ណដឹកជញ្ជូន",
      },
      internal: {
        title: "ឧបករណ៍ផ្ទៃក្នុង",
        desc: "កក់បន្ទប់ប្រជុំ រថយន្តក្រុមហ៊ុន និងគ្រប់គ្រងធនធានរួម។",
        rooms: "ការកក់បន្ទប់",
        cars: "ការកក់រថយន្ត",
        myBookings: "ការកក់របស់ខ្ញុំ",
        admin: "អ្នកគ្រប់គ្រង",
        resourceMgmt: "ការគ្រប់គ្រងធនធាន",
        manageRoomsCars: "គ្រប់គ្រងបន្ទប់ រថយន្ត និងអនុម័តការស្នើសុំកក់។",
        findAndBook: "ស្វែងរក និងកក់បន្ទប់ប្រជុំសម្រាប់ក្រុមរបស់អ្នក។",
        requestVehicles: "ស្នើសុំរថយន្តក្រុមហ៊ុនសម្រាប់ការធ្វើដំណើររបស់អ្នក។",
        viewAndManage: "មើល និងគ្រប់គ្រងការកក់បន្ទប់ និងរថយន្តរបស់អ្នកទាំងអស់",
      },
      userMgmt: {
        title: "ការគ្រប់គ្រងអ្នកប្រើប្រាស់",
        desc: "បង្កើតគណនីបុគ្គលិក កំណត់តួនាទី និងគ្រប់គ្រងសិទ្ធិចូលប្រើប្រាស់មុខងារ។",
        security: "សុវត្ថិភាព",
        createUsersDesc: "បង្កើតអ្នកប្រើប្រាស់ផ្ទៃក្នុង កំណត់ពាក្យសម្ងាត់ឡើងវិញ និងកំណត់សិទ្ធិចូលប្រើប្រាស់សម្រាប់មុខងារអ្នកគ្រប់គ្រង និងផ្ទៃក្នុង។",
        createNewUser: "បង្កើតអ្នកប្រើប្រាស់ថ្មី",
        loginUses: "ការចូលប្រើប្រាស់ឈ្មោះអ្នកប្រើប្រាស់ និងពាក្យសម្ងាត់។ អ៊ីមែលគឺស្រេចចិត្ត",
        username: "ឈ្មោះអ្នកប្រើប្រាស់",
        firstName: "នាមខ្លួន",
        lastName: "នាមត្រកូល",
        emailOpt: "អ៊ីមែល (ស្រេចចិត្ត)",
        password: "ពាក្យសម្ងាត់",
        setPassword: "កំណត់ពាក្យសម្ងាត់",
        office: "ការិយាល័យ",
        roleTitle: "តួនាទី",
        department: "ផ្នែក",
        role: "តួនាទីប្រព័ន្ធ",
        functionAccess: "សិទ្ធិចូលប្រើប្រាស់",
        createUser: "បង្កើតអ្នកប្រើប្រាស់",
        creating: "កំពុងបង្កើត...",
        manageUsers: "គ្រប់គ្រងអ្នកប្រើប្រាស់",
        refresh: "ផ្ទុកឡើងវិញ",
        user: "អ្នកប្រើប្រាស់",
        email: "អ៊ីមែល",
        status: "ស្ថានភាព",
        permissions: "សិទ្ធិ",
        actions: "សកម្មភាព",
        showing: "បង្ហាញ",
        of: "នៃ",
        previous: "មុន",
        page: "ទំព័រ",
        next: "បន្ទាប់",
        active: "សកម្ម",
        inactive: "មិនសកម្ម",
      },
      seed: {
        system: "ប្រព័ន្ធ",
        seedDatabase: "បញ្ចូលទិន្នន័យ",
        reviewStatic: "ពិនិត្យទិន្នន័យ និងបញ្ចូលទៅក្នុង Firestore។",
        backToDashboard: "← ត្រលប់ទៅផ្ទាំងគ្រប់គ្រង",
        totalCategories: "សរុបប្រភេទ",
        totalProducts: "សរុបផលិតផល",
        totalPosts: "សរុបព័ត៌មាន",
        totalCareers: "សរុបឱកាសការងារ",
        seedFromStatic: "បញ្ចូលពីឯកសារ",
        seedProducts: "បញ្ចូលផលិតផល",
        seedNewsPosts: "បញ្ចូលព័ត៌មាន",
        seedCareers: "បញ្ចូលឱកាសការងារ",
        seedFromWP: "បញ្ចូលពី WordPress",
        seedNewsWP: "បញ្ចូលព័ត៌មានពី WordPress",
        seedCareersWP: "បញ្ចូលឱកាសការងារពី WordPress",
        dataPreview: "មើលទិន្នន័យជាមុន",
        categoryBreakdown: "ការបែងចែកប្រភេទ",
        brandCategory: "ម៉ាក/ប្រភេទ",
        slug: "លេខសម្គាល់",
        productCount: "ចំនួនផលិតផល",
        seedBookingData: "បញ្ចូលទិន្នន័យប្រព័ន្ធកក់",
        populateDatabase: "នេះនឹងបញ្ចូលបន្ទប់ និងរថយន្តគំរូទៅក្នុងមូលដ្ឋានទិន្នន័យរបស់អ្នកសម្រាប់ការធ្វើតេស្ត",
        warning: "ការព្រមាន",
        warningDesc: "នេះនឹងបន្ថែមទិន្នន័យគំរូទៅក្នុងមូលដ្ឋានទិន្នន័យរបស់អ្នក។ ដំណើរការនេះតែម្តងគត់សម្រាប់ការដំឡើងដំបូង ឬគោលបំណងសាកល្បង។",
        sampleData: "ទិន្នន័យគំរូ",
        roomsSample: "បន្ទប់ (បន្ទប់គំរូ ៤):",
        carsSample: "រថយន្ត (រថយន្តគំរូ ៥):",
        afterSeeding: "បន្ទាប់ពីបញ្ចូលទិន្នន័យរួច",
        onceSeeded: "នៅពេលដែលទិន្នន័យត្រូវបានបញ្ចូលរួចរាល់ អ្នកអាច:",
        viewBookRooms: "• មើល និងកក់បន្ទប់ពីទំព័របន្ទប់",
        requestCars: "• ស្នើសុំរថយន្តពីទំព័ររថយន្ត",
        editResources: "• កែសម្រួលធនធានពីទំព័រអ្នកគ្រប់គ្រង",
        addMore: "• បន្ថែមធនធានបន្ថែមតាមតម្រូវការ",
        seedingDatabase: "កំពុងបញ្ចូលទិន្នន័យ...",
        seedSampleData: "🌱 បញ្ចូលទិន្នន័យគំរូ",
      },
      common: {
        signOut: "ចាកចេញ",
        available: "ទំនេរ",
        unavailable: "មិនទំនេរ",
        petrol: "សាំង",
        diesel: "ម៉ាស៊ូត",
        electric: "អគ្គិសនី",
        hybrid: "កូនកាត់",
      }
    },
    home: {
      hero: {
        title1: "ជំរុញដោយគុណភាព",
        title2: "ដឹកនាំដោយស្តង់ដារ",
        description: "ផ្តល់អំណាចដល់វឌ្ឍនភាពជាមួយនឹងជំនាញដែលគួរឱ្យទុកចិត្ត។ ឌីនីម៉ិច ផ្តល់ជូននូវដំណោះស្រាយអគ្គិសនី ការផ្គត់ផ្គង់ទឹក និងវិស្វកម្មដ៏ទូលំទូលាយ ដែលជំរុញដោយនវានុវត្តន៍ គុណភាព និងការប្តេជ្ញាចិត្តចំពោះផលប៉ះពាល់រយៈពេលវែង។",
        learnMore: "ស្វែងយល់បន្ថែមអំពីយើង"
      },
      stats: {
        slogan: "លើសពីក្រុមហ៊ុនមួយ — គឺជាសម្ព័ន្ធក្រុមហ៊ុនដែលកំពុងរីកចម្រើន",
        subSlogan: "កសាងឡើងជាងពីរទសវត្សរ៍ ឆ្លងកាត់ច្រើនវិស័យ",
        years: "ឆ្នាំនៃបទពិសោធន៍",
        team: "សមាជិកក្រុម",
        industries: "វិស័យអាជីវកម្ម",
        companies: "ក្រុមហ៊ុនក្នុងសម្ព័ន្ធ"
      },
      businessPortfolio: {
        sectionTitle: "វិស័យអាជីវកម្ម",
        title: "សម្ព័ន្ធក្រុមហ៊ុនរបស់យើង",
        description: "ក្នុងរយៈពេល ២០ ឆ្នាំកន្លងមកនេះ ឌីនីម៉ិច គ្រុប បានពង្រីកខ្លួនចូលទៅក្នុងវិស័យផ្សេងៗ។ ទាំងនេះគឺជាម៉ាកយីហោ និងក្រុមហ៊ុនដែលពាក់ព័ន្ធក្រោមឆ័ត្ររបស់ ឌីនីម៉ិច ដែលនីមួយៗចូលរួមចំណែកក្នុងបេសកកម្មនៃឧត្តមភាពរបស់យើង។",
        explore: "ស្វែងយល់ពីអាជីវកម្មរបស់យើងទាំងអស់"
      },
      servicesCarousel: {
        sectionTitle: "សេវាកម្មរបស់យើង",
        title1: "តើបញ្ហាអ្វីខ្លះដែលយើងអាច ",
        title2: "ដោះស្រាយជាមួយគ្នា?",
        viewAll: "មើលសេវាកម្មទាំងអស់",
        learnMore: "ស្វែងយល់បន្ថែម"
      },
      blogSection: {
        sectionTitle: "ព័ត៌មានថ្មីៗ",
        title: "ពីព័ត៌មានរបស់យើង",
        viewAll: "មើលអត្ថបទទាំងអស់",
        defaultTag: "អត្ថបទ",
        readMore: "អានបន្ថែម"
      }
    }
  }
};

