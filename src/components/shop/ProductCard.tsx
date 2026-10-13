import { toast } from "sonner";
import { formatPrice, useStore, type Product } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const out = product.stock <= 0;

  const add = () => {
    if (addToCart(product.id)) toast.success(`${product.name} added to cart`);
    else toast.error("No more stock available");
  };

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <img src={product.image} alt={product.name} loading="lazy" width={768} height={960}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        {out && <span className="eyebrow absolute left-3 top-3 bg-primary px-2 py-1 text-primary-foreground">Sold out</span>}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-muted-foreground">{product.category}</p>
          <h3 className="mt-1 font-sans text-sm font-semibold">{product.name}</h3>
        </div>
        <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
      </div>
      <Button onClick={add} disabled={out} variant={out ? "secondary" : "default"} className="mt-4 h-11 w-full rounded-none eyebrow">
        {out ? "Out of stock" : "Add to cart"}
      </Button>
    </article>
  );
}
