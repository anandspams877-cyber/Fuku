import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AlertTriangle, ArrowLeft, Boxes, PackageX, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CATEGORIES, LOW_STOCK, formatPrice, useStore, type Category, type Product } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "FUKU Admin — Inventory" },
      { name: "description", content: "FUKU inventory management panel." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "FUKU Admin — Inventory" },
      { property: "og:description", content: "FUKU inventory management panel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

// Demo-only gate. Not secure — replace with real sign-in + roles before launch.
const DEMO_PIN = "fuku2026";

function AdminPage() {
  const [ok, setOk] = useState(false);
  const [pin, setPin] = useState("");
  useEffect(() => { setOk(sessionStorage.getItem("fuku-admin") === "1"); }, []);

  if (!ok) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface px-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pin === DEMO_PIN) { sessionStorage.setItem("fuku-admin", "1"); setOk(true); }
            else toast.error("Incorrect PIN");
          }}
          className="w-full max-w-sm border bg-card p-8"
        >
          <p className="font-display text-3xl font-black tracking-tighter">FUKU</p>
          <p className="eyebrow mt-1 text-muted-foreground">Staff access</p>
          <Label htmlFor="pin" className="mt-6 block">Admin PIN</Label>
          <Input id="pin" type="password" value={pin} onChange={(e) => setPin(e.target.value)} className="mt-2 rounded-none" />
          <p className="mt-2 text-xs text-muted-foreground">Demo PIN: {DEMO_PIN}</p>
          <Button type="submit" className="mt-6 w-full rounded-none eyebrow">Enter</Button>
          <Link to="/" className="eyebrow mt-4 block text-center text-muted-foreground">Back to store</Link>
        </form>
      </div>
    );
  }
  return <Inventory onLogout={() => { sessionStorage.removeItem("fuku-admin"); setOk(false); }} />;
}

function Inventory({ onLogout }: { onLogout: () => void }) {
  const { products, updateProduct, deleteProduct, resetProducts } = useStore();
  const [editing, setEditing] = useState<Product | null | "new">(null);
  const low = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK);
  const out = products.filter((p) => p.stock <= 0);
  const units = products.reduce((s, p) => s + p.stock, 0);

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl font-black tracking-tighter">FUKU</span>
            <span className="eyebrow text-muted-foreground">Inventory</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="eyebrow"><Link to="/"><ArrowLeft className="h-4 w-4" />Store</Link></Button>
            <Button variant="outline" size="sm" className="eyebrow rounded-none" onClick={onLogout}>Log out</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 md:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat icon={<Boxes className="h-4 w-4" />} label="Total products" value={products.length} />
          <Stat icon={<Boxes className="h-4 w-4" />} label="Units in stock" value={units} />
          <Stat icon={<AlertTriangle className="h-4 w-4 text-warning" />} label={`Low stock (≤${LOW_STOCK})`} value={low.length} />
          <Stat icon={<PackageX className="h-4 w-4 text-destructive" />} label="Out of stock" value={out.length} />
        </div>

        {low.length + out.length > 0 && (
          <div className="border bg-background p-5">
            <p className="eyebrow mb-3">Needs attention</p>
            <ul className="flex flex-wrap gap-2">
              {[...out, ...low].map((p) => (
                <li key={p.id} className="border px-3 py-1 text-sm">{p.name} — <b>{p.stock}</b> left</li>
              ))}
            </ul>
          </div>
        )}

        <div className="border bg-background">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
            <h2 className="text-xl font-black tracking-tight">ALL PRODUCTS</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="eyebrow rounded-none" onClick={() => { if (confirm("Reset to sample data?")) resetProducts(); }}>Reset</Button>
              <Button size="sm" className="eyebrow rounded-none" onClick={() => setEditing("new")}><Plus className="h-4 w-4" />Add product</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="eyebrow text-left text-muted-foreground">
                <tr className="border-b">
                  <th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Price (₹)</th>
                  <th className="p-4">Stock</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="h-14 w-11 bg-surface object-cover" />
                        <span className="font-semibold">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{p.category}</td>
                    <td className="p-4">
                      <Input type="number" min={0} defaultValue={p.price} key={`pr${p.price}`} className="h-9 w-28 rounded-none"
                        onBlur={(e) => { const v = Number(e.target.value); if (v >= 0 && v !== p.price) { updateProduct(p.id, { price: v }); toast.success("Price updated"); } }} />
                    </td>
                    <td className="p-4">
                      <Input type="number" min={0} defaultValue={p.stock} key={`st${p.stock}`} className="h-9 w-20 rounded-none"
                        onBlur={(e) => { const v = Math.floor(Number(e.target.value)); if (v >= 0 && v !== p.stock) { updateProduct(p.id, { stock: v }); toast.success("Stock updated"); } }} />
                    </td>
                    <td className="p-4"><StockBadge stock={p.stock} /></td>
                    <td className="p-4">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => { if (confirm(`Delete ${p.name}?`)) { deleteProduct(p.id); toast.success("Product deleted"); } }}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">No products. Add one to get started.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {editing && <ProductDialog product={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="border bg-background p-5">
      <div className="eyebrow flex items-center gap-2 text-muted-foreground">{icon}{label}</div>
      <p className="mt-3 font-display text-4xl font-black">{value}</p>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="eyebrow bg-destructive/10 px-2 py-1 text-destructive">Out of stock</span>;
  if (stock <= LOW_STOCK) return <span className="eyebrow bg-warning/15 px-2 py-1 text-warning">In stock · Low</span>;
  return <span className="eyebrow bg-success/10 px-2 py-1 text-success">In stock</span>;
}

function ProductDialog({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { addProduct, updateProduct } = useStore();
  const [f, setF] = useState({
    name: product?.name ?? "",
    price: product?.price ?? 1999,
    stock: product?.stock ?? 10,
    category: (product?.category ?? "T-Shirts") as Category,
    image: product?.image ?? "",
  });

  const onFile = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setF((s) => ({ ...s, image: String(r.result) }));
    r.readAsDataURL(file);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !f.image) return toast.error("Name and image are required");
    if (product) updateProduct(product.id, f); else addProduct(f);
    toast.success(product ? "Product updated" : "Product added");
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-none">
        <DialogHeader><DialogTitle className="font-display font-black">{product ? "EDIT PRODUCT" : "ADD PRODUCT"}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div><Label>Name</Label><Input className="mt-1 rounded-none" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Price (₹)</Label><Input type="number" min={0} className="mt-1 rounded-none" value={f.price} onChange={(e) => setF({ ...f, price: Number(e.target.value) })} /></div>
            <div><Label>Stock</Label><Input type="number" min={0} className="mt-1 rounded-none" value={f.stock} onChange={(e) => setF({ ...f, stock: Math.max(0, Math.floor(Number(e.target.value))) })} /></div>
          </div>
          <div>
            <Label>Category</Label>
            <select className="mt-1 h-9 w-full border bg-background px-3 text-sm" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as Category })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label>Image (URL or upload)</Label>
            <Input className="mt-1 rounded-none" placeholder="https://…" value={f.image.startsWith("data:") ? "" : f.image} onChange={(e) => setF({ ...f, image: e.target.value })} />
            <Input type="file" accept="image/*" className="mt-2 rounded-none" onChange={(e) => onFile(e.target.files?.[0])} />
            {f.image && <img src={f.image} alt="" className="mt-2 h-24 w-20 bg-surface object-cover" />}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" className="rounded-none" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="rounded-none">{product ? "Save changes" : "Add product"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
