import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const beats = [
  {
    title: "Partner",
    copy: "The supplier agrees a distributor price with us.",
  },
  {
    title: "Sell",
    copy: "We take the solution to Indian businesses at retail price.",
  },
  {
    title: "Pay",
    copy: "The business pays Distaura for the solution.",
  },
  {
    title: "Deliver",
    copy: "We pay the supplier its share and keep the margin. The supplier fulfils.",
  },
];

function Rail() {
  return (
    <div className="rail" aria-hidden="true">
      <span className="lane top" />
      <span className="lane bot" />
      <span className="pkt sw" />
      <span className="pkt sw d2" />
      <span className="pkt pay" />
      <span className="pkt pay d2" />
    </div>
  );
}

export function ExchangeBoard() {
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setBeat((value) => (value + 1) % beats.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div>
      <div
        className="exchange"
        aria-label="How Distaura works: supplier of products and services to Distaura to Indian business"
      >
        <div className="node">
          <b>Product & service supplier</b>
          <span>Builds the product or provides the service</span>
        </div>
        <Rail />
        <div className="node core">
          <b>Distaura</b>
          <span>Sells and distributes across India</span>
        </div>
        <Rail />
        <div className="node">
          <b>Indian business</b>
          <span>Buys and uses the right solution</span>
        </div>
      </div>

      <p className="mt-5 max-w-2xl text-sm text-stone">
        Squares move solutions forward. Circles move rupees back. Clean, transparent
        distribution.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {beats.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className={cn("cap text-left", beat === index && "is-on")}
            onClick={() => setBeat(index)}
          >
            <b className="mb-1 block font-display text-xl font-medium">{item.title}</b>
            <p className="text-sm text-stone">{item.copy}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
