export interface ProductSize {
  label: string;
  priceId: string;
  displayPrice: string;
  images?: string[]; // Per-size image overrides (falls back to product.images)
}

export interface Product {
  slug: string;
  title: string;
  tagline?: string;
  description: string;
  features: string[];
  sizes: ProductSize[];
  images: string[]; // Default/shared images
}

export const products: Product[] = [
  {
    slug: "thorfinn-mat",
    title: "Minimal Anime Thorfinn Desk Mat",
    tagline: "Clean. Calm. Focused.",
    description:
      "A premium extended mouse pad inspired by a minimalist warrior aesthetic. Designed for clean, focused desk setups, it features a smooth micro-weave surface for precise tracking and a non-slip rubber base for stability. The artwork captures a calm yet powerful moment, bringing a subtle anime-inspired atmosphere to your workspace.",
    features: [
      "Smooth Micro-Weave Surface",
      "Anti-Slip Rubber Base",
      "Stitched Edge Finish",
      "Water-Resistant Coating",
      "Minimal Warrior Print",
      "Multiple Size Options",
    ],
    sizes: [
      {
        label: '12" × 18"',
        priceId: "price_1TGYBYAbBgE9tbEaOjUPusgN",
        displayPrice: "$24.99",
        images: [
          "https://images.printify.com/mockup/69c847c327ac868284004850/65240/6570/desk-mat.jpg",
          "https://images.printify.com/mockup/69c847c327ac868284004850/65240/6576/desk-mat.jpg",
          "https://images.printify.com/mockup/69c847c327ac868284004850/65240/6574/desk-mat.jpg",
          "https://images.printify.com/mockup/69c847c327ac868284004850/65240/6572/desk-mat.jpg",
        ],
      },
      {
        label: '12" × 22"',
        priceId: "price_1TGYD0AbBgE9tbEaSzsqvO8W",
        displayPrice: "$29.99",
        images: [
          "https://images.printify.com/mockup/69c847c327ac868284004850/65241/6569/desk-mat.jpg",
          "https://images.printify.com/mockup/69c847c327ac868284004850/65241/6575/desk-mat.jpg",
          "https://images.printify.com/mockup/69c847c327ac868284004850/65241/6573/desk-mat.jpg",
          "https://images.printify.com/mockup/69c847c327ac868284004850/65241/6571/desk-mat.jpg",
        ],
      },
      {
        label: '16" × 32"',
        priceId: "price_1TGYEBAbBgE9tbEaL2yIVaXn",
        displayPrice: "$32.99",
        images: [
          "https://images.printify.com/mockup/69c847c327ac868284004850/72580/16170/desk-mat.jpg",
          "https://images.printify.com/mockup/69c847c327ac868284004850/72580/16173/desk-mat.jpg",
          "https://images.printify.com/mockup/69c847c327ac868284004850/72580/16172/desk-mat.jpg",
          "https://images.printify.com/mockup/69c847c327ac868284004850/72580/16171/desk-mat.jpg",
        ],
      },
    ],
    // Default images (12"×18" as the primary display)
    images: [
      "https://images.printify.com/mockup/69c847c327ac868284004850/65240/6570/desk-mat.jpg",
      "https://images.printify.com/mockup/69c847c327ac868284004850/65240/6576/desk-mat.jpg",
      "https://images.printify.com/mockup/69c847c327ac868284004850/65240/6574/desk-mat.jpg",
      "https://images.printify.com/mockup/69c847c327ac868284004850/65240/6572/desk-mat.jpg",
    ],
  },
  {
    slug: "thorfinn-farming",
    title: "Thorfinn Farming",
    description:
      "This panel captures Thorfinn at a defining moment in his life. He stands alone in a vast field of tall grass, holding a farming tool raised over his shoulder—not as a weapon, but as a tool of labor. His stance is steady and grounded, showing control rather than aggression. This is a sharp contrast to who he once was.",
    features: [
      "Smooth Micro-Weave Surface",
      "Anti-Slip Rubber Base",
      "Stitched Edge Finish",
      "Water-Resistant Coating",
      "Multiple Size Options",
    ],
    sizes: [
      {
        label: '12" × 18"',
        priceId: "price_1TH4KMAHj7RoGh5l7QI682oI",
        displayPrice: "$24.99",
        // No dedicated 12"×18" mockups — falls back to product.images
      },
      {
        label: '12" × 22"',
        priceId: "price_1TH4KZAHj7RoGh5lgcJC9B6Q",
        displayPrice: "$29.99",
        images: [
          "https://images.printify.com/mockup/69cbe7601683c4f1fb0499fe/65241/6569/scarecrow-in-storm-desk-mat-black-white-farm-field-illustration.jpg?camera_label=front&t=1774971816098&s=500",
          "https://images.printify.com/mockup/69cbe7601683c4f1fb0499fe/65241/6573/scarecrow-in-storm-desk-mat-black-white-farm-field-illustration.jpg?camera_label=context-1&t=1774971867947&s=500",
          "https://images.printify.com/mockup/69cbe7601683c4f1fb0499fe/65241/6575/scarecrow-in-storm-desk-mat-black-white-farm-field-illustration.jpg?camera_label=context-2&t=1774971848779&s=500",
        ],
      },
      {
        label: '16" × 32"',
        priceId: "price_1TH4LLAHj7RoGh5leu012n6f",
        displayPrice: "$32.99",
        images: [
          "https://images.printify.com/mockup/69cbe7601683c4f1fb0499fe/72580/16170/scarecrow-in-storm-desk-mat-black-white-farm-field-illustration.jpg?camera_label=front&t=1774971892278&s=500",
          "https://images.printify.com/mockup/69cbe7601683c4f1fb0499fe/72580/16172/scarecrow-in-storm-desk-mat-black-white-farm-field-illustration.jpg?camera_label=context-1&t=1774971913949&s=500",
          "https://images.printify.com/mockup/69cbe7601683c4f1fb0499fe/72580/16173/scarecrow-in-storm-desk-mat-black-white-farm-field-illustration.jpg?camera_label=context-2&t=1774971904896&s=500",
        ],
      },
    ],
    // Default images (12"×22" as the representative size)
    images: [
      "https://images.printify.com/mockup/69cbe7601683c4f1fb0499fe/65241/6569/scarecrow-in-storm-desk-mat-black-white-farm-field-illustration.jpg?camera_label=front&t=1774971816098&s=500",
      "https://images.printify.com/mockup/69cbe7601683c4f1fb0499fe/65241/6573/scarecrow-in-storm-desk-mat-black-white-farm-field-illustration.jpg?camera_label=context-1&t=1774971867947&s=500",
      "https://images.printify.com/mockup/69cbe7601683c4f1fb0499fe/65241/6575/scarecrow-in-storm-desk-mat-black-white-farm-field-illustration.jpg?camera_label=context-2&t=1774971848779&s=500",
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
