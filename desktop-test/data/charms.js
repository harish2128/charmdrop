/**
 * Reusable Charm Registry Data
 * Contains all available real charms organized by category with per-charm visual dimensions.
 */

export const CHARM_CATEGORIES = [
  "Lucky"
];

export const charms = [
  // --- LUCKY ---
  {
    id: "nimbu-mirchi",
    name: "Nimbu Mirchi",
    category: "Lucky",
    image: "assets/charms/lucky/nimbu-mirchi.png",
    scale: 1,
    maxWidth: 108,
    maxHeight: 240,
    ropeOffsetX: 0,
    ropeOffsetY: 0,
    ropeLength: 60,
    dailyRefresh: true,
    physics: {
      weight: 0.95,
      swingMultiplier: 1.05,
      dampingMultiplier: 0.998
    },
    sound: null,
    description: "Daily refresh talisman with fresh lemon and 7 green chillies."
  },
  {
    id: "guardian-face",
    name: "Guardian Face",
    category: "Lucky",
    image: "assets/charms/lucky/guardian-face.png",
    scale: 1,
    maxWidth: 110,
    maxHeight: 180,
    ropeOffsetX: 0,
    ropeOffsetY: 0,
    ropeLength: 65,
    dailyRefresh: false,
    physics: {
      weight: 1.25,
      swingMultiplier: 0.88,
      dampingMultiplier: 1.006
    },
    sound: null,
    description: "Traditional guardian face mask talisman for protection and warding evil."
  },
  {
    id: "evil-eye",
    name: "Evil Eye",
    category: "Lucky",
    image: "assets/charms/lucky/evil-eye.png",
    scale: 1,
    maxWidth: 105,
    maxHeight: 180,
    ropeOffsetX: 0,
    ropeOffsetY: 0,
    ropeLength: 75,
    dailyRefresh: false,
    physics: {
      weight: 0.82,
      swingMultiplier: 1.15,
      dampingMultiplier: 0.992
    },
    sound: null,
    description: "Classic blue crystal talisman warding off negative energies."
  },
  {
    id: "lucky-cat",
    name: "Maneki Neko (Lucky Cat)",
    category: "Lucky",
    image: "assets/charms/lucky/lucky-cat.png",
    scale: 1,
    maxWidth: 105,
    maxHeight: 190,
    ropeOffsetX: 0,
    ropeOffsetY: 0,
    ropeLength: 65,
    dailyRefresh: false,
    physics: {
      weight: 1.05,
      swingMultiplier: 1.0,
      dampingMultiplier: 1.0
    },
    sound: {
      type: "cat",
      src: "assets/sounds/dragon-studio-cartoon-cat-meow-487661.mp3",
      volume: 0.40,
      cooldown: 3500
    },
    description: "Golden beckoning calico cat bringing prosperity and good fortune."
  },
  {
    id: "four-leaf-clover",
    name: "Four Leaf Clover",
    category: "Lucky",
    image: "assets/charms/lucky/four-leaf-clover.png",
    scale: 1,
    maxWidth: 100,
    maxHeight: 180,
    ropeOffsetX: 0,
    ropeOffsetY: 0,
    ropeLength: 65,
    dailyRefresh: false,
    physics: {
      weight: 0.88,
      swingMultiplier: 1.10,
      dampingMultiplier: 0.995
    },
    sound: null,
    description: "Lush emerald 4-leaf botanical charm symbolizing extraordinary luck."
  },
  {
    id: "lucky-bell",
    name: "Fortune Bell",
    category: "Lucky",
    image: "assets/charms/lucky/lucky-bell.png",
    scale: 1,
    maxWidth: 95,
    maxHeight: 180,
    ropeOffsetX: 0,
    ropeOffsetY: 0,
    ropeLength: 75,
    dailyRefresh: false,
    physics: {
      weight: 1.18,
      swingMultiplier: 0.92,
      dampingMultiplier: 1.004
    },
    sound: {
      type: "bell",
      src: "assets/sounds/universfield-single-church-bell-2-352062.mp3",
      volume: 0.40,
      cooldown: 3800
    },
    description: "Polished brass temple bell with silk crimson cord."
  },
  {
    id: "daruma",
    name: "Daruma",
    category: "Lucky",
    image: "assets/charms/lucky/lucky-daruma.png",
    scale: 1,
    maxWidth: 105,
    maxHeight: 200,
    ropeOffsetX: 0,
    ropeOffsetY: 0,
    ropeLength: 75,
    dailyRefresh: false,
    physics: {
      weight: 1.22,
      swingMultiplier: 0.90,
      dampingMultiplier: 1.005
    },
    sound: null,
    description: "Traditional Japanese red Daruma tumbler doll inscribed with '福' (fortune), bringing perseverance and goal fulfillment."
  },
  {
    id: "lucky-clover",
    name: "Lucky Clover",
    category: "Lucky",
    image: "assets/charms/lucky/lucky-clover.png",
    scale: 1,
    maxWidth: 100,
    maxHeight: 180,
    ropeOffsetX: 0,
    ropeOffsetY: 0,
    ropeLength: 65,
    dailyRefresh: false,
    physics: {
      weight: 0.85,
      swingMultiplier: 1.12,
      dampingMultiplier: 0.995
    },
    sound: null,
    description: "Radiant four-leaf clover talisman with polished golden trim."
  },
  {
    id: "dreamcatcher",
    name: "Dreamcatcher",
    category: "Lucky",
    image: "assets/charms/lucky/dreamcatcher.png",
    scale: 1,
    maxWidth: 105,
    maxHeight: 220,
    ropeOffsetX: 0,
    ropeOffsetY: 0,
    ropeLength: 60,
    dailyRefresh: false,
    physics: {
      weight: 0.80,
      swingMultiplier: 1.15,
      dampingMultiplier: 0.994
    },
    sound: null,
    description: "Sacred woven hoop with sapphire bead center and soft hanging feathers."
  },
  {
    id: "lucky-horseshoe",
    name: "Lucky Horseshoe",
    category: "Lucky",
    image: "assets/charms/lucky/lucky-horseshoe.png",
    scale: 1,
    maxWidth: 100,
    maxHeight: 180,
    ropeOffsetX: 0,
    ropeOffsetY: 0,
    ropeLength: 65,
    dailyRefresh: false,
    physics: {
      weight: 1.25,
      swingMultiplier: 0.88,
      dampingMultiplier: 1.005
    },
    sound: null,
    description: "Solid forged golden horseshoe talisman crafted to catch good fortune."
  },
  {
    id: "red-lucky-knot",
    name: "Red Lucky Knot",
    category: "Lucky",
    image: "assets/charms/lucky/red-lucky-knot.png",
    scale: 1,
    maxWidth: 95,
    maxHeight: 220,
    ropeOffsetX: 0,
    ropeOffsetY: 0,
    ropeLength: 60,
    dailyRefresh: false,
    physics: {
      weight: 0.90,
      swingMultiplier: 1.08,
      dampingMultiplier: 0.997
    },
    sound: null,
    description: "Intricate crimson mystic knot with gold bead and silk tassel threads."
  },
  {
    id: "yin-yang",
    name: "Yin Yang",
    category: "Lucky",
    image: "assets/charms/lucky/yin-yang.png",
    scale: 1,
    maxWidth: 100,
    maxHeight: 180,
    ropeOffsetX: 0,
    ropeOffsetY: 0,
    ropeLength: 65,
    dailyRefresh: false,
    physics: {
      weight: 1.05,
      swingMultiplier: 1.0,
      dampingMultiplier: 1.0
    },
    sound: null,
    description: "Harmonious duality emblem encased in a circular golden bezel."
  },
  {
    id: "lucky-lotus",
    name: "Lucky Lotus",
    category: "Lucky",
    image: "assets/charms/lucky/lucky-lotus.png",
    scale: 1,
    maxWidth: 105,
    maxHeight: 190,
    ropeOffsetX: 0,
    ropeOffsetY: 0,
    ropeLength: 65,
    dailyRefresh: false,
    physics: {
      weight: 0.90,
      swingMultiplier: 1.08,
      dampingMultiplier: 0.997
    },
    sound: null,
    description: "Sacred crystal lotus talisman with blooming petals bringing purity and serenity."
  },
  {
    id: "vijay",
    name: "Vijay",
    category: "Lucky",
    image: "assets/charms/lucky/vijay.png",
    scale: 1,
    maxWidth: 160,
    maxHeight: 270,
    ropeOffsetX: 0,
    ropeOffsetY: 0,
    ropeLength: 65,
    dailyRefresh: false,
    physics: {
      weight: 1.0,
      swingMultiplier: 1.0,
      dampingMultiplier: 1.0
    },
    sound: null,
    description: "Iconic Thalapathy Vijay portrait charm bringing charismatic screen presence and mass energy."
  },
  {
    id: "ajith",
    name: "Ajith",
    category: "Lucky",
    image: "assets/charms/lucky/ajith.png",
    scale: 1,
    maxWidth: 160,
    maxHeight: 270,
    ropeOffsetX: 0,
    ropeOffsetY: 0,
    ropeLength: 65,
    dailyRefresh: false,
    physics: {
      weight: 1.0,
      swingMultiplier: 1.0,
      dampingMultiplier: 1.0
    },
    sound: null,
    description: "Legendary Thala Ajith Kumar portrait charm bringing fearless style and powerful vibe."
  }
];

export function getCharmById(id) {
  return charms.find((c) => c.id === id) || charms[0];
}

export function getAllCharms() {
  return charms;
}

export function getCharmsByCategory(category) {
  if (!category || category === "All") return charms;
  return charms.filter((c) => c.category.toLowerCase() === category.toLowerCase());
}
