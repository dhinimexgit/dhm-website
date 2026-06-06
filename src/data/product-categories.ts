import type { ProductCategory } from "./site-content";

const stanleyImage = "https://stanleytools.mediaroom.com/download/STHT10479_A11_resized_3000_3000_300_rgb_jpg.jpg";
const dewaltImage = "https://media.screwfix.com/is/image/ae235/Dewalt_Headers_powertools1?resMode=sharp2";
const blackDeckerImage = "https://www.blackanddecker.com/cdn/shop/products/d4dba2cae81f2f340c2d06587b697616a5cb139d.jpg?v=1663101357";

export const getProductCategories = (language: 'en' | 'kh'): ProductCategory[] => [
  {
    slug: "stanley",
    name: "STANLEY ",
    tagline: language === 'kh' ? "បញ្ជាក់គុណភាពនៅការដ្ឋាន។ ផលិតឡើងដើម្បីភាពធន់។" : "Jobsite proven. Built to last.",
    description: language === 'kh' ? "ឧបករណ៍ប្រើថ្ម និងខ្សែស្តង់ដារអាជីព ដែលជួយឱ្យការដ្ឋានផលិត ក្រុមជាងទឹកភ្លើង និងក្រុមសំណង់មានផលិតភាពខ្ពស់។" : "Professional-grade cordless and corded solutions that keep fabrication yards, utilities crews, and construction teams productive.",
    focus: language === 'kh' ? "ក្រុមជាងឧស្សាហកម្ម" : "Industrial crews",
    brandColor: "#FCD60C",
    heroImage: stanleyImage,
    products: [],
  },
  {
    slug: "dewalt",
    name: "DEWALT",
    tagline: language === 'kh' ? "ផ្តល់ថាមពលដល់ផលិតភាពគម្រោងខ្នាតធំ។" : "Powering megaproject productivity.",
    description: language === 'kh' ? "ប្រព័ន្ធ FlexVolt និង XR ត្រូវបានរចនាឡើងសម្រាប់រយៈពេលដំណើរការយូរ ការគ្រប់គ្រងឆ្លាតវៃ និងសុវត្ថិភាពខ្ពស់បំផុតនៅការដ្ឋាន EPC។" : "FlexVolt and XR platforms engineered for extreme run-time, intelligent controls, and uncompromising safety on EPC job sites.",
    focus: language === 'kh' ? "គម្រោងខ្នាតធំ" : "Mega projects",
    brandColor: "#FDB927",
    heroImage: dewaltImage,
    products: [],
  },
  {
    slug: "black-and-decker",
    name: "BLACK+DECKER",
    tagline: language === 'kh' ? "ងាយស្រួលប្រើប្រាស់ដោយការរចនា។" : "Easy by Design.",
    description: language === 'kh' ? "ឧបករណ៍ជាង ឧបករណ៍ប្រើប្រាស់ក្រៅផ្ទះ និងឧបករណ៍សម្អាតដែលងាយស្រួលប្រើ រចនាឡើងដើម្បីសម្រួលដល់ការងារប្រចាំថ្ងៃក្នុងផ្ទះ និងយានយន្ត។" : "User-friendly power tools, outdoor equipment, and cleaning solutions designed to make everyday home and automotive tasks easier.",
    focus: language === 'kh' ? "ប្រើប្រាស់ក្នុងផ្ទះ និងធ្វើដោយខ្លួនឯង" : "Home & DIY",
    brandColor: "#FF5C00",
    heroImage: blackDeckerImage,
    products: [
      // =========================================================
      // CATEGORY: POWER TOOLS (ID: power-tools)
      // Subcats used: outdoor, woodworking, saws
      // =========================================================
      
      // --- OUTDOOR & GARDEN (Mowers, Trimmers, Blowers, Chainsaws) ---
      {
        slug: "black-and-decker-becs2245-chainsaw",
        brand: "black-and-decker",
        model: "BECS2245",
        name: language === 'kh' ? "ម៉ាស៊ីនអារឈើអគ្គិសនី 18\"" : "18\" Electric Chainsaw",
        price: 0,
        categories: ["power-tools"], // Matches tree ID
        subCategories: ["saws", "outdoor"], // Matches tree IDs
        featuredHighlights: [],
        specs: language === 'kh' ? { "ប្រវែងផ្លែ": "45cm", "ថាមពល": "220-240V", "ទម្ងន់": "4.3kg" } : { "Bar length": "45cm", "Power": "220-240V", "Weight": "4.3kg" },
        images: []
      },
      {
        slug: "black-and-decker-bemw471bh-mower",
        brand: "black-and-decker",
        model: "BEMW471BH",
        name: language === 'kh' ? "ម៉ាស៊ីនកាត់ស្មៅរុញ 38cm" : "Rotary Lawn Mower 38cm",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "1600W", "ទម្ងន់": "14.7kg", "ប្រភេទ": "រុញ" } : { "Power": "1600W", "Weight": "14.7kg", "Type": "Rotary" },
        images: []
      },
      {
        slug: "black-and-decker-bemwh551-hover-mower",
        brand: "black-and-decker",
        model: "BEMWH551",
        name: language === 'kh' ? "ម៉ាស៊ីនកាត់ស្មៅអណ្តែត" : "Hover Mower",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "1200W", "ទម្ងន់": "2Kg", "ទំហំកាត់": "30cm" } : { "Power": "1200W", "Weight": "2Kg", "Deck Size": "30cm" },
        images: []
      },
      {
        slug: "black-and-decker-bemw451bh-mower",
        brand: "black-and-decker",
        model: "BEMW451BH",
        name: language === 'kh' ? "ម៉ាស៊ីនកាត់ស្មៅរុញ 32cm" : "Rotary Lawn Mower 32cm",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "1200W", "ទម្ងន់": "9.35kg", "វិមាត្រ": "63.7cm" } : { "Power": "1200W", "Weight": "9.35kg", "Dimension": "63.7cm" },
        images: []
      },
      {
        slug: "black-and-decker-bemw461bh-mower",
        brand: "black-and-decker",
        model: "BEMW461BH",
        name: language === 'kh' ? "ម៉ាស៊ីនកាត់ស្មៅរុញ 34cm" : "Rotary Lawn Mower 34cm",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "1400W", "ទម្ងន់": "13.5kg", "វិមាត្រ": "75.2cm" } : { "Power": "1400W", "Weight": "13.5kg", "Dimension": "75.2cm" },
        images: []
      },
      {
        slug: "black-and-decker-gl350l-trimmer",
        brand: "black-and-decker",
        model: "GL350L",
        name: language === 'kh' ? "ម៉ាស៊ីនកាត់ស្មៅប្រើខ្សែ 350W" : "350W Grass String Trimmer",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "350W", "ទំហំកាត់": "23cm", "ទម្ងន់": "1.6kg" } : { "Power": "350W", "Cutting Width": "23cm", "Weight": "1.6kg" },
        images: []
      },
      {
        slug: "black-and-decker-stc1820epcf-trimmer",
        brand: "black-and-decker",
        model: "STC1820EPCF",
        name: language === 'kh' ? "ម៉ាស៊ីនកាត់ស្មៅប្រើខ្សែ 18V" : "18V Easy Feed String Trimmer",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "វ៉ុល": "18V", "ថ្ម": "2.0Ah", "លក្ខណៈពិសេស": "មានកង់រុញ" } : { "Voltage": "18V", "Battery": "2.0Ah", "Feature": "Wheeled Edger" },
        images: []
      },
      {
        slug: "black-and-decker-gtc18502pcf-hedge-trimmer",
        brand: "black-and-decker",
        model: "GTC18502PCF",
        name: language === 'kh' ? "ម៉ាស៊ីនកាត់ព្រៃ 18V" : "18V Power Cut Hedge Trimmer",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "វ៉ុល": "18V", "ប្រវែងផ្លែ": "50cm", "លក្ខណៈពិសេស": "ប៊ូតុងប្រឆាំងការគាំង" } : { "Voltage": "18V", "Blade Length": "50cm", "Feature": "Anti-jam button" },
        images: []
      },
      {
        slug: "black-and-decker-bcss20d1-shear-shrubber",
        brand: "black-and-decker",
        model: "BCSS20D1",
        name: language === 'kh' ? "ម៉ាស៊ីនកាត់តាក់តែងមែកឈើ 18V 2.0Ah" : "18V 2.0Ah Shear Shrubber",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "វ៉ុល": "18V", "ប្រភេទផ្លែ": "សកម្មភាពទ្វេ", "ការប្រើប្រាស់": "កាត់តាក់តែងលម្អិត" } : { "Voltage": "18V", "Blade Type": "Dual Action", "Usage": "Detail Trimming" },
        images: []
      },
      {
        slug: "black-and-decker-gwc1820pcf-blower",
        brand: "black-and-decker",
        model: "GWC1820PCF",
        name: language === 'kh' ? "ម៉ាស៊ីនផ្លុំខ្យល់ 18V" : "18V Power Command Boost Blower",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "វ៉ុល": "18V", "ល្បឿនអតិបរមា": "209 Kmh", "ទម្ងន់": "1.6kg" } : { "Voltage": "18V", "Max Speed": "209 Kmh", "Weight": "1.6kg" },
        images: []
      },
      {
        slug: "black-and-decker-beblv300-blower-vac",
        brand: "black-and-decker",
        model: "BEBLV300-GB",
        name: language === 'kh' ? "ម៉ាស៊ីនផ្លុំ និងបូមធូលី 3000W 3-in-1" : "3000W 3-in-1 Blower Vacuum",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "3000W", "ចំណុះ": "72L កាតាបស្ពាយ", "មុខងារ": "ផ្លុំ/បូម/កិន" } : { "Power": "3000W", "Capacity": "72L Backpack", "Functions": "Blow/Vac/Mulch" },
        images: []
      },
      
      // --- WOODWORKING (Sanders) ---
      {
        slug: "black-and-decker-bew210-sander",
        brand: "black-and-decker",
        model: "BEW210-QS",
        name: language === 'kh' ? "ម៉ាស៊ីនខាត់ 125 mm" : "125 mm Orbital Sander",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["woodworking"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "230 W", "ល្បឿន": "13000 RPM", "ថង់ធូលី": "រួមបញ្ចូល" } : { "Power": "230 W", "Speed": "13000 RPM", "Dust Bag": "Included" },
        images: []
      },

      // =========================================================
      // CATEGORY: CLEANING & FLOOR CARE (ID: cleaning)
      // Subcats used: pressure-washers, vacuums, robot-vacs, steam
      // =========================================================

      // --- PRESSURE WASHERS ---
      {
        slug: "black-and-decker-bepw1600-pressure-washer",
        brand: "black-and-decker",
        model: "BEPW1600",
        name: language === 'kh' ? "ម៉ាស៊ីនបាញ់ទឹក 1600 PSI 110 Bar" : "1600 PSI 110 Bar Pressure Washer",
        price: 0,
        categories: ["cleaning"], // Matches tree ID
        subCategories: ["pressure-washers"], // Matches tree ID
        featuredHighlights: [],
        specs: language === 'kh' ? { "សម្ពាធ": "110 bar", "លំហូរ": "396 l/h", "ថាមពល": "1600 W" } : { "Pressure": "110 bar", "Flow": "396 l/h", "Power": "1600 W" },
        images: []
      },
      {
        slug: "black-and-decker-bepw1750-pressure-washer",
        brand: "black-and-decker",
        model: "BEPW1750",
        name: language === 'kh' ? "ម៉ាស៊ីនបាញ់ទឹក 1740 PSI 120 Bar" : "1740 PSI 120 Bar Pressure Washer",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["pressure-washers"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "សម្ពាធ": "120 bar", "លំហូរ": "408 l/h", "ថាមពល": "1500 W" } : { "Pressure": "120 bar", "Flow": "408 l/h", "Power": "1500 W" },
        images: []
      },
      {
        slug: "black-and-decker-bepw1800t-pressure-washer",
        brand: "black-and-decker",
        model: "BEPW1800T",
        name: language === 'kh' ? "ម៉ាស៊ីនបាញ់ទឹក 1810 PSI 125 Bar" : "1810 PSI 125 Bar Pressure Washer",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["pressure-washers"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "សម្ពាធ": "125 bar", "លំហូរ": "408 l/h", "ថាមពល": "1700W" } : { "Pressure": "125 bar", "Flow": "408 l/h", "Power": "1700W" },
        images: []
      },
      {
        slug: "black-and-decker-bepw2200-pressure-washer",
        brand: "black-and-decker",
        model: "BEPW2200",
        name: language === 'kh' ? "ម៉ាស៊ីនបាញ់ទឹក 2175 PSI 150 Bar" : "2175 PSI 150 Bar Pressure Washer",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["pressure-washers"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "សម្ពាធ": "150 bar", "លំហូរ": "450 l/h", "ថាមពល": "2000W" } : { "Pressure": "150 bar", "Flow": "450 l/h", "Power": "2000W" },
        images: []
      },
      {
        slug: "black-and-decker-bepw1600h-pressure-washer",
        brand: "black-and-decker",
        model: "BEPW1600H",
        name: language === 'kh' ? "ម៉ាស៊ីនបាញ់ទឹកផ្តេក 1600 PSI 110 Bar" : "1600 PSI 110 Bar Horizontal Washer",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["pressure-washers"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "សម្ពាធ": "110 bar", "ការរចនា": "ផ្តេក", "ថាមពល": "1300W" } : { "Pressure": "110 bar", "Design": "Horizontal", "Power": "1300W" },
        images: []
      },
      {
        slug: "black-and-decker-bepwb1740-pressure-washer",
        brand: "black-and-decker",
        model: "BEPWB1740",
        name: language === 'kh' ? "ម៉ាស៊ីនបាញ់ទឹកម៉ូទ័រអាំងឌុចស្យុង 120 Bar" : "120 Bar Induction Pressure Washer",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["pressure-washers"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ម៉ូទ័រ": "អាំងឌុចស្យុងគ្មានធ្យូង", "សម្ពាធ": "120 Bar", "ថាមពល": "1500W" } : { "Motor": "Brushless Induction", "Pressure": "120 Bar", "Power": "1500W" },
        images: []
      },
      {
        slug: "black-and-decker-bepwb2400-pressure-washer",
        brand: "black-and-decker",
        model: "BEPWB2400",
        name: language === 'kh' ? "ម៉ាស៊ីនបាញ់ទឹកម៉ូទ័រអាំងឌុចស្យុង 165 Bar" : "165 Bar Induction Pressure Washer",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["pressure-washers"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ម៉ូទ័រ": "អាំងឌុចស្យុងគ្មានធ្យូង", "សម្ពាធ": "165 Bar", "ថាមពល": "2100W" } : { "Motor": "Brushless Induction", "Pressure": "165 Bar", "Power": "2100W" },
        images: []
      },
      // Note: The Pressurized Sprayer is technically a cleaning tool
      {
        slug: "black-and-decker-bcpc20d1-pressurized-sprayer",
        brand: "black-and-decker",
        model: "BCPC20D1",
        name: language === 'kh' ? "ម៉ាស៊ីនបាញ់ទឹកប្រើថ្ម 18V 2.0Ah" : "18V 2.0Ah Pressurized Sprayer",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["pressure-washers"], // Mapped here for visibility
        featuredHighlights: [],
        specs: language === 'kh' ? { "វ៉ុល": "18V", "សម្ពាធ": "350 PSI", "ប្រភពទឹក": "ទឹកសាបណាមួយ" } : { "Voltage": "18V", "Pressure": "350 PSI", "Source": "Any fresh water" },
        images: []
      },

      // --- VACUUMS (Wet/Dry, Floor, Handheld) ---
      {
        slug: "black-and-decker-wdbd10-vacuum",
        brand: "black-and-decker",
        model: "WDBD10",
        name: language === 'kh' ? "ម៉ាស៊ីនបូមធូលីសើម និងស្ងួត 10L" : "10L Wet & Dry Vacuum Cleaner",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"], // Matches tree ID "vacuums"
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "1200W", "ចំណុះ": "10L", "ប្រភេទ": "សើម និងស្ងួត" } : { "Power": "1200W", "Capacity": "10L", "Type": "Wet & Dry" },
        images: []
      },
      {
        slug: "black-and-decker-wdbd15-vacuum",
        brand: "black-and-decker",
        model: "WDBD15",
        name: language === 'kh' ? "ម៉ាស៊ីនបូមធូលីសើម និងស្ងួត 15L" : "15L Wet & Dry Vacuum Cleaner",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "1400W", "ចំណុះ": "15L", "ប្រភេទ": "សើម និងស្ងួត" } : { "Power": "1400W", "Capacity": "15L", "Type": "Wet & Dry" },
        images: []
      },
      {
        slug: "black-and-decker-wdbds30-vacuum",
        brand: "black-and-decker",
        model: "WDBDS30",
        name: language === 'kh' ? "ម៉ាស៊ីនបូមធូលីសើម និងស្ងួត 30L" : "30L Wet & Dry Vacuum Cleaner",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "1600W", "ចំណុះ": "30L", "ធុង": "ដែកអ៊ីណុក" } : { "Power": "1600W", "Capacity": "30L", "Tank": "Stainless Steel" },
        images: []
      },
      {
        slug: "black-and-decker-bdwd08-vacuum",
        brand: "black-and-decker",
        model: "BDWD08",
        name: language === 'kh' ? "ម៉ាស៊ីនបូមធូលីសើម និងស្ងួត 8L" : "8L Wet & Dry Vacuum Cleaner",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "1000W", "ចំណុះ": "8L", "ប្រភេទ": "តូច" } : { "Power": "1000W", "Capacity": "8L", "Type": "Compact" },
        images: []
      },
      {
        slug: "black-and-decker-vm1200-vacuum",
        brand: "black-and-decker",
        model: "VM1200",
        name: language === 'kh' ? "ម៉ាស៊ីនបូមធូលីមានថង់ 1000W" : "1000W Bagged Vacuum Cleaner",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "1000W", "ប្រភេទ": "មានថង់", "ចំណុះ": "1.0L" } : { "Power": "1000W", "Type": "Bagged", "Capacity": "1.0L" },
        images: []
      },
      {
        slug: "black-and-decker-vm1680-vacuum",
        brand: "black-and-decker",
        model: "VM1680",
        name: language === 'kh' ? "ម៉ាស៊ីនបូមធូលីគ្មានថង់ 1600W" : "1600W Multicyclonic Bagless Vacuum",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "1600W", "ប្រភេទ": "គ្មានថង់", "ចំណុះ": "2.5L" } : { "Power": "1600W", "Type": "Bagless", "Capacity": "2.5L" },
        images: []
      },
      {
        slug: "black-and-decker-wdc215wa-handheld",
        brand: "black-and-decker",
        model: "WDC215WA",
        name: language === 'kh' ? "ម៉ាស៊ីនបូមធូលីកាន់ដៃសើម និងស្ងួត 7.2 V" : "7.2 V Wet & Dry Handheld Vacuum",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "7.2V", "ប្រភេទ": "កាន់ដៃ", "មុខងារ": "សើម និងស្ងួត" } : { "Power": "7.2V", "Type": "Handheld", "Function": "Wet & Dry" },
        images: []
      },
      {
        slug: "black-and-decker-pv1820lf-handheld",
        brand: "black-and-decker",
        model: "PV1820LF",
        name: language === 'kh' ? "ម៉ាស៊ីនបូមធូលីកាន់ដៃបត់បាន 18V" : "18V Pivot Handheld Vacuum",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "វ៉ុល": "18V", "លក្ខណៈពិសេស": "ក្បាលបត់បាន", "កម្លាំងបូម": "35AW" } : { "Voltage": "18V", "Feature": "Pivot Nozzle", "Suction": "35AW" },
        images: []
      },
      {
        slug: "black-and-decker-pd1420lp-handheld",
        brand: "black-and-decker",
        model: "PD1420LP",
        name: language === 'kh' ? "ម៉ាស៊ីនបូមធូលីកាន់ដៃទុយោបត់បែន 14.4V" : "14.4V Dustbuster Flexi Handheld",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "វ៉ុល": "14.4V", "លក្ខណៈពិសេស": "ទុយោបត់បែន", "កម្លាំងបូម": "20AW" } : { "Voltage": "14.4V", "Feature": "Flexible Hose", "Suction": "20AW" },
        images: []
      },
      {
        slug: "black-and-decker-wda320b-handheld",
        brand: "black-and-decker",
        model: "WDA320B",
        name: language === 'kh' ? "ម៉ាស៊ីនបូមធូលីកាន់ដៃសើម និងស្ងួត 10.8V" : "10.8V Wet & Dry Handheld Vacuum",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "វ៉ុល": "10.8V", "ប្រភេទ": "សើម និងស្ងួត", "ចំណុះ": "240ml" } : { "Voltage": "10.8V", "Type": "Wet & Dry", "Capacity": "240ml" },
        images: []
      },
      {
        slug: "black-and-decker-nvb115jm-handheld",
        brand: "black-and-decker",
        model: "NVB115JM",
        name: language === 'kh' ? "ម៉ាស៊ីនបូមធូលីកាន់ដៃស្ងួត 3.6V EPP" : "3.6V EPP Dry Handheld Vacuum",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "វ៉ុល": "3.6V", "ប្រភេទ": "ស្ងួតតែប៉ុណ្ណោះ", "ទម្ងន់": "0.65kg" } : { "Voltage": "3.6V", "Type": "Dry Only", "Weight": "0.65kg" },
        images: []
      },

      // --- ROBOT VACUUMS ---
      {
        slug: "black-and-decker-brva425b10-robot-vac",
        brand: "black-and-decker",
        model: "BRVA425B10",
        name: language === 'kh' ? "ម៉ាស៊ីនបូមធូលី និងជូតផ្ទះមនុស្សយន្ត 2-in-1" : "2-in-1 Robotic Vacuum and Mop",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["robot-vacs"], // Matches tree ID
        featuredHighlights: [],
        specs: language === 'kh' ? { "រយៈពេលដំណើរការ": "120 នាទី", "កម្លាំងបូម": "2150 Pa", "កម្ពស់": "7.02cm" } : { "Run time": "120 min", "Suction": "2150 Pa", "Height": "7.02cm" },
        images: []
      },

      // --- STEAM MOPS ---
      {
        slug: "black-and-decker-fsm1605-steam-mop",
        brand: "black-and-decker",
        model: "FSM1605",
        name: language === 'kh' ? "ឈើជូតផ្ទះចំហាយទឹក 1300W" : "1300W Steam Mop",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["steam"], // Matches tree ID "steam"
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "1300W", "កម្តៅឡើង": "30 វិនាទី", "សម្លាប់": "មេរោគ 99.9%" } : { "Power": "1300W", "Heat-up": "30 sec", "Kills": "99.9% germs" },
        images: []
      },
      {
        slug: "black-and-decker-fsmh13e5-steam-mop",
        brand: "black-and-decker",
        model: "FSMH13E5",
        name: language === 'kh' ? "ឈើជូតផ្ទះចំហាយទឹក 1300W 5-in-1" : "1300W 5-in-1 Steam Mop",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["steam"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "1300W", "មុខងារ": "5-in-1", "ខ្សែ": "4m" } : { "Power": "1300W", "Functions": "5-in-1", "Cord": "4m" },
        images: []
      },

      // =========================================================
      // CATEGORY: AUTOMOTIVE TOOLS (ID: automotive-tools)
      // Subcats used: accessories, inflators, battery-care
      // =========================================================

      // --- AUTO VACUUMS (Mapped to Accessories to match your tree structure usually) ---
      // OR mapped to "vacuums" in cleaning if you prefer. 
      // Based on tree "Auto Accessories & Coolers", I'll place them here.
      {
        slug: "black-and-decker-adv1210-auto-vac",
        brand: "black-and-decker",
        model: "ADV1210",
        name: language === 'kh' ? "ម៉ាស៊ីនបូមធូលីឡាន 12V DC" : "12V DC Cyclonic Auto Vac",
        price: 0,
        categories: ["automotive-tools"],
        subCategories: ["accessories"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "12V DC", "ខ្សែ": "5m", "សកម្មភាព": "ស៊ីក្លូន" } : { "Power": "12V DC", "Cord": "5m", "Action": "Cyclonic" },
        images: []
      },
      {
        slug: "black-and-decker-pd1200av-auto-vac",
        brand: "black-and-decker",
        model: "PD1200AV",
        name: language === 'kh' ? "ម៉ាស៊ីនបូមធូលីឡានទុយោបត់បែន 12V" : "12V Dustbuster Flexi Auto Vac",
        price: 0,
        categories: ["automotive-tools"],
        subCategories: ["accessories"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "12V DC", "លក្ខណៈពិសេស": "ទុយោបត់បែន", "កម្លាំងបូម": "12.5AW" } : { "Power": "12V DC", "Feature": "Flexible Hose", "Suction": "12.5AW" },
        images: []
      },
      {
        slug: "black-and-decker-pv1200av-auto-vac",
        brand: "black-and-decker",
        model: "PV1200AV",
        name: language === 'kh' ? "ម៉ាស៊ីនបូមធូលីឡានក្បាលបត់បាន 12V" : "12V Pivot Auto Vac",
        price: 0,
        categories: ["automotive-tools"],
        subCategories: ["accessories"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ថាមពល": "12V DC", "លក្ខណៈពិសេស": "ក្បាលបត់បាន", "កម្លាំងបូម": "12.5AW" } : { "Power": "12V DC", "Feature": "Pivot Nozzle", "Suction": "12.5AW" },
        images: []
      },

      // --- INFLATORS ---
      {
        slug: "black-and-decker-asi200-inflator",
        brand: "black-and-decker",
        model: "ASI200-XJ",
        name: language === 'kh' ? "ម៉ាស៊ីនសប់កង់ឡាន 12V មានអេក្រង់ឌីជីថល" : "12V Compressor with Digital Display",
        price: 0,
        categories: ["automotive-tools"],
        subCategories: ["inflators"], // Matches tree ID
        featuredHighlights: [],
        specs: language === 'kh' ? { "វ៉ុល": "12V", "សម្ពាធអតិបរមា": "120 PSI", "អេក្រង់": "ឌីជីថល" } : { "Voltage": "12V", "Max Pressure": "120 PSI", "Display": "Digital" },
        images: []
      },

      // --- BATTERY CHARGERS ---
      {
        slug: "black-and-decker-bc12-charger",
        brand: "black-and-decker",
        model: "BC12",
        name: language === 'kh' ? "ឆ្នាំងសាកអាគុយឆ្លាតវៃ 2/8/12Amp" : "Smart Battery Charger 2/8/12Amp",
        price: 0,
        categories: ["automotive-tools"],
        subCategories: ["battery-care"], // Matches tree ID "battery-care"
        featuredHighlights: [],
        specs: language === 'kh' ? { "អំពែរ": "2/8/12A", "វ៉ុល": "12V", "ប្រភេទ": "ស្វ័យប្រវត្តិ/ដោយដៃ" } : { "Amps": "2/8/12A", "Voltage": "12V", "Type": "Automatic/Manual" },
        images: []
      },

      // --- COOLERS (Accessories) ---
      {
        slug: "black-and-decker-bdc8-cooler",
        brand: "black-and-decker",
        model: "BDC8",
        name: language === 'kh' ? "ធុងទឹកកក និងកម្តៅ 8L" : "8L Cooler and Warmer",
        price: 0,
        categories: ["automotive-tools"],
        subCategories: ["accessories"], // Matches tree ID "accessories"
        featuredHighlights: [],
        specs: language === 'kh' ? { "ចំណុះ": "8L", "ថាមពល": "12V DC", "មុខងារ": "ត្រជាក់ និងក្តៅ" } : { "Volume": "8L", "Power": "12V DC", "Function": "Cool & Warm" },
        images: []
      },
      {
        slug: "black-and-decker-bdc24l-cooler",
        brand: "black-and-decker",
        model: "BDC24L",
        name: language === 'kh' ? "ធុងទឹកកក និងកម្តៅ 24L" : "24L Cooler and Warmer",
        price: 0,
        categories: ["automotive-tools"],
        subCategories: ["accessories"],
        featuredHighlights: [],
        specs: language === 'kh' ? { "ចំណុះ": "24L", "ថាមពល": "12V/220V", "មុខងារ": "ត្រជាក់ និងក្តៅ" } : { "Volume": "24L", "Power": "12V/220V", "Function": "Cool & Warm" },
        images: []
      },

      // --- ACCESSORIES (Batteries) ---
      {
        slug: "black-and-decker-bl2018-battery",
        brand: "black-and-decker",
        model: "BL2018",
        name: language === 'kh' ? "ថ្ម Lithium-Ion 2.0Ah 18V" : "2.0Ah 18V Lithium-Ion Battery",
        price: 0,
        categories: ["power-tools"], // Or "Accessories" if you have a top level for that
        subCategories: [], // No specific subcat in tree for tool batteries, usually goes with tools
        featuredHighlights: [],
        specs: language === 'kh' ? { "វ៉ុល": "18V", "ចំណុះ": "2.0Ah" } : { "Voltage": "18V", "Capacity": "2.0Ah" },
        images: []
      },
    ]
  }
];
