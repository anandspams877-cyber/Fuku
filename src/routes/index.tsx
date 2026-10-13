import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Navbar } from "@/components/shop/Navbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { Button } from "@/components/ui/button";
import { CATEGORIES, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FUKU — Find Your Everyday Fit" },
      { name: "description", content: "FUKU is a minimal streetwear label: heavyweight tees, hoodies, oversized shirts and trousers." },
      { property: "og:title", content: "FUKU — Find Your Everyday Fit" },
      { property: "og:description", content: "Minimal premium streetwear essentials by FUKU." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { products } = useStore();
  const [cat, setCat] = useState<string>("All");
  const shown = cat === "All" ? products : products.filter((p) => p.category === cat);

  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />

      <section id="home" className="relative flex min-h-[92vh] items-end overflow-hidden bg-surface pt-16">
        <img src={hero} alt="FUKU model wearing a black hoodie and grey trousers" width={1600} height={1008}
          className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 md:px-8 md:pb-20">
          <p className="eyebrow mb-4">Collection 01 — Essentials</p>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.9] tracking-tighter sm:text-7xl md:text-8xl">
            FIND YOUR<br />EVERYDAY FIT
          </h1>
          <Button asChild size="lg" className="mt-8 h-14 rounded-none px-10 eyebrow">
            <a href="#shop">Shop now <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </div>
      </section>

      <div className="overflow-hidden border-y bg-ink py-3 text-ink-foreground">
        <div className="marquee flex w-max gap-12 whitespace-nowrap">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Free shipping over ₹2,999", "Heavyweight cotton", "Made to last", "Easy 14-day returns"].map((t) => (
              <span key={k + t} className="eyebrow">{t} ✦</span>
            )),
          )}
        </div>
      </div>

      <section id="shop" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-20 md:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-muted-foreground">Shop</p>
            <h2 className="mt-2 text-4xl font-black tracking-tighter md:text-5xl">THE ESSENTIALS</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", ...CATEGORIES].map((c) => (
              <Button key={c} onClick={() => setCat(c)} variant={cat === c ? "default" : "outline"} size="sm" className="rounded-none eyebrow">
                {c}
              </Button>
            ))}
          </div>
        </div>
        {shown.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">No products in this category yet.</p>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
            {shown.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      <section id="about" className="scroll-mt-16 bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-2 md:px-8">
          <div>
            <p className="eyebrow opacity-60">About</p>
            <h2 className="mt-2 text-4xl font-black tracking-tighter md:text-6xl">LESS NOISE.<br />BETTER BASICS.</h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed opacity-80">
            <p>FUKU — Japanese for "clothing" — was born from a simple idea: the pieces you reach for every day deserve the most care.</p>
            <p>We cut heavyweight cottons into relaxed, considered silhouettes in a tight palette of black, white and grey. No logos shouting. Just fit, fabric and finish.</p>
            <div className="grid grid-cols-3 gap-6 border-t border-ink-foreground/20 pt-6">
              {[["280", "GSM cotton"], ["8", "Core pieces"], ["14", "Day returns"]].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-3xl font-black">{n}</p>
                  <p className="eyebrow mt-1 opacity-60">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="font-display text-3xl font-black tracking-tighter">FUKU</p>
            <p className="mt-2 text-sm text-muted-foreground">Everyday fits. Made to last.</p>
          </div>
          <div className="flex flex-wrap gap-8">
            <a href="#shop" className="eyebrow text-muted-foreground hover:text-foreground">Shop</a>
            <a href="#about" className="eyebrow text-muted-foreground hover:text-foreground">About</a>
            <a href="mailto:hello@fuku.store" className="eyebrow text-muted-foreground hover:text-foreground">Contact</a>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} FUKU</span>
            <Link to="/admin" className="hover:text-foreground">Staff</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
