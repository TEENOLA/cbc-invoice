import { useState, useEffect } from "react";
import { CAKE_FLAVORS, CAKE_SIZES, CAKE_COVERINGS } from "../data/mockData.js";
import { calcCakePrice } from "../utils/cakePricing.js";
import { naira } from "../utils/format.js";

export default function CakeConfigurator({ initial, onSave, onCancel }) {
  const [layers, setLayers] = useState(initial?.layers || 1);
  const [flavors, setFlavors] = useState(initial?.flavors || [CAKE_FLAVORS[0]]);
  const [size, setSize] = useState(initial?.size || CAKE_SIZES[0]);
  const [covering, setCovering] = useState(
    initial?.covering || CAKE_COVERINGS[0].name
  );

  useEffect(() => {
    setFlavors((prev) => {
      const next = [...prev];
      while (next.length < layers) next.push(CAKE_FLAVORS[0]);
      return next.slice(0, layers);
    });
  }, [layers]);

  const setLayerFlavor = (index, value) => {
    setFlavors((prev) => prev.map((f, i) => (i === index ? value : f)));
  };

  const useOneOfEach = () => setFlavors(CAKE_FLAVORS.slice(0, layers));

  const price = calcCakePrice({ layers, size, covering });
  const groupBtn = (active) =>
    `px-3 py-1.5 rounded-full text-xs font-medium border ${
      active ? "cbc-btn-primary" : "cbc-btn-outline"
    }`;

  return (
    <div className="space-y-4">
      <div>
        <p
          className="text-[11px] font-semibold uppercase tracking-wide mb-1.5"
          style={{ color: "var(--choc-soft)" }}
        >
          Layers
        </p>
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => setLayers(n)}
              className={groupBtn(layers === n)}
            >
              {n} layer{n > 1 ? "s" : ""}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide"
            style={{ color: "var(--choc-soft)" }}
          >
            Flavor{layers > 1 ? "s" : ""}
          </p>
          {layers > 1 && (
            <button
              onClick={useOneOfEach}
              className="text-xs font-medium"
              style={{ color: "var(--caramel)" }}
            >
              Use one of each
            </button>
          )}
        </div>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${layers}, minmax(0, 1fr))` }}
        >
          {flavors.map((f, i) => (
            <select
              key={i}
              className="cbc-input rounded-xl px-3 py-2 text-sm"
              value={f}
              onChange={(e) => setLayerFlavor(i, e.target.value)}
            >
              {CAKE_FLAVORS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          ))}
        </div>
      </div>

      <div>
        <p
          className="text-[11px] font-semibold uppercase tracking-wide mb-1.5"
          style={{ color: "var(--choc-soft)" }}
        >
          Size
        </p>
        <div className="flex gap-2 flex-wrap">
          {CAKE_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={groupBtn(size === s)}
            >
              {s}&quot;
            </button>
          ))}
        </div>
      </div>

      <div>
        <p
          className="text-[11px] font-semibold uppercase tracking-wide mb-1.5"
          style={{ color: "var(--choc-soft)" }}
        >
          Covering
        </p>
        <div className="flex gap-2 flex-wrap">
          {CAKE_COVERINGS.map((c) => (
            <button
              key={c.name}
              onClick={() => setCovering(c.name)}
              className={groupBtn(covering === c.name)}
            >
              {c.name}
              {c.addon > 0 ? ` (+${naira(c.addon)})` : ""}
            </button>
          ))}
        </div>
      </div>

      <div
        className="flex items-center justify-between pt-2 border-t"
        style={{ borderColor: "var(--line)" }}
      >
        <p className="text-sm font-semibold">
          Cake price: <span className="cbc-mono">{naira(price)}</span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="cbc-btn-outline px-4 py-2 rounded-full text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ layers, flavors, size, covering })}
            className="cbc-btn-primary px-4 py-2 rounded-full text-xs font-medium"
          >
            Save cake
          </button>
        </div>
      </div>
    </div>
  );
}
