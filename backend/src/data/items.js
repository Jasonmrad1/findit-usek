// Everyday item-in-context photos. Sources are recorded in ASSET_CREDITS.md.
const photoUrl = (source) =>
  typeof source === "string"
    ? source
    : `https://images.pexels.com/photos/${source}/pexels-photo-${source}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

const records = [
  {
    title: "Black wired earphones",
    description:
      "Found these black wired earphones left on a wooden study table. The cable was tangled beside a chair. Please describe them if they are yours.",
    category: "Electronics",
    type: "Found",
    location: "Library study table",
    date: "2026-10-15",
    returned: false,
    photoId: 15575695,
    placeId: 17154532,
  },
  {
    title: "Backpack left on a bench",
    description:
      "I left my brown and gray backpack on a bench between classes. There are lecture notes inside. Please get in touch if you picked it up.",
    category: "Bags",
    type: "Lost",
    location: "Campus courtyard",
    date: "2026-10-15",
    returned: false,
    photoId: 8249067,
    placeId: "/images/usek-sunlit.png",
  },
  {
    title: "Keys beside a black bag",
    description:
      "Found a set of keys on a wooden bench beside a black bag and some notes. Please describe the keyring privately so I can return them to the right person.",
    category: "Keys",
    type: "Found",
    location: "Courtyard benches",
    date: "2026-10-14",
    returned: false,
    photoId: 15817543,
    placeId: "/images/usek-sunlit.png",
  },
  {
    title: "Charger from a study desk",
    description:
      "I think I left my charger at the desk after studying. This photo shows it with my usual study things. Please message me if you have seen it.",
    category: "Electronics",
    type: "Lost",
    location: "Library study area",
    date: "2026-10-14",
    returned: false,
    photoId: 10567179,
    placeId: 17154532,
  },
  {
    title: "Open lecture notebook",
    description:
      "There was an open notebook left with papers on a classroom desk after the lecture. Please describe the notes or the cover if it belongs to you.",
    category: "Books",
    type: "Found",
    location: "Classroom B204",
    date: "2026-10-13",
    returned: false,
    photoId: 5905437,
    placeId: 37846333,
  },
  {
    title: "Campus hoodie",
    description:
      "My hoodie was left behind after lunch. Someone helped me get it back. Thank you for taking the time to reach out!",
    category: "Clothing & Accessories",
    type: "Lost",
    location: "Cafeteria",
    date: "2026-10-12",
    returned: true,
    photoId: 17967390,
    placeId: 34316837,
  },
  {
    title: "Wallet left on a table",
    description:
      "Found a wallet with a set of keys on a wooden table near the seating area. Please describe what is inside privately before we arrange a handover.",
    category: "Other",
    type: "Found",
    location: "Cafeteria seating area",
    date: "2026-10-12",
    returned: false,
    photoId: 13370914,
    placeId: 34316837,
  },
  {
    title: "Calculator and study notes",
    description:
      "I left my calculator with an open notebook after studying. I only noticed when I got to my next class. Please let me know if you have seen it.",
    category: "Electronics",
    type: "Lost",
    location: "Library study area",
    date: "2026-10-11",
    returned: false,
    photoId: 8250947,
    placeId: 17154532,
  },
  {
    title: "Patterned water bottle",
    description:
      "This patterned bottle was left on a desk after class. It has now been returned to its owner. Thanks for helping us reconnect!",
    category: "Other",
    type: "Found",
    location: "Classroom B204",
    date: "2026-10-10",
    returned: true,
    photoId: 9544546,
    placeId: 37846333,
  },
  {
    title: "Folder with course papers",
    description:
      "I left my folder with a few printed course papers on the wooden table. Please get in touch if you found it after the afternoon study session.",
    category: "IDs & Documents",
    type: "Lost",
    location: "Library study area",
    date: "2026-10-09",
    returned: false,
    photoId: 6325886,
    placeId: 17154532,
  },
  {
    title: "Sunglasses on a wooden seat",
    description:
      "Found these sunglasses on a wooden surface near the outdoor seating. Please describe the frame and lenses when you reach out.",
    category: "Clothing & Accessories",
    type: "Found",
    location: "Courtyard benches",
    date: "2026-10-08",
    returned: false,
    photoId: 13047943,
    placeId: "/images/usek-sunlit.png",
  },
  {
    title: "Black over-ear headphones",
    description:
      "Looking for my black headphones. This is a photo of them on my desk before I brought them to campus. I may have left them in the classroom.",
    category: "Electronics",
    type: "Lost",
    location: "Classroom B204",
    date: "2026-10-07",
    returned: false,
    photoId: 8198068,
    placeId: 37846333,
  },
  {
    title: "Pencil case from a study table",
    description:
      "Found a pencil case left where someone had been working on their notes. Please describe the case and a few things inside so I can return it.",
    category: "Other",
    type: "Found",
    location: "Library study area",
    date: "2026-10-06",
    returned: false,
    photoId: 5553627,
    placeId: 17154532,
  },
  {
    title: "Book left on a bench",
    description:
      "I left my book and pen on a bench while taking a break between classes. There are notes tucked inside. Please let me know if you picked them up.",
    category: "Books",
    type: "Lost",
    location: "Courtyard benches",
    date: "2026-10-05",
    returned: false,
    photoId: 18329403,
    placeId: "/images/usek-sunlit.png",
  },
];

export function createSeedItems() {
  return records.map(({ photoId, placeId, ...item }, index) => ({
    id: index + 1,
    ...item,
    contactEmail: `student${index + 1}@example.com`,
    imageUrl: photoUrl(photoId),
    locationImageUrl: photoUrl(placeId),
  }));
}
