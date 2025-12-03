import type { ProductCategory } from "./site-content";

const stanleyImage = "https://stanleytools.mediaroom.com/download/STHT10479_A11_resized_3000_3000_300_rgb_jpg.jpg";
const dewaltImage = "https://media.screwfix.com/is/image/ae235/Dewalt_Headers_powertools1?resMode=sharp2";
const blackDeckerImage = "https://www.blackanddecker.com/cdn/shop/products/d4dba2cae81f2f340c2d06587b697616a5cb139d.jpg?v=1663101357";

export const productCategories: ProductCategory[] = [
  {
    slug: "stanley",
    name: "STANLEY ",
    tagline: "Jobsite proven. Built to last.",
    description:
      "Professional-grade cordless and corded solutions that keep fabrication yards, utilities crews, and construction teams productive.",
    focus: "Industrial crews",
    brandColor: "#FCD60C",
    heroImage: stanleyImage,
    products: [],
  },
  {
    slug: "dewalt",
    name: "DEWALT",
    tagline: "Powering megaproject productivity.",
    description:
      "FlexVolt and XR platforms engineered for extreme run-time, intelligent controls, and uncompromising safety on EPC job sites.",
    focus: "Mega projects",
    brandColor: "#FDB927",
    heroImage: dewaltImage,
    products: [],
  },
  {
    slug: "black-and-decker",
    name: "BLACK+DECKER",
    tagline: "Easy by Design.",
    description: "User-friendly power tools, outdoor equipment, and cleaning solutions designed to make everyday home and automotive tasks easier.",
    focus: "Home & DIY",
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
        name: "18\" Electric Chainsaw",
        price: 0,
        categories: ["power-tools"], // Matches tree ID
        subCategories: ["saws", "outdoor"], // Matches tree IDs
        featuredHighlights: [],
        specs: { "Bar length": "45cm", "Power": "220-240V", "Weight": "4.3kg" },
        images: []
      },
      {
        slug: "black-and-decker-bemw471bh-mower",
        brand: "black-and-decker",
        model: "BEMW471BH",
        name: "Rotary Lawn Mower 38cm",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: { "Power": "1600W", "Weight": "14.7kg", "Type": "Rotary" },
        images: []
      },
      {
        slug: "black-and-decker-bemwh551-hover-mower",
        brand: "black-and-decker",
        model: "BEMWH551",
        name: "Hover Mower",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: { "Power": "1200W", "Weight": "2Kg", "Deck Size": "30cm" },
        images: []
      },
      {
        slug: "black-and-decker-bemw451bh-mower",
        brand: "black-and-decker",
        model: "BEMW451BH",
        name: "Rotary Lawn Mower 32cm",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: { "Power": "1200W", "Weight": "9.35kg", "Dimension": "63.7cm" },
        images: []
      },
      {
        slug: "black-and-decker-bemw461bh-mower",
        brand: "black-and-decker",
        model: "BEMW461BH",
        name: "Rotary Lawn Mower 34cm",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: { "Power": "1400W", "Weight": "13.5kg", "Dimension": "75.2cm" },
        images: []
      },
      {
        slug: "black-and-decker-gl350l-trimmer",
        brand: "black-and-decker",
        model: "GL350L",
        name: "350W Grass String Trimmer",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: { "Power": "350W", "Cutting Width": "23cm", "Weight": "1.6kg" },
        images: []
      },
      {
        slug: "black-and-decker-stc1820epcf-trimmer",
        brand: "black-and-decker",
        model: "STC1820EPCF",
        name: "18V Easy Feed String Trimmer",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: { "Voltage": "18V", "Battery": "2.0Ah", "Feature": "Wheeled Edger" },
        images: []
      },
      {
        slug: "black-and-decker-gtc18502pcf-hedge-trimmer",
        brand: "black-and-decker",
        model: "GTC18502PCF",
        name: "18V Power Cut Hedge Trimmer",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: { "Voltage": "18V", "Blade Length": "50cm", "Feature": "Anti-jam button" },
        images: []
      },
      {
        slug: "black-and-decker-bcss20d1-shear-shrubber",
        brand: "black-and-decker",
        model: "BCSS20D1",
        name: "18V 2.0Ah Shear Shrubber",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: { "Voltage": "18V", "Blade Type": "Dual Action", "Usage": "Detail Trimming" },
        images: []
      },
      {
        slug: "black-and-decker-gwc1820pcf-blower",
        brand: "black-and-decker",
        model: "GWC1820PCF",
        name: "18V Power Command Boost Blower",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: { "Voltage": "18V", "Max Speed": "209 Kmh", "Weight": "1.6kg" },
        images: []
      },
      {
        slug: "black-and-decker-beblv300-blower-vac",
        brand: "black-and-decker",
        model: "BEBLV300-GB",
        name: "3000W 3-in-1 Blower Vacuum",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["outdoor"],
        featuredHighlights: [],
        specs: { "Power": "3000W", "Capacity": "72L Backpack", "Functions": "Blow/Vac/Mulch" },
        images: []
      },
      
      // --- WOODWORKING (Sanders) ---
      {
        slug: "black-and-decker-bew210-sander",
        brand: "black-and-decker",
        model: "BEW210-QS",
        name: "125 mm Orbital Sander",
        price: 0,
        categories: ["power-tools"],
        subCategories: ["woodworking"],
        featuredHighlights: [],
        specs: { "Power": "230 W", "Speed": "13000 RPM", "Dust Bag": "Included" },
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
        name: "1600 PSI 110 Bar Pressure Washer",
        price: 0,
        categories: ["cleaning"], // Matches tree ID
        subCategories: ["pressure-washers"], // Matches tree ID
        featuredHighlights: [],
        specs: { "Pressure": "110 bar", "Flow": "396 l/h", "Power": "1600 W" },
        images: []
      },
      {
        slug: "black-and-decker-bepw1750-pressure-washer",
        brand: "black-and-decker",
        model: "BEPW1750",
        name: "1740 PSI 120 Bar Pressure Washer",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["pressure-washers"],
        featuredHighlights: [],
        specs: { "Pressure": "120 bar", "Flow": "408 l/h", "Power": "1500 W" },
        images: []
      },
      {
        slug: "black-and-decker-bepw1800t-pressure-washer",
        brand: "black-and-decker",
        model: "BEPW1800T",
        name: "1810 PSI 125 Bar Pressure Washer",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["pressure-washers"],
        featuredHighlights: [],
        specs: { "Pressure": "125 bar", "Flow": "408 l/h", "Power": "1700W" },
        images: []
      },
      {
        slug: "black-and-decker-bepw2200-pressure-washer",
        brand: "black-and-decker",
        model: "BEPW2200",
        name: "2175 PSI 150 Bar Pressure Washer",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["pressure-washers"],
        featuredHighlights: [],
        specs: { "Pressure": "150 bar", "Flow": "450 l/h", "Power": "2000W" },
        images: []
      },
      {
        slug: "black-and-decker-bepw1600h-pressure-washer",
        brand: "black-and-decker",
        model: "BEPW1600H",
        name: "1600 PSI 110 Bar Horizontal Washer",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["pressure-washers"],
        featuredHighlights: [],
        specs: { "Pressure": "110 bar", "Design": "Horizontal", "Power": "1300W" },
        images: []
      },
      {
        slug: "black-and-decker-bepwb1740-pressure-washer",
        brand: "black-and-decker",
        model: "BEPWB1740",
        name: "120 Bar Induction Pressure Washer",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["pressure-washers"],
        featuredHighlights: [],
        specs: { "Motor": "Brushless Induction", "Pressure": "120 Bar", "Power": "1500W" },
        images: []
      },
      {
        slug: "black-and-decker-bepwb2400-pressure-washer",
        brand: "black-and-decker",
        model: "BEPWB2400",
        name: "165 Bar Induction Pressure Washer",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["pressure-washers"],
        featuredHighlights: [],
        specs: { "Motor": "Brushless Induction", "Pressure": "165 Bar", "Power": "2100W" },
        images: []
      },
      // Note: The Pressurized Sprayer is technically a cleaning tool
      {
        slug: "black-and-decker-bcpc20d1-pressurized-sprayer",
        brand: "black-and-decker",
        model: "BCPC20D1",
        name: "18V 2.0Ah Pressurized Sprayer",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["pressure-washers"], // Mapped here for visibility
        featuredHighlights: [],
        specs: { "Voltage": "18V", "Pressure": "350 PSI", "Source": "Any fresh water" },
        images: []
      },

      // --- VACUUMS (Wet/Dry, Floor, Handheld) ---
      {
        slug: "black-and-decker-wdbd10-vacuum",
        brand: "black-and-decker",
        model: "WDBD10",
        name: "10L Wet & Dry Vacuum Cleaner",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"], // Matches tree ID "vacuums"
        featuredHighlights: [],
        specs: { "Power": "1200W", "Capacity": "10L", "Type": "Wet & Dry" },
        images: []
      },
      {
        slug: "black-and-decker-wdbd15-vacuum",
        brand: "black-and-decker",
        model: "WDBD15",
        name: "15L Wet & Dry Vacuum Cleaner",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: { "Power": "1400W", "Capacity": "15L", "Type": "Wet & Dry" },
        images: []
      },
      {
        slug: "black-and-decker-wdbds30-vacuum",
        brand: "black-and-decker",
        model: "WDBDS30",
        name: "30L Wet & Dry Vacuum Cleaner",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: { "Power": "1600W", "Capacity": "30L", "Tank": "Stainless Steel" },
        images: []
      },
      {
        slug: "black-and-decker-bdwd08-vacuum",
        brand: "black-and-decker",
        model: "BDWD08",
        name: "8L Wet & Dry Vacuum Cleaner",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: { "Power": "1000W", "Capacity": "8L", "Type": "Compact" },
        images: []
      },
      {
        slug: "black-and-decker-vm1200-vacuum",
        brand: "black-and-decker",
        model: "VM1200",
        name: "1000W Bagged Vacuum Cleaner",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: { "Power": "1000W", "Type": "Bagged", "Capacity": "1.0L" },
        images: []
      },
      {
        slug: "black-and-decker-vm1680-vacuum",
        brand: "black-and-decker",
        model: "VM1680",
        name: "1600W Multicyclonic Bagless Vacuum",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: { "Power": "1600W", "Type": "Bagless", "Capacity": "2.5L" },
        images: []
      },
      {
        slug: "black-and-decker-wdc215wa-handheld",
        brand: "black-and-decker",
        model: "WDC215WA",
        name: "7.2 V Wet & Dry Handheld Vacuum",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: { "Power": "7.2V", "Type": "Handheld", "Function": "Wet & Dry" },
        images: []
      },
      {
        slug: "black-and-decker-pv1820lf-handheld",
        brand: "black-and-decker",
        model: "PV1820LF",
        name: "18V Pivot Handheld Vacuum",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: { "Voltage": "18V", "Feature": "Pivot Nozzle", "Suction": "35AW" },
        images: []
      },
      {
        slug: "black-and-decker-pd1420lp-handheld",
        brand: "black-and-decker",
        model: "PD1420LP",
        name: "14.4V Dustbuster Flexi Handheld",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: { "Voltage": "14.4V", "Feature": "Flexible Hose", "Suction": "20AW" },
        images: []
      },
      {
        slug: "black-and-decker-wda320b-handheld",
        brand: "black-and-decker",
        model: "WDA320B",
        name: "10.8V Wet & Dry Handheld Vacuum",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: { "Voltage": "10.8V", "Type": "Wet & Dry", "Capacity": "240ml" },
        images: []
      },
      {
        slug: "black-and-decker-nvb115jm-handheld",
        brand: "black-and-decker",
        model: "NVB115JM",
        name: "3.6V EPP Dry Handheld Vacuum",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["vacuums"],
        featuredHighlights: [],
        specs: { "Voltage": "3.6V", "Type": "Dry Only", "Weight": "0.65kg" },
        images: []
      },

      // --- ROBOT VACUUMS ---
      {
        slug: "black-and-decker-brva425b10-robot-vac",
        brand: "black-and-decker",
        model: "BRVA425B10",
        name: "2-in-1 Robotic Vacuum and Mop",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["robot-vacs"], // Matches tree ID
        featuredHighlights: [],
        specs: { "Run time": "120 min", "Suction": "2150 Pa", "Height": "7.02cm" },
        images: []
      },

      // --- STEAM MOPS ---
      {
        slug: "black-and-decker-fsm1605-steam-mop",
        brand: "black-and-decker",
        model: "FSM1605",
        name: "1300W Steam Mop",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["steam"], // Matches tree ID "steam"
        featuredHighlights: [],
        specs: { "Power": "1300W", "Heat-up": "30 sec", "Kills": "99.9% germs" },
        images: []
      },
      {
        slug: "black-and-decker-fsmh13e5-steam-mop",
        brand: "black-and-decker",
        model: "FSMH13E5",
        name: "1300W 5-in-1 Steam Mop",
        price: 0,
        categories: ["cleaning"],
        subCategories: ["steam"],
        featuredHighlights: [],
        specs: { "Power": "1300W", "Functions": "5-in-1", "Cord": "4m" },
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
        name: "12V DC Cyclonic Auto Vac",
        price: 0,
        categories: ["automotive-tools"],
        subCategories: ["accessories"],
        featuredHighlights: [],
        specs: { "Power": "12V DC", "Cord": "5m", "Action": "Cyclonic" },
        images: []
      },
      {
        slug: "black-and-decker-pd1200av-auto-vac",
        brand: "black-and-decker",
        model: "PD1200AV",
        name: "12V Dustbuster Flexi Auto Vac",
        price: 0,
        categories: ["automotive-tools"],
        subCategories: ["accessories"],
        featuredHighlights: [],
        specs: { "Power": "12V DC", "Feature": "Flexible Hose", "Suction": "12.5AW" },
        images: []
      },
      {
        slug: "black-and-decker-pv1200av-auto-vac",
        brand: "black-and-decker",
        model: "PV1200AV",
        name: "12V Pivot Auto Vac",
        price: 0,
        categories: ["automotive-tools"],
        subCategories: ["accessories"],
        featuredHighlights: [],
        specs: { "Power": "12V DC", "Feature": "Pivot Nozzle", "Suction": "12.5AW" },
        images: []
      },

      // --- INFLATORS ---
      {
        slug: "black-and-decker-asi200-inflator",
        brand: "black-and-decker",
        model: "ASI200-XJ",
        name: "12V Compressor with Digital Display",
        price: 0,
        categories: ["automotive-tools"],
        subCategories: ["inflators"], // Matches tree ID
        featuredHighlights: [],
        specs: { "Voltage": "12V", "Max Pressure": "120 PSI", "Display": "Digital" },
        images: []
      },

      // --- BATTERY CHARGERS ---
      {
        slug: "black-and-decker-bc12-charger",
        brand: "black-and-decker",
        model: "BC12",
        name: "Smart Battery Charger 2/8/12Amp",
        price: 0,
        categories: ["automotive-tools"],
        subCategories: ["battery-care"], // Matches tree ID "battery-care"
        featuredHighlights: [],
        specs: { "Amps": "2/8/12A", "Voltage": "12V", "Type": "Automatic/Manual" },
        images: []
      },

      // --- COOLERS (Accessories) ---
      {
        slug: "black-and-decker-bdc8-cooler",
        brand: "black-and-decker",
        model: "BDC8",
        name: "8L Cooler and Warmer",
        price: 0,
        categories: ["automotive-tools"],
        subCategories: ["accessories"], // Matches tree ID "accessories"
        featuredHighlights: [],
        specs: { "Volume": "8L", "Power": "12V DC", "Function": "Cool & Warm" },
        images: []
      },
      {
        slug: "black-and-decker-bdc24l-cooler",
        brand: "black-and-decker",
        model: "BDC24L",
        name: "24L Cooler and Warmer",
        price: 0,
        categories: ["automotive-tools"],
        subCategories: ["accessories"],
        featuredHighlights: [],
        specs: { "Volume": "24L", "Power": "12V/220V", "Function": "Cool & Warm" },
        images: []
      },

      // --- ACCESSORIES (Batteries) ---
      {
        slug: "black-and-decker-bl2018-battery",
        brand: "black-and-decker",
        model: "BL2018",
        name: "2.0Ah 18V Lithium-Ion Battery",
        price: 0,
        categories: ["power-tools"], // Or "Accessories" if you have a top level for that
        subCategories: [], // No specific subcat in tree for tool batteries, usually goes with tools
        featuredHighlights: [],
        specs: { "Voltage": "18V", "Capacity": "2.0Ah" },
        images: []
      },
    ]
  }
];
