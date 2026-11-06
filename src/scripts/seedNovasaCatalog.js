import "dotenv/config";
import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { getOrCreateSiteSettings, SiteSettings } from "../models/SiteSettings.js";
import { resolveMongoUri } from "../config/db.js";
import { slugify } from "../utils/slugify.js";

const uri = resolveMongoUri();
if (!uri) {
  console.error("Configure MongoDB in novasa-backend/.env");
  process.exit(1);
}

const OFFER_BANNER =
  "https://images.unsplash.com/photo-1441986300917-6468ba532d36?auto=format&fit=crop&w=1600&q=80";

const catalog = [
  {
    sku: "NV-W-001",
    name: "Oversized Acid Wash Hoodie",
    category: "Women",
    price: 2499,
    mrp: 3299,
    badge: "NEW",
    featured: true,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-W-002",
    name: "Cargo Mini Skirt — Graphite",
    category: "Women",
    price: 1899,
    badge: "BESTSELLER",
    featured: true,
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-W-003",
    name: "Mesh Layer Long Sleeve",
    category: "Women",
    price: 1599,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-W-004",
    name: "Wide Leg Parachute Pants",
    category: "Women",
    price: 2199,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-M-001",
    name: "Boxy Graphic Tee — Night Shift",
    category: "Men",
    price: 1299,
    badge: "NEW",
    featured: true,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-M-002",
    name: "Relaxed Denim Jacket",
    category: "Men",
    price: 3499,
    mrp: 4299,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-M-003",
    name: "Utility Carpenter Pants",
    category: "Men",
    price: 2799,
    image: "https://images.unsplash.com/photo-1624378439575-d8705adcc412?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-H-001",
    name: "Zip Hoodie — Electric Violet",
    category: "Hoodies",
    price: 2999,
    badge: "NEW",
    featured: true,
    image: "https://images.unsplash.com/photo-1556828672-1b0f7a7f2f0?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-H-002",
    name: "Fleece Quarter Zip",
    category: "Hoodies",
    price: 2699,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-T-001",
    name: "Vintage Wash Baby Tee",
    category: "Tees",
    price: 999,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b5be74?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-T-002",
    name: "Oversized Band Tee",
    category: "Tees",
    price: 1199,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-P-001",
    name: "Baggy Sweatpants — Cement",
    category: "Pants & Shorts",
    price: 1999,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-P-002",
    name: "Pleated Shorts — Sage",
    category: "Pants & Shorts",
    price: 1499,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-S-001",
    name: "Y2K Track Jacket",
    category: "Streetwear",
    price: 3199,
    mrp: 3999,
    featured: true,
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-S-002",
    name: "Puffer Vest — Chrome",
    category: "Streetwear",
    price: 2899,
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-A-001",
    name: "Mini Crossbody — Lime",
    category: "Accessories",
    price: 1799,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-A-002",
    name: "Chunky Chain Necklace",
    category: "Accessories",
    price: 899,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-W-005",
    name: "Corset Top — Cherry",
    category: "Women",
    price: 1699,
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-M-004",
    name: "Knit Polo — Butter",
    category: "Men",
    price: 1899,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
  },
  {
    sku: "NV-H-003",
    name: "Cropped Zip Hoodie",
    category: "Hoodies",
    price: 2599,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1578587018452-892bace96636?auto=format&fit=crop&w=900&q=80",
  },
];

await mongoose.connect(uri);

let inserted = 0;
for (const row of catalog) {
  const slug = slugify(row.name);
  const payload = {
    slug,
    sku: row.sku,
    name: row.name,
    category: row.category,
    description: `${row.name} — Novasa drop. Unisex-friendly fit. Replace photos anytime from admin.`,
    price: row.price,
    mrp: row.mrp,
    badge: row.badge ?? null,
    rating: 4.7 + Math.random() * 0.3,
    reviews: Math.floor(Math.random() * 80) + 12,
    image: row.image,
    altImage: row.image,
    images: [row.image],
    inStock: true,
    featured: Boolean(row.featured),
    published: true,
  };
  await Product.findOneAndUpdate({ sku: row.sku }, payload, { upsert: true, new: true, setDefaultsOnInsert: true });
  inserted += 1;
}
console.log(`Novasa catalog upserted ${inserted} styles (sku NV-*).`);

const settings = await getOrCreateSiteSettings();
await SiteSettings.updateOne(
  { _id: settings._id },
  {
    $set: {
      brandName: "Novasa",
      subBrand: "Gen Z fits for her & him",
      tagline: "Dress loud. Move different.",
      announcementBar: "✦ NEW DROP — UP TO 30% OFF SELECT STYLES ✦ FREE SHIPPING OVER ₹1999 ✦",
      social: {
        instagramHandle: "@novasa.studio",
        instagramUrl: "https://www.instagram.com/",
      },
      storyCopy: {
        headline: "Street to scroll — fits that hit",
        body: "Novasa is a Gen Z clothing label for women and men who want bold silhouettes, honest prices, and drops that feel like your feed come to life. Swap banners, hero videos, and product shots anytime from admin.",
        highlight: "Main character energy, daily.",
      },
      offerBannerImage: OFFER_BANNER,
      offerBannerImageMobile: OFFER_BANNER,
    },
  },
);

console.log("Updated site settings for Novasa.");
await mongoose.disconnect();
