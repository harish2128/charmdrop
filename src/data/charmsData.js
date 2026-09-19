// Real Charm Asset Imports - Authentic Transparent Charms
import nimbuMirchiImage from "../assets/charms/lucky/nimbu-mirchi.png";
import guardianFaceImage from "../assets/charms/lucky/guardian-face.png";
import evilEyeImage from "../assets/charms/lucky/evil-eye.png";
import luckyCatImage from "../assets/charms/lucky/lucky-cat.png";
import luckyBellImage from "../assets/charms/lucky/lucky-bell.png";
import fourLeafCloverImage from "../assets/charms/lucky/four-leaf-clover.png";
import darumaImage from "../assets/charms/lucky/lucky-daruma.png";
import luckyCloverImage from "../assets/charms/lucky/lucky-clover.png";
import dreamcatcherImage from "../assets/charms/lucky/dreamcatcher.png";
import luckyHorseshoeImage from "../assets/charms/lucky/lucky-horseshoe.png";
import redLuckyKnotImage from "../assets/charms/lucky/red-lucky-knot.png";
import yinYangImage from "../assets/charms/lucky/yin-yang.png";
import luckyLotusImage from "../assets/charms/lucky/lucky-lotus.png";
import vijayImage from "../assets/charms/lucky/vijay.png";
import ajithImage from "../assets/charms/lucky/ajith.png";

export const CHARM_CATEGORIES = [
  "All",
  "Lucky"
];

export const charmsData = [
  // --- LUCKY CHARMS ---
  {
    id: "nimbu-mirchi",
    name: "Nimbu Mirchi",
    category: "Lucky",
    image: nimbuMirchiImage,
    iconKey: "nimbu-mirchi",
    description: "Daily refresh talisman with fresh lemon and 7 green chillies on a black thread.",
    color: "#84CC16",
    accentColor: "#EAB308",
    isNew: false,
    isDaily: true,
    isPopular: true,
    tag: "Daily Refresh",
    swingSpeed: 3.5,
    physics: {
      weight: 0.95,
      swingMultiplier: 1.05,
      dampingMultiplier: 0.998
    },
    sound: null
  },
  {
    id: "guardian-face",
    name: "Guardian Face",
    category: "Lucky",
    image: guardianFaceImage,
    iconKey: "guardian-face",
    description: "Traditional guardian face mask talisman for protection and warding evil.",
    color: "#EA580C",
    accentColor: "#F59E0B",
    isNew: true,
    isDaily: false,
    isPopular: true,
    tag: "Aura Shield",
    swingSpeed: 3.2,
    physics: {
      weight: 1.25,
      swingMultiplier: 0.88,
      dampingMultiplier: 1.006
    },
    sound: null
  },
  {
    id: "evil-eye",
    name: "Evil Eye",
    category: "Lucky",
    image: evilEyeImage,
    iconKey: "evil-eye",
    description: "Classic blue crystal talisman warding off negative energies with smooth concentric reflections.",
    color: "#2563EB",
    accentColor: "#60A5FA",
    isNew: false,
    isDaily: false,
    isPopular: true,
    tag: "Aura Protector",
    swingSpeed: 3.5,
    physics: {
      weight: 0.82,
      swingMultiplier: 1.15,
      dampingMultiplier: 0.992
    },
    sound: null
  },
  {
    id: "lucky-cat",
    name: "Maneki Neko (Lucky Cat)",
    category: "Lucky",
    image: luckyCatImage,
    iconKey: "lucky-cat",
    description: "Golden beckoning calico cat bringing prosperity and good fortune to your clicks.",
    color: "#EAB308",
    accentColor: "#F59E0B",
    isNew: true,
    isDaily: false,
    isPopular: true,
    tag: "Wealth Magnet",
    swingSpeed: 3.5,
    physics: {
      weight: 1.05,
      swingMultiplier: 1.0,
      dampingMultiplier: 1.0
    },
    sound: {
      type: "cat",
      src: "/assets/sounds/dragon-studio-cartoon-cat-meow-487661.mp3",
      volume: 0.40,
      cooldown: 3500
    }
  },
  {
    id: "four-leaf-clover",
    name: "Four Leaf Clover",
    category: "Lucky",
    image: fourLeafCloverImage,
    iconKey: "four-leaf-clover",
    description: "Lush emerald 4-leaf botanical charm symbolizing faith, hope, love, and extraordinary luck.",
    color: "#10B981",
    accentColor: "#34D399",
    isNew: false,
    isDaily: false,
    isPopular: true,
    tag: "Nature's Luck",
    swingSpeed: 3.4,
    physics: {
      weight: 0.88,
      swingMultiplier: 1.10,
      dampingMultiplier: 0.995
    },
    sound: null
  },
  {
    id: "lucky-bell",
    name: "Fortune Bell",
    category: "Lucky",
    image: luckyBellImage,
    iconKey: "lucky-bell",
    description: "Polished brass temple bell with silk crimson cord creating synchronized chime resonance.",
    color: "#F59E0B",
    accentColor: "#EF4444",
    isNew: true,
    isDaily: false,
    isPopular: true,
    tag: "Serene Sound",
    swingSpeed: 2.9,
    physics: {
      weight: 1.18,
      swingMultiplier: 0.92,
      dampingMultiplier: 1.004
    },
    sound: {
      type: "bell",
      src: "/assets/sounds/universfield-single-church-bell-2-352062.mp3",
      volume: 0.40,
      cooldown: 3800
    }
  },
  {
    id: "daruma",
    name: "Daruma",
    category: "Lucky",
    image: darumaImage,
    iconKey: "daruma",
    description: "Traditional Japanese red Daruma tumbler doll inscribed with '福' (fortune), bringing perseverance and goal fulfillment.",
    color: "#EF4444",
    accentColor: "#F59E0B",
    isNew: true,
    isDaily: false,
    isPopular: true,
    tag: "Goal Guardian",
    swingSpeed: 3.3,
    physics: {
      weight: 1.22,
      swingMultiplier: 0.90,
      dampingMultiplier: 1.005
    },
    sound: null
  },
  {
    id: "lucky-clover",
    name: "Lucky Clover",
    category: "Lucky",
    image: luckyCloverImage,
    iconKey: "lucky-clover",
    description: "Radiant four-leaf clover talisman with polished golden trim for extraordinary serendipity.",
    color: "#16A34A",
    accentColor: "#EAB308",
    isNew: true,
    isDaily: false,
    isPopular: true,
    tag: "Golden Fortune",
    swingSpeed: 3.4,
    physics: {
      weight: 0.85,
      swingMultiplier: 1.12,
      dampingMultiplier: 0.995
    },
    sound: null
  },
  {
    id: "dreamcatcher",
    name: "Dreamcatcher",
    category: "Lucky",
    image: dreamcatcherImage,
    iconKey: "dreamcatcher",
    description: "Sacred woven hoop with sapphire bead center and soft hanging feathers to catch positive thoughts.",
    color: "#B45309",
    accentColor: "#3B82F6",
    isNew: true,
    isDaily: false,
    isPopular: true,
    tag: "Peaceful Mind",
    swingSpeed: 3.6,
    physics: {
      weight: 0.80,
      swingMultiplier: 1.15,
      dampingMultiplier: 0.994
    },
    sound: null
  },
  {
    id: "lucky-horseshoe",
    name: "Lucky Horseshoe",
    category: "Lucky",
    image: luckyHorseshoeImage,
    iconKey: "lucky-horseshoe",
    description: "Solid forged golden horseshoe talisman crafted to catch and store good fortune.",
    color: "#CA8A04",
    accentColor: "#FDE047",
    isNew: true,
    isDaily: false,
    isPopular: true,
    tag: "Enduring Luck",
    swingSpeed: 3.0,
    physics: {
      weight: 1.25,
      swingMultiplier: 0.88,
      dampingMultiplier: 1.005
    },
    sound: null
  },
  {
    id: "red-lucky-knot",
    name: "Red Lucky Knot",
    category: "Lucky",
    image: redLuckyKnotImage,
    iconKey: "red-lucky-knot",
    description: "Intricate crimson mystic knot featuring a gold sphere bead and cascading silk tassel threads.",
    color: "#DC2626",
    accentColor: "#F59E0B",
    isNew: true,
    isDaily: false,
    isPopular: true,
    tag: "Longevity & Joy",
    swingSpeed: 3.3,
    physics: {
      weight: 0.90,
      swingMultiplier: 1.08,
      dampingMultiplier: 0.997
    },
    sound: null
  },
  {
    id: "yin-yang",
    name: "Yin Yang",
    category: "Lucky",
    image: yinYangImage,
    iconKey: "yin-yang",
    description: "Harmonious duality emblem encased in a circular golden bezel bringing equilibrium to your workspace.",
    color: "#1E293B",
    accentColor: "#F59E0B",
    isNew: true,
    isDaily: false,
    isPopular: true,
    tag: "Balance & Harmony",
    swingSpeed: 3.2,
    physics: {
      weight: 1.05,
      swingMultiplier: 1.0,
      dampingMultiplier: 1.0
    },
    sound: null
  },
  {
    id: "lucky-lotus",
    name: "Lucky Lotus",
    category: "Lucky",
    image: luckyLotusImage,
    iconKey: "lucky-lotus",
    description: "Sacred crystal lotus talisman with blooming petals bringing purity, peace, and serenity.",
    color: "#EC4899",
    accentColor: "#F472B6",
    isNew: true,
    isDaily: false,
    isPopular: true,
    tag: "Purity & Peace",
    swingSpeed: 3.3,
    physics: {
      weight: 0.90,
      swingMultiplier: 1.08,
      dampingMultiplier: 0.997
    },
    sound: null
  },
  {
    id: "vijay",
    name: "Vijay",
    category: "Lucky",
    image: vijayImage,
    iconKey: "vijay",
    description: "Iconic Thalapathy Vijay portrait charm bringing charismatic screen presence and mass energy.",
    color: "#3B82F6",
    accentColor: "#60A5FA",
    isNew: true,
    isDaily: false,
    isPopular: true,
    tag: "Mass Aura",
    swingSpeed: 3.3,
    physics: {
      weight: 1.0,
      swingMultiplier: 1.0,
      dampingMultiplier: 1.0
    },
    sound: null
  },
  {
    id: "ajith",
    name: "Ajith",
    category: "Lucky",
    image: ajithImage,
    iconKey: "ajith",
    description: "Legendary Thala Ajith Kumar portrait charm bringing fearless style and powerful vibe.",
    color: "#E11D48",
    accentColor: "#FB7185",
    isNew: true,
    isDaily: false,
    isPopular: true,
    tag: "Fearless Style",
    swingSpeed: 3.3,
    physics: {
      weight: 1.0,
      swingMultiplier: 1.0,
      dampingMultiplier: 1.0
    },
    sound: null
  }
];

export function getCharmById(id) {
  return charmsData.find((c) => c.id === id) || charmsData[0];
}

export function getAllCharms() {
  return charmsData;
}

export function getCharmsByCategory(category) {
  if (!category || category === "All") return charmsData;
  return charmsData.filter((c) => c.category.toLowerCase() === category.toLowerCase());
}

export const instagramReelsData = [
  {
    id: "reel-bell",
    title: "Brass Fortune Bell Swinging on Windows 11 🔔✨",
    category: "Lucky Drop",
    views: "184K",
    likes: "24.6K",
    comments: "1.8K",
    themeColor: "from-amber-500 to-yellow-500",
    bgGradient: "linear-gradient(135deg, #181409 0%, #3B2D0D 50%, #1B180B 100%)",
    charmId: "lucky-bell",
    charmName: "Fortune Bell",
    tagline: "Comment 'CHARM' to get the installer link!"
  },
  {
    id: "reel-lucky",
    title: "The Daily Nimbu Mirchi Refresh Routine 🌶️🍋",
    category: "Lucky Drop",
    views: "342K",
    likes: "48.2K",
    comments: "4.2K",
    themeColor: "from-lime-500 to-emerald-500",
    bgGradient: "linear-gradient(135deg, #0D190E 0%, #1E3A1A 50%, #0B1612 100%)",
    charmId: "nimbu-mirchi",
    charmName: "Daily Nimbu Mirchi",
    tagline: "Watch it dull after 24h & hang a fresh one."
  },
  {
    id: "reel-cat",
    title: "Golden Lucky Cat Meows on Mouse Hover 🐱💛",
    category: "Lucky Drop",
    views: "215K",
    likes: "31.9K",
    comments: "2.4K",
    themeColor: "from-yellow-500 to-amber-500",
    bgGradient: "linear-gradient(135deg, #241D09 0%, #503C14 50%, #2B230E 100%)",
    charmId: "lucky-cat",
    charmName: "Maneki Neko (Lucky Cat)",
    tagline: "Reacts when you hover and drag!"
  },
  {
    id: "reel-guardian",
    title: "Ancient Guardian Face Talisman 🛡️🔥",
    category: "Lucky Drop",
    views: "156K",
    likes: "19.3K",
    comments: "1.1K",
    themeColor: "from-orange-500 to-red-500",
    bgGradient: "linear-gradient(135deg, #200D09 0%, #3F1C15 50%, #25100D 100%)",
    charmId: "guardian-face",
    charmName: "Guardian Face",
    tagline: "A little protection for your desktop."
  }
];

export const communitySetups = [
  {
    id: "setup-bell",
    title: "Zen Temple Developer Workspace",
    tag: "Lucky Setup",
    userTag: "@alex_codes",
    activeCharm: "Fortune Bell",
    iconKey: "lucky-bell",
    wallpaperStyle: "Dark Aesthetic Kyoto",
    quote: "The serene bell chime on cursor interaction is the most relaxing addition to my desktop."
  },
  {
    id: "setup-lucky",
    title: "Aesthetic Developer Workspace",
    tag: "Lucky Setup",
    userTag: "@priya_codes",
    activeCharm: "Daily Nimbu Mirchi",
    iconKey: "nimbu-mirchi",
    wallpaperStyle: "Minimal Warm Sand",
    quote: "Replacing my Nimbu Mirchi every morning has become my favorite 9am coding ritual."
  },
  {
    id: "setup-cat",
    title: "Cozy Lo-Fi Battlestation",
    tag: "Lucky Setup",
    userTag: "@lofi_luna",
    activeCharm: "Maneki Neko",
    iconKey: "lucky-cat",
    wallpaperStyle: "Tokyo Sunset Pastel",
    quote: "The lucky cat meow and gentle swing bring a warm touch of luck to my desk."
  },
  {
    id: "setup-minimal",
    title: "Clean Minimalist Ultrawide",
    tag: "Lucky Setup",
    userTag: "@design_marcus",
    activeCharm: "Evil Eye",
    iconKey: "evil-eye",
    wallpaperStyle: "Monochrome Studio",
    quote: "It's subtle, doesn't get in the way of Figma, and brings the screen to life."
  }
];

export const howItWorksSteps = [
  {
    step: "01",
    title: "Pick Your Charm",
    description: "Choose your favourite from the CharmDrop collection.",
    badge: "Step 1"
  },
  {
    step: "02",
    title: "Get CharmDrop",
    description: "Install CharmDrop once on your Windows laptop.",
    badge: "Step 2"
  },
  {
    step: "03",
    title: "Keep It With You",
    description: "Your charm stays on screen while you work, browse or create.",
    badge: "Step 3"
  }
];
