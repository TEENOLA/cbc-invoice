import {
  CAKE_PRICE_PER_LAYER,
  CAKE_SIZE_BASE,
  CAKE_PRICE_PER_INCH,
  CAKE_COVERINGS,
} from "../data/mockData.js";

export function calcCakePrice({ layers, size, covering }) {
  const coveringAddon =
    CAKE_COVERINGS.find((c) => c.name === covering)?.addon || 0;
  const sizeUpcharge = Math.max(0, size - CAKE_SIZE_BASE) * CAKE_PRICE_PER_INCH;
  return layers * CAKE_PRICE_PER_LAYER + coveringAddon + sizeUpcharge;
}

export function cakeSummaryName({ layers, flavors, size, covering }) {
  const flavorPart = flavors && flavors.length ? flavors.join(" / ") : "—";
  return `Custom Cake — ${layers} Layer${
    layers > 1 ? "s" : ""
  } (${flavorPart}), ${size}" ${covering}`;
}
