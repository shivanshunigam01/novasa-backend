/** Site-wide Novasa drop sale — keep in sync with storefront `src/lib/promotions.ts`. */
export const NOVASA_DROP = {
  active: true,
  percentOff: 30,
  code: "NOVASA30",
  label: "Novasa New Drop",
};

/** @deprecated alias */
export const DIWALI_SALE = NOVASA_DROP;

export function catalogOriginalPrice(dbPrice) {
  return Number(dbPrice) || 0;
}

export function applyDiwaliUnitPrice(dbPrice) {
  const original = catalogOriginalPrice(dbPrice);
  if (!NOVASA_DROP.active) return original;
  return Math.round(original * (1 - NOVASA_DROP.percentOff / 100));
}

export function publicPriceFields(dbPrice, dbMrp) {
  const original = catalogOriginalPrice(dbPrice);
  const storedMrp = Number(dbMrp) || 0;

  if (!NOVASA_DROP.active) {
    return {
      price: original,
      mrp: storedMrp > original ? storedMrp : undefined,
    };
  }

  const offer = applyDiwaliUnitPrice(dbPrice);
  return {
    price: offer,
    mrp: original,
  };
}
