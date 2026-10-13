import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/lib/store";

const links = [
  { href: "#home", label: "Home" },
  { href: "#shop", label: "Shop" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  const { cart, setCartOpen } = useStore();
  const [open, setOpen] = useState(false);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b bg-background/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <a href="#home" className="font-display text-2xl font-black tracking-tighter">FUKU</a>
        <ul className="hidden gap-10 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="eyebrow text-muted-foreground transition-colors hover:text-foreground">{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button onClick={() => setCartOpen(true)} className="eyebrow flex items-center gap-2 px-2 py-2" aria-label="Open cart">
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">{count}</span>
          </button>
          <button className="p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <ul className="border-t bg-background px-5 py-4 md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="eyebrow block py-3">{l.label}</a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
