import React from "react";
import { useShop } from "../context/ShopContext";
import { ArrowLeft, Info, MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

const WHATSAPP_NUMBER = "923019653550";

export const CartView: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartCount,
    formatPrice,
    removeFromCart,
    updateCartQuantity,
    navigateTo,
  } = useShop();

  const hasUnpricedItems = cart.some((item) => item.product.pricePKR <= 0);
  const whatsappMessage = [
    "Hello NOVALESTIC JEWELLERS, I would like to enquire about these items:",
    "",
    ...cart.map((item, index) =>
      [
        `${index + 1}. ${item.product.title}`,
        `   Option: ${item.selectedMetal}`,
        ...(item.ringSize ? [`   Ring size: ${item.ringSize}`] : []),
        `   Quantity: ${item.quantity}`,
        `   Listed price each: ${formatPrice(item.product.pricePKR)}`,
      ].join("\\n"),
    ),
    "",
    hasUnpricedItems
      ? "One or more items are enquiry-priced. Please confirm each item's current price."
      : `Listed merchandise subtotal: ${formatPrice(cartTotal)}`,
    "Please confirm availability, final pricing, delivery charges and timing, and payment options. This is an enquiry, not a confirmed order.",
  ].join("\\n");
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="w-full bg-background min-h-screen pt-32 pb-24">
      <div className="shell max-w-6xl">
        <nav
          aria-label="Breadcrumb"
          className="mb-10 flex items-center gap-2 text-xs text-muted-foreground"
        >
          <button
            type="button"
            onClick={() => navigateTo("home")}
            className="hover:text-foreground flex items-center gap-1 transition-colors rounded-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Home</span>
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-foreground font-medium" aria-current="page">
            Shopping Cart
          </span>
        </nav>

        <header className="mb-10">
          <p className="eyebrow mb-3">Your Selection</p>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl text-foreground tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-sm text-muted-foreground mt-3">
            {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
          </p>
        </header>

        {cart.length === 0 ? (
          <section className="rounded-[1.5rem] bg-card shadow-soft px-6 py-16 sm:py-20 text-center max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6 text-muted-foreground">
              <ShoppingBag className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-serif-luxury text-3xl text-foreground mb-3">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
              Browse the collection and contact us to enquire about a piece.
            </p>
            <button
              type="button"
              onClick={() => navigateTo("shop")}
              className="rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Browse Jewellery
            </button>
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <section className="lg:col-span-8" aria-label="Cart items">
              <div className="divide-y divide-border border-y border-border">
                {cart.map((item) => (
                  <article
                    key={item.product.id + "-" + item.selectedMetal + "-" + (item.ringSize || "")}
                    className="py-6 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-4 sm:gap-6 items-center"
                  >
                    <div className="flex gap-5 min-w-0">
                      {item.product.image ? (
                        <img
                          alt={item.product.title}
                          src={item.product.image}
                          loading="lazy"
                          className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl object-cover bg-secondary shrink-0"
                        />
                      ) : (
                        <span
                          className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl bg-secondary shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => navigateTo("product-detail", item.product.id)}
                          className="text-left font-serif-luxury text-lg sm:text-xl text-foreground hover:text-champagne transition-colors rounded-sm"
                        >
                          {item.product.title}
                        </button>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.selectedMetal}
                          {item.ringSize ? " · " + item.ringSize : ""}
                        </p>
                        <p className="text-sm text-foreground mt-2">
                          {formatPrice(item.product.pricePKR)}{" "}
                          <span className="text-muted-foreground">each</span>
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.product.id, item.selectedMetal, item.ringSize)
                          }
                          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive mt-3 transition-colors rounded-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                      <div className="flex items-center rounded-full border border-border bg-card">
                        <button
                          type="button"
                          aria-label={"Decrease quantity of " + item.product.title}
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.selectedMetal,
                              -1,
                              item.ringSize,
                            )
                          }
                          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <span
                          aria-live="polite"
                          className="min-w-8 text-center text-sm font-medium tabular-nums"
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={"Increase quantity of " + item.product.title}
                          disabled={item.quantity >= 99}
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.selectedMetal,
                              1,
                              item.ringSize,
                            )
                          }
                          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-foreground tabular-nums">
                        {formatPrice(item.product.pricePKR * item.quantity)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigateTo("shop")}
                className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-sm"
              >
                ← Continue shopping
              </button>
            </section>

            <aside
              className="lg:col-span-4 lg:sticky lg:top-32 rounded-[1.5rem] bg-card shadow-soft p-6 sm:p-8 space-y-5"
              aria-label="Order summary"
            >
              <h2 className="font-serif-luxury text-2xl text-foreground">Order Summary</h2>
              <div className="flex justify-between gap-4 text-sm text-muted-foreground">
                <span>{hasUnpricedItems ? "Merchandise pricing" : `Subtotal (${cartCount} ${cartCount === 1 ? "item" : "items"})`}</span>
                <span className="text-foreground tabular-nums">
                  {hasUnpricedItems ? "To be confirmed" : formatPrice(cartTotal)}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-sm text-muted-foreground">
                <span>Delivery</span>
                <span className="text-champagne">To be confirmed</span>
              </div>
              <div className="flex justify-between gap-4 pt-5 border-t border-border text-lg font-serif-luxury text-foreground">
                <span>Total after confirmation</span>
                <span className="tabular-nums">To be confirmed</span>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-describedby="checkout-note"
                className="w-full rounded-full bg-emerald hover:bg-emerald-hover text-emerald-foreground py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                Send enquiry on WhatsApp
              </a>
              <p
                id="checkout-note"
                className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
              >
                <Info className="w-4 h-4 shrink-0 text-champagne mt-0.5" aria-hidden="true" />
                <span>
                  This sends your selection to our team for confirmation. It does not place an order
                  or take payment. Final prices, delivery arrangements and payment options are
                  confirmed before an order is accepted.
                </span>
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};
