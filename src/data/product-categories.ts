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
    products: [
      {
        slug: "-impact-driver",
        brand: "stanley",
        model: "SFMCD720D2K",
        name: " 20V Brushless Impact Driver",
        price: 249,
        categories: ["power-tools", "impact", "drills"],
        subCategories: [],
        featuredHighlights: [
          "Includes 2× 4.0Ah batteries & fast charger",
          "Smart trigger with 3 electronic speed presets",
          "All-metal chuck with cold-weather clutch",
        ],
        specs: {
          "Power / Voltage": "20V MAX",
          "Motor Type": "Brushless",
          Weight: "1.5 kg (tool only)",
          Capacity: "1/2 in. chuck",
          Runtime: "180 fastenings per charge",
          Warranty: "3 years limited",
          Accessories: "2 batteries, charger, kit box",
        },
        images: [
          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1516245550890-9ac95743e386?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        slug: "-rotary-hammer",
        brand: "stanley",
        model: "SFMEH230K",
        name: " SDS-Plus Rotary Hammer",
        price: 329,
        categories: ["power-tools", "rotary"],
        subCategories: [],
        featuredHighlights: [
          "2.6 Joules impact energy",
          "Constant speed control under load",
          "Depth stop with metric markings",
        ],
        specs: {
          "Power / Voltage": "800W / 220-240V",
          "Motor Type": "Brushed, constant electronics",
          Weight: "3.1 kg",
          Capacity: "26 mm in concrete",
          Runtime: "Continuous rated",
          Warranty: "2 years limited",
          Accessories: "Depth rod, side handle, kit box",
        },
        images: [
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        slug: "stanley-automotive-impact",
        brand: "stanley",
        model: "SFMCE123WB",
        name: " 1/2\" Automotive Impact Wrench",
        price: 279,
        categories: ["automotive-tools", "wrenches"],
        subCategories: [],
        featuredHighlights: [
          "700 ft-lbs breakaway torque",
          "3-speed drive control",
          "Protective boot included",
        ],
        specs: {
          "Power / Voltage": "20V MAX",
          "Motor Type": "Brushless",
          Weight: "1.9 kg",
          Capacity: "1/2 in. anvil with detent pin",
          Runtime: "Up to 120 lug nuts per charge",
          Warranty: "3 years limited",
          Accessories: "Belt hook, protective boot",
        },
        images: [
          "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        slug: "stanley-dust-extractor",
        brand: "stanley",
        model: "SFMVC12",
        name: " 12 Gallon Dust Extractor",
        price: 319,
        categories: ["dust-management", "extractors"],
        subCategories: [],
        featuredHighlights: [
          "HEPA filter captures 99.97% @ 0.3 microns",
          "Auto pulse-clean every 30 seconds",
          "Power take-off for tool activation",
        ],
        specs: {
          "Capacity": "45 L / 12 gal",
          "Power / Voltage": "1,200 W / 220V",
          Weight: "11.2 kg",
          Runtime: "Continuous duty",
          Warranty: "3 years limited",
          Accessories: "HEPA filter, fleece bags, hose kit",
        },
        images: [
          "https://images.unsplash.com/photo-1523419409543-0c1df022bddb?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1457433575995-8407028a9970?auto=format&fit=crop&w=1200&q=80",
        ],
      },
    ],
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
    products: [
      {
        slug: "dewalt-dcm848p2-polisher",
        brand: "dewalt",
        model: "DCM848P2",
        name: "20V MAX 5.0AH Brushless Dual Action Polisher",
        price: 0,
        categories: ["power-tools", "automotive-tools"],
        subCategories: ["polishers", "cordless"],
        featuredHighlights: [],
        specs: {
          "Motor Type": "Brushless",
          "Voltage V": "20V Max",
          "Battery Capacity": "5.0 Ah",
          "No Load Speed": "2000 - 5500 rpm",
          "Max. Disc Diameter": "125 mm",
          "Switch Type": "Trigger",
          "Variable Speed": "Yes"
        },
        images: []
      },
      {
        slug: "dewalt-dcn890p2-concrete-nailer",
        brand: "dewalt",
        model: "DCN890P2",
        name: "18V 5.0AH Brushless Concrete Nailer",
        price: 0,
        categories: ["power-tools", "fastening-tools"],
        subCategories: ["nailers", "cordless"],
        featuredHighlights: [],
        specs: {
          "Voltage": "18V",
          "Battery Capacity": "5.0 Ah",
          "Nail Diameter": "2.6 - 3.7 mm",
          "Nail Length": "13 - 57 mm",
          "Magazine Capacity": "Up to 30 Nails",
          "Operating Mode": "Sequential and Rapid Cycle",
          "Weight (Bare Tool)": "4.8 kg"
        },
        images: []
      },
      {
        slug: "dewalt-dcn660d2-finish-nailer",
        brand: "dewalt",
        model: "DCN660D2",
        name: "18V XR 2.0AH 16GA Finish Nailer",
        price: 0,
        categories: ["power-tools", "fastening-tools"],
        subCategories: ["nailers", "cordless"],
        featuredHighlights: [],
        specs: {
          "Voltage": "18V",
          "Battery Capacity": "2.0Ah",
          "Nail Diameter": "1.6 mm",
          "Nail Length": "32 - 63 mm",
          "Magazine Angle": "20°",
          "Magazine Capacity": "110 Nails",
          "Operating Mode": "Bump and Sequential",
          "Weight (Bare Tool)": "2.8 kg"
        },
        images: []
      },
    
      // --- IMPACT WRENCHES ---
      {
        slug: "dewalt-dcf902d2-impact-wrench",
        brand: "dewalt",
        model: "DCF902D2",
        name: "12V 2.0AH Sub-Compact Impact Wrench",
        price: 0,
        categories: ["power-tools", "automotive-tools"],
        subCategories: ["impact-wrenches", "cordless"],
        featuredHighlights: [],
        specs: {
          "Motor Type": "Brushless",
          "Voltage": "12V",
          "Battery Capacity": "2.0 Ah",
          "Tool Holder": "3/8\" / 9.5 mm",
          "Max. Torque": "168 Nm",
          "No Load Speed": "0–2850 min-1",
          "Weight (Bare Tool)": "0.8 kg"
        },
        images: []
      },
      {
        slug: "dewalt-dcf911p2-impact-wrench",
        brand: "dewalt",
        model: "DCF911P2",
        name: "20V MAX 5.0AH 1/2\" Brushless Compact Impact Wrench",
        price: 0,
        categories: ["power-tools", "automotive-tools"],
        subCategories: ["impact-wrenches", "cordless"],
        featuredHighlights: [],
        specs: {
          "Motor Type": "Brushless",
          "Voltage V": "20V Max",
          "Battery Capacity": "5 Ah",
          "No-load speed": "0-2850 rpm",
          "Max tightening torque": "338 Nm",
          "Max breakaway torque": "542 Nm",
          "Tool holder": "12.7 mm",
          "Weight (Bare Tool)": "1.0 Kg"
        },
        images: []
      },
      {
        slug: "dewalt-dcf922m2-impact-wrench",
        brand: "dewalt",
        model: "DCF922M2",
        name: "20V MAX 4.0AH 1/2\" Compact Impact WR - Detent",
        price: 0,
        categories: ["power-tools", "automotive-tools"],
        subCategories: ["impact-wrenches", "cordless"],
        featuredHighlights: [],
        specs: {
          "Motor Type": "Brushless",
          "Voltage V": "20V Max",
          "Battery Capacity": "4.0 A",
          "No-load speed": "0-2500 rpm",
          "Max tightening torque": "406 Nm",
          "Max breakaway torque": "610 Nm",
          "Tool holder": "12.7 mm",
          "Weight (Bare Tool)": "1.1 Kg"
        },
        images: []
      },
      {
        slug: "dewalt-dcf892p2t-mid-impact-wrench",
        brand: "dewalt",
        model: "DCF892P2T",
        name: "20V MAX 5.0AH 1/2\" Mid-Range Impact Wrench",
        price: 0,
        categories: ["power-tools", "automotive-tools"],
        subCategories: ["impact-wrenches", "cordless"],
        featuredHighlights: [],
        specs: {
          "Voltage": "20V Max",
          "Battery Capacity": "5.0 Ah",
          "No Load Speed": "0-2000 rpm",
          "Max Tightening Torque": "812 Nm",
          "Max breakaway torque": "1084 Nm",
          "Tool holder": "12.7 mm",
          "Weight (Bare Tool)": "1.67 kg"
        },
        images: []
      },
    
      // --- DRILL DRIVERS & IMPACT DRIVERS ---
      {
        slug: "dewalt-dcd7771d2-drill-driver",
        brand: "dewalt",
        model: "DCD7771D2",
        name: "20V MAX 2AH Compact Brushless Drill Driver",
        price: 0,
        categories: ["power-tools", "drills"],
        subCategories: ["drill-drivers", "cordless"],
        featuredHighlights: [],
        specs: {
          "Voltage": "20V Max",
          "Battery Capacity": "2.0 Ah",
          "Max Torque (Hard)": "65 Nm",
          "Max Torque (Soft)": "26 Nm",
          "No Load Speed": "0-500 / 1750 rpm",
          "Chuck Capacity": "1.5-13 mm",
          "Weight (Bare Tool)": "1.15 kg"
        },
        images: []
      },
      {
        slug: "dewalt-dcd708s2t-drill-driver",
        brand: "dewalt",
        model: "DCD708S2T",
        name: "20V MAX 1.5AH Compact Brushless Drill Driver",
        price: 0,
        categories: ["power-tools", "drills"],
        subCategories: ["drill-drivers", "cordless"],
        featuredHighlights: [],
        specs: {
          "Voltage": "20V Max",
          "Battery Capacity": "1.5 Ah",
          "Max. Torque (Hard/Soft)": "65/26Nm",
          "No Load Speed": "0-450 / 1650 rpm",
          "Chuck Capacity": "1.5-13 mm",
          "Weight (Bare Tool)": "1.45 kg"
        },
        images: []
      },
      {
        slug: "dewalt-dcd771s2-drill-driver",
        brand: "dewalt",
        model: "DCD771S2",
        name: "20V MAX 1.5AH Compact Drill Driver",
        price: 0,
        categories: ["power-tools", "drills"],
        subCategories: ["drill-drivers", "cordless"],
        featuredHighlights: [],
        specs: {
          "Voltage": "20V Max",
          "Battery Capacity": "1.5 Ah",
          "Max. Torque (Hard)": "42 Nm",
          "Max. Torque (Soft)": "24 Nm",
          "No Load Speed": "0-450 / 1500 rpm",
          "Chuck Capacity": "1.5-13 mm",
          "Weight (Bare Tool)": "1.65 kg"
        },
        images: []
      },
      {
        slug: "dewalt-dcf801d2-impact-driver",
        brand: "dewalt",
        model: "DCF801D2",
        name: "12V 2.0AH Compact Brushless Impact Driver",
        price: 0,
        categories: ["power-tools", "drills"],
        subCategories: ["impact-drivers", "cordless"],
        featuredHighlights: [],
        specs: {
          "Motor Type": "Brushless",
          "Voltage": "12V",
          "Battery Capacity": "2.0 Ah",
          "No-load speed": "0–2850 rpm",
          "Max. torque": "163 Nm",
          "Tool holder": "6.35 mm",
          "Weight (Bare Tool)": "0.8 kg"
        },
        images: []
      },
      {
        slug: "dewalt-dcf850d2-impact-driver",
        brand: "dewalt",
        model: "DCF850D2",
        name: "18V 2.0AH 3 Speed Brushless Impact Driver",
        price: 0,
        categories: ["power-tools", "drills"],
        subCategories: ["impact-drivers", "cordless"],
        featuredHighlights: [],
        specs: {
          "Motor Type": "Brushless",
          "Voltage": "18V",
          "Battery Capacity": "2.0 Ah",
          "Max. Torque": "205 Nm",
          "Mode Select": "3 Speed",
          "Length": "100 mm",
          "Weight (Bare Tool)": "0.95 kg"
        },
        images: []
      },
      {
        slug: "dewalt-dcf809l2t-impact-driver",
        brand: "dewalt",
        model: "DCF809L2T",
        name: "18V XR 3.0AH Impact Brushless Driver Kit",
        price: 0,
        categories: ["power-tools", "drills"],
        subCategories: ["impact-drivers", "cordless"],
        featuredHighlights: [],
        specs: {
          "Motor Type": "Brushless",
          "Voltage": "18V",
          "Battery Capacity": "3.0 Ah",
          "Max. Torque": "190 Nm",
          "No Load Speed": "0-2800 rpm",
          "Max. Bolt Dia.": "M12",
          "Tool Holder": "6.35 mm (1/4\")",
          "Weight (Bare Tool)": "1.25 kg"
        },
        images: []
      },
    
      // --- HAMMER DRILLS & SDS ---
      {
        slug: "dewalt-dcd709s2t-hammer-drill",
        brand: "dewalt",
        model: "DCD709S2T",
        name: "20V MAX 1.5AH Compact Brushless Hammer Drill Driver",
        price: 0,
        categories: ["power-tools", "drills"],
        subCategories: ["hammer-drills", "cordless"],
        featuredHighlights: [],
        specs: {
          "Voltage": "20V Max",
          "Battery Capacity": "1.5 Ah",
          "Max. Torque (Hard/Soft)": "65/26 Nm",
          "No Load Speed": "0-450 / 1650 rpm",
          "Beats Per Minute": "0-7650 / 28050 bpm",
          "Chuck Capacity": "1.5-13 mm",
          "Drilling Capacity [Wood/Metal/Masonry]": "30/13/13 mm",
          "Weight (Bare Tool)": "1.2 kg"
        },
        images: []
      },
      {
        slug: "dewalt-dcd996p2-hammer-drill",
        brand: "dewalt",
        model: "DCD996P2",
        name: "20V MAX 5.0AH Premium Brushless Hammer Drill Driver",
        price: 0,
        categories: ["power-tools", "drills"],
        subCategories: ["hammer-drills", "cordless"],
        featuredHighlights: [],
        specs: {
          "Voltage": "20V Max",
          "Battery Capacity": "5.0 Ah",
          "Max. Torque (Hard)": "95 Nm",
          "Max. Torque (Soft)": "66 Nm",
          "No Load Speed": "0-450/1300/2000 rpm",
          "Beats Per Minute": "0-8600/25500/38250 bpm",
          "Chuck Capacity": "1.5-13 mm",
          "Weight (Bare Tool)": "2.2 kg"
        },
        images: []
      },
      {
        slug: "dewalt-dch172m2-sds-hammer",
        brand: "dewalt",
        model: "DCH172M2",
        name: "18V 4.0AH Compact Brushless Hammer",
        price: 0,
        categories: ["power-tools", "concrete-tools"],
        subCategories: ["rotary-hammers", "cordless"],
        featuredHighlights: [],
        specs: {
          "Motor Type": "Brushless",
          "Voltage": "18V",
          "Battery Capacity": "4.0 Ah",
          "Tool Holder": "SDS-Plus",
          "Impact Energy": "1.4 J",
          "No Load Speed": "0-1060 rpm",
          "Weight (Bare Tool)": "1.78 kg"
        },
        images: []
      },
      {
        slug: "dewalt-dch133m1-sds-hammer",
        brand: "dewalt",
        model: "DCH133M1",
        name: "18V 4.0AH Brushless SDS Plus Hammer",
        price: 0,
        categories: ["power-tools", "concrete-tools"],
        subCategories: ["rotary-hammers", "cordless"],
        featuredHighlights: [],
        specs: {
          "Motor Type": "Brushless",
          "Voltage": "18V",
          "Battery Capacity": "4.0 Ah",
          "Tool Holder": "SDS-Plus",
          "Max. Impact Energy": "2.8 J",
          "No Load Speed": "0-1500 rpm",
          "Weight (Bare Tool)": "2.3 kg"
        },
        images: []
      },
      {
        slug: "dewalt-dch263p2-sds-hammer",
        brand: "dewalt",
        model: "DCH263P2",
        name: "18V 5.0AH Brushless SDS Plus Hammer",
        price: 0,
        categories: ["power-tools", "concrete-tools"],
        subCategories: ["rotary-hammers", "cordless"],
        featuredHighlights: [],
        specs: {
          "Motor Type": "Brushless",
          "Voltage": "18V",
          "Battery Capacity": "5.0 Ah",
          "Single impact energy": "3.0 J",
          "No Load Speed": "0–1165 min-1",
          "Max. Drilling Capacity [Concrete/Wood/Metal]": "28/30/13 mm",
          "Weight (Bare Tool)": "2.7kg"
        },
        images: []
      },
      {
        slug: "dewalt-dcd716d2-hammer-drill",
        brand: "dewalt",
        model: "DCD716D2",
        name: "12V MAX 2.0AH Hammer Drill Driver",
        price: 0,
        categories: ["power-tools", "drills"],
        subCategories: ["hammer-drills", "cordless"],
        featuredHighlights: [],
        specs: {
          "Voltage": "12V Max",
          "Battery Capacity": "2.0 Ah",
          "Max. Torque (Hard / Soft)": "30 / 16 Nm",
          "No Load Speed": "0–400 / 1500 rpm",
          "Beats per Minute": "0-6000 / 22500 bpm",
          "Chuck Capacity": "1-10 mm",
          "Weight (Bare Tool)": "1.18 kg"
        },
        images: []
      },
      {
        slug: "dewalt-dcd776d2-hammer-drill",
        brand: "dewalt",
        model: "DCD776D2",
        name: "20V MAX 2.0AH Hammer Drill Driver",
        price: 0,
        categories: ["power-tools", "drills"],
        subCategories: ["hammer-drills", "cordless"],
        featuredHighlights: [],
        specs: {
          "Voltage": "20V Max",
          "Battery Capacity": "2.0 Ah",
          "Max. Torque (Hard)": "42 Nm",
          "Max. Torque (Soft)": "24 Nm",
          "No Load Speed": "0-450 / 1800 rpm",
          "Beats Per Minute": "0-7650 / 25500 bpm",
          "Chuck Capacity": "1.5-13 mm",
          "Weight (Bare Tool)": "1.7 kg"
        },
        images: []
      },
      {
        slug: "dewalt-dcd7781d2-hammer-drill",
        brand: "dewalt",
        model: "DCD7781D2",
        name: "20V MAX 2.0AH Compact Brushless Hammer Drill",
        price: 0,
        categories: ["power-tools", "drills"],
        subCategories: ["hammer-drills", "cordless"],
        featuredHighlights: [],
        specs: {
          "Voltage": "20V Max",
          "Battery Capacity": "2.0 Ah",
          "Max Torque (Hard)": "65 Nm",
          "Max Torque (Soft)": "26 Nm",
          "No Load Speed": "0-500 / 1750 rpm",
          "Beats per Minute": "0-8500 / 29750 bpm",
          "Chuck Capacity": "1.5-13 mm",
          "Weight (Bare Tool)": "1.18 kg"
        },
        images: []
      },
    
      // --- GRINDERS ---
      {
        slug: "dewalt-dcg405p2-grinder",
        brand: "dewalt",
        model: "DCG405P2",
        name: "18V 5.0AH Brushless Slide Mag Kit",
        price: 0,
        categories: ["power-tools", "metal-working"],
        subCategories: ["angle-grinders", "cordless"],
        featuredHighlights: [],
        specs: {
          "Motor Type": "Brushless",
          "Voltage": "18V",
          "Battery Capacity": "5.0 Ah",
          "Disc Diameter DCG405P2 (XJ)": "125 mm",
          "Disc Diameter DCG405P2 (IN)": "100 mm",
          "No Load Speed": "9000 rpm",
          "Switch Type": "Slider",
          "Weight (Bare Tool)": "1.74 kg"
        },
        images: []
      },
    
      // --- 12V DRILL DRIVERS ---
      {
        slug: "dewalt-dcd700d2-drill-driver",
        brand: "dewalt",
        model: "DCD700D2",
        name: "12V 2.0AH Compact Drill Driver",
        price: 0,
        categories: ["power-tools", "drills"],
        subCategories: ["drill-drivers", "cordless"],
        featuredHighlights: [],
        specs: {
          "Voltage": "12V Max",
          "Battery Capacity": "2.0 Ah",
          "Max Torque (Hard/Soft)": "24/15 Nm",
          "Chuck Capacity": "10 mm",
          "Max Drilling Capacity (Wood)": "20 mm",
          "Max Drilling Capacity (Metal)": "10 mm",
          "Weight (Bare Tool)": "0.91 Kg"
        },
        images: []
      },
      {
        slug: "dewalt-dcd710d2-drill-driver",
        brand: "dewalt",
        model: "DCD710D2",
        name: "12V 2.0AH Cordless Drill Driver",
        price: 0,
        categories: ["power-tools", "drills"],
        subCategories: ["drill-drivers", "cordless"],
        featuredHighlights: [],
        specs: {
          "Voltage": "12V Max",
          "Battery Capacity": "2.0 Ah",
          "Max Torque (Hard/Soft)": "24/15 Nm",
          "No Load Speed": "0-400 / 1500 rpm",
          "Chuck Capacity": "1-10 mm",
          "Weight (Bare Tool)": "1.1 kg"
        },
        images: []
      },
      {
        slug: "dewalt-dcd703d2-multi-head-drill",
        brand: "dewalt",
        model: "DCD703D2",
        name: "12V 2.0AH Brushless Multi-Head Drill",
        price: 0,
        categories: ["power-tools", "drills"],
        subCategories: ["drill-drivers", "cordless"],
        featuredHighlights: [],
        specs: {
          "Motor Type": "Brushless",
          "Voltage V": "12V Max",
          "No Load Speed": "0-425 / 1500 rpm",
          "Max Torque (Hard / Soft)": "57.5 / 25.5 Nm",
          "Chuck Capacity": "10 mm",
          "Max Drilling Capacity (Wood)": "20 mm",
          "Weight (Bare Tool)": "0.73 Kg"
        },
        images: []
      }
    ],
  },
  {
    slug: "black-decker",
    name: "BLACK+DECKER",
    tagline: "Agile solutions for maintenance teams.",
    description:
      "Lightweight, budget-friendly kits for facility managers, after-sales crews, and mobile service technicians.",
    focus: "Maintenance crews",
    brandColor: "#FF5A2C",
    heroImage: blackDeckerImage,
    products: [
      {
        slug: "bd-compact-drill",
        brand: "black-decker",
        model: "BDCDD12KIT",
        name: "12V Compact Drill Driver Kit",
        price: 119,
        categories: ["power-tools", "drills"],
        subCategories: [],
        featuredHighlights: [
          "23-position clutch prevents stripping",
          "Integrated bit storage",
          "USB-C charging dock",
        ],
        specs: {
          "Power / Voltage": "12V MAX",
          Weight: "1.04 kg",
          Capacity: "10 mm keyless chuck",
          Runtime: "Up to 150 screws per charge",
          Warranty: "2 years limited",
          Accessories: "Carrying case, drill & driver bit set",
        },
        images: [
          "https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1476357471311-43c0db9fb2b4?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        slug: "bd-multitool",
        brand: "black-decker",
        model: "BDMT220C",
        name: "Oscillating Multi-Tool Kit",
        price: 149,
        categories: ["power-tools", "multi-tool"],
        subCategories: [],
        featuredHighlights: [
          "20,000 OPM variable speed",
          "Tool-free blade changes",
          "LED light for tight spaces",
        ],
        specs: {
          "Power / Voltage": "4.5A / 220V",
          Weight: "1.4 kg",
          Capacity: "0-20,000 OPM",
          Runtime: "Corded continuous",
          Warranty: "2 years limited",
          Accessories: "Wood blade, semi-circle blade, sanding pad",
        },
        images: [
          "https://images.unsplash.com/photo-1459478309853-2c33a60058e7?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        slug: "bd-car-polisher",
        brand: "black-decker",
        model: "BDPW1200",
        name: "Random Orbit Car Polisher",
        price: 179,
        categories: ["automotive-tools", "polishers"],
        subCategories: [],
        featuredHighlights: [
          "3,000 RPM random orbit",
          "D-handle plus side handle",
          "6\" hook & loop pad",
        ],
        specs: {
          "Power / Voltage": "1,200 W / 220V",
          Weight: "2.7 kg",
          Capacity: "6 in. pad",
          Runtime: "Corded continuous",
          Warranty: "2 years limited",
          Accessories: "Polishing bonnet, microfiber cover",
        },
        images: [
          "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        slug: "bd-wet-dry-vac",
        brand: "black-decker",
        model: "BDWDV18",
        name: "18L Wet/Dry Vacuum",
        price: 159,
        categories: ["dust-management", "vacuums"],
        subCategories: [],
        featuredHighlights: [
          "1,000 W motor with blower mode",
          "On-board accessory caddy",
          "Quick-drain plug",
        ],
        specs: {
          Capacity: "18 L",
          "Power / Voltage": "1,000 W / 220V",
          Weight: "6 kg",
          Runtime: "Continuous duty",
          Warranty: "2 years limited",
          Accessories: "Crevice nozzle, floor tool, foam filter",
        },
        images: [
          "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1475081698730-8dfc0be1d7c5?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1477447763950-b649ad27c1d8?auto=format&fit=crop&w=1200&q=80",
        ],
      },
    ],
  },
];

