import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";

export const CATEGORIES = ["T-Shirts", "Hoodies", "Oversized Shirts", "Trousers"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Product = {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
};

export type CartItem = { id: string; qty: number };

export const LOW_STOCK = 5;

export const SEED: Product[] = [
  { id: "1", name: "Heavyweight Tee — White", price: 1499, category: "T-Shirts", image: p1, stock: 24 },
  { id: "2", name: "Boxy Tee — Black", price: 1599, category: "T-Shirts", image: p2, stock: 3 },
  { id: "3", name: "Fleece Hoodie — Heather", price: 3499, category: "Hoodies", image: p3, stock: 12 },
  { id: "4", name: "Zip Hoodie — Onyx", price: 3999, category: "Hoodies", image: p4, stock: 0 },
  { id: "5", name: "Oversized Shirt — Bone", price: 2799, category: "Oversized Shirts", image: p5, stock: 9 },
  { id: "6", name: "Washed Overshirt — Charcoal", price: 2999, category: "Oversized Shirts", image: p6, stock: 4 },
  { id: "7", name: "Pleated Wide Trouser — Black", price: 3299, category: "Trousers", image: p7, stock: 15 },
  { id: "8", name: "Relaxed Cargo — Stone", price: 3199, category: "Trousers", image: p8, stock: 7 },
];

export const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;

type Store = {
  products: Product[];
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;
  cart: CartItem[];
  addToCart: (id: string) => boolean;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
};

const Ctx = createContext<Store | null>(null);
const PK = "fuku-products-v1";
const CK = "fuku-cart-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const p = localStorage.getItem(PK);
      if (p) setProducts(JSON.parse(p));
      const c = localStorage.getItem(CK);
      if (c) setCart(JSON.parse(c));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(PK, JSON.stringify(products)); }, [products, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem(CK, JSON.stringify(cart)); }, [cart, loaded]);

  const value = useMemo<Store>(() => {
    const stockOf = (id: string) => products.find((p) => p.id === id)?.stock ?? 0;
    return {
      products,
      addProduct: (p) => setProducts((ps) => [...ps, { ...p, id: crypto.randomUUID() }]),
      updateProduct: (id, patch) => setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p))),
      deleteProduct: (id) => {
        setProducts((ps) => ps.filter((p) => p.id !== id));
        setCart((c) => c.filter((i) => i.id !== id));
      },
      resetProducts: () => setProducts(SEED),
      cart,
      addToCart: (id) => {
        const inCart = cart.find((i) => i.id === id)?.qty ?? 0;
        if (inCart >= stockOf(id)) return false;
        setCart((c) => (inCart ? c.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)) : [...c, { id, qty: 1 }]));
        return true;
      },
      setQty: (id, qty) =>
        setCart((c) =>
          qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, stockOf(id)) } : i)),
        ),
      removeFromCart: (id) => setCart((c) => c.filter((i) => i.id !== id)),
      clearCart: () => setCart([]),
      cartOpen,
      setCartOpen,
    };
  }, [products, cart, cartOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be inside StoreProvider");
  return s;
}
