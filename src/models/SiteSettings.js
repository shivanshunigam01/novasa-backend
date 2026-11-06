import mongoose from "mongoose";

const defaultSettings = {
  brandName: "Novasa",
  subBrand: "Gen Z fits for her & him",
  tagline: "Dress loud. Move different.",
  announcementBar: "✦ NEW DROP — UP TO 30% OFF SELECT STYLES ✦ FREE SHIPPING OVER ₹1999 ✦",
  contact: {
    email: "",
    phone: "",
    whatsapp: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
  },
  social: {
    instagramHandle: "@novasa.studio",
    instagramUrl: "https://www.instagram.com/",
  },
  returnRefundPolicy: "All sales are final. No returns, refunds, or exchanges.",
  storyCopy: {
    headline: "Street to scroll — fits that hit",
    body: `Novasa is a Gen Z clothing label for women and men — bold silhouettes, honest prices, and drops that feel like your feed come to life. Update banners, hero videos, and product photos anytime from admin.`,
    highlight: "Main character energy, daily.",
  },
  offerBannerImage: "",
  offerBannerImageMobile: "",
  heroVideoDesktop: "",
  heroVideoMobile: "",
};

const siteSettingsSchema = new mongoose.Schema(
  {
    brandName: String,
    subBrand: String,
    tagline: String,
    announcementBar: String,
    contact: {
      email: String,
      phone: String,
      whatsapp: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pinCode: String,
      country: String,
    },
    social: {
      instagramHandle: String,
      instagramUrl: String,
    },
    returnRefundPolicy: String,
    storyCopy: {
      headline: String,
      body: String,
      highlight: String,
    },
    /** Cloudinary URL for homepage offer strip (below hero). */
    offerBannerImage: { type: String, default: "" },
    offerBannerImageMobile: { type: String, default: "" },
    /** Cloudinary MP4 URLs for homepage hero background video. */
    heroVideoDesktop: { type: String, default: "" },
    heroVideoMobile: { type: String, default: "" },
  },
  { timestamps: true },
);

export const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model("SiteSettings", siteSettingsSchema);

export async function getOrCreateSiteSettings() {
  let doc = await SiteSettings.findOne();
  if (!doc) {
    doc = await SiteSettings.create(defaultSettings);
  }
  return doc;
}
