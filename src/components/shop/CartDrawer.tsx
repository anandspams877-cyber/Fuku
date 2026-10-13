import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatPrice, useStore } from "@/lib/store";

export function CartDrawer() {
  const { cart, products, cartOpen, setCartOpen, setQty, removeFromCart, clearCart, updateProduct } = useStore();
  const lines = cart
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.id) }))
    .filter((l) => l.product);
  const total = lines.reduce((s, l) => s + l.qty * l.product!.price, 0);

  const checkout = () => {
    lines.forEach((l) => updateProduct(l.id, { stock: Math.max(0, l.product!.stock - l.qty) }));
    clearCart();
    setCartOpen(false);
    toast.success("Order placed — thank you for shopping FUKU");
  };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-xl font-black tracking-tight">YOUR CART</SheetTitle>
        </SheetHeader>
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button variant="outline" className="rounded-none eyebrow" onClick={() => setCartOpen(false)} asChild>
              <a href="#shop">Continue shopping</a>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto px-4">
              {lines.map(({ id, qty, product }) => (
                <li key={id} className="flex gap-4 py-4">
                  <img src={product!.image} alt={product!.name} className="h-24 w-20 bg-surface object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-semibold">{product!.name}</p>
                      <button onClick={() => removeFromCart(id)} aria-label="Remove"><X className="h-4 w-4" /></button>
                    </div>
                    <p className="eyebrow mt-1 text-muted-foreground">{product!.category}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border">
                        <button className="p-2" onClick={() => setQty(id, qty - 1)} aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-sm">{qty}</span>
                        <button className="p-2 disabled:opacity-30" disabled={qty >= product!.stock} onClick={() => setQty(id, qty + 1)} aria-label="Increase"><Plus className="h-3 w-3" /></button>
                      </div>
                      <p className="text-sm font-semibold">{formatPrice(qty * product!.price)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t p-4">
              <div className="mb-4 flex justify-between font-semibold">
                <span className="eyebrow">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Button onClick={checkout} className="h-12 w-full rounded-none eyebrow">Checkout</Button>
              <button onClick={clearCart} className="eyebrow mt-3 w-full py-2 text-muted-foreground hover:text-foreground">Clear cart</button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
