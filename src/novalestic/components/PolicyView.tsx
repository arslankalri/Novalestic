import React from "react";
import { ArrowLeft } from "lucide-react";
import { useShop } from "../context/ShopContext";

type PolicyKind = "privacy" | "shipping" | "returns" | "terms";

interface PolicySection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

interface PolicyContent {
  title: string;
  eyebrow: string;
  intro: string;
  sections: PolicySection[];
}

const policies: Record<PolicyKind, PolicyContent> = {
  privacy: {
    title: "Privacy Notice",
    eyebrow: "Your information",
    intro:
      "This notice describes the information used by the current Novalestic catalogue and enquiry website. It reflects the features currently implemented, not features that may be added later.",
    sections: [
      {
        title: "Information used by this website",
        paragraphs: [
          "The shopping bag is saved in your browser so your selection can remain available on that device. Your analytics preference is also saved in browser storage.",
          "Visitor analytics is optional. Page views are recorded only after you choose Allow analytics. The record contains a random tab-session identifier, a storefront page path, the referring website's hostname when available, a mobile/desktop screen-size category and a timestamp. Analytics records are configured for 90-day retention. The analytics table is not designed to store IP addresses, names, contact details or message contents.",
          "If you choose Decline, this website does not send page-view analytics for your visit. You can change this choice at any time using Privacy preferences in the footer.",
        ],
      },
      {
        title: "WhatsApp and email",
        paragraphs: [
          "When you select an enquiry link, the website opens WhatsApp or your email application. Information you send through those services is handled by the relevant service and the account you contact, under their own terms and privacy practices. The website does not turn a WhatsApp message into an online order.",
        ],
      },
      {
        title: "Accounts, payments and contact",
        paragraphs: [
          "The public storefront currently does not provide customer account registration or online card checkout. Please contact Novalestic through the contact options shown on this website for privacy questions or requests about information you have sent directly to the business.",
          "Before launch, the business should confirm its legal identity, responsible privacy contact, applicable retention periods for business records and any additional legal notices required for its markets.",
        ],
      },
    ],
  },
  shipping: {
    title: "Shipping & Delivery",
    eyebrow: "Delivery arrangements",
    intro:
      "Novalestic currently handles product enquiries directly. This website does not calculate shipping charges, promise a delivery date or collect payment for delivery at checkout.",
    sections: [
      {
        title: "Before an order is accepted",
        paragraphs: [
          "Our team must confirm that the item is available and can be delivered to your destination. Delivery availability, the shipping provider, charges, the estimated dispatch and delivery timing, and any tracking information will be confirmed with you before an order is accepted.",
          "Please do not assume that a delivery fee or estimated arrival date is final until it has been confirmed in writing by the team for your specific order.",
        ],
      },
      {
        title: "International delivery and additional charges",
        paragraphs: [
          "International destinations, customs duties, import taxes and other destination charges have not been standardized on this website. Ask the team to confirm whether delivery to your location is supported and which additional charges may apply before committing to an order.",
        ],
      },
    ],
  },
  returns: {
    title: "Returns & Exchanges",
    eyebrow: "Please confirm before ordering",
    intro:
      "A complete, fixed return, exchange and refund policy has not yet been supplied for publication on this website. We will not invent a return window or promise a refund process that has not been confirmed by the business.",
    sections: [
      {
        title: "Before you confirm an order",
        paragraphs: [
          "Please ask the team for the written return, exchange, resizing and refund terms that apply to your item before accepting the order or making a payment. This is especially important for resized, customized or made-to-order pieces.",
        ],
        bullets: [
          "Which items are eligible for return, exchange or resizing.",
          "Any time limits, item-condition requirements and documentation needed.",
          "How return shipping, inspection, refunds and exchanges are handled.",
        ],
      },
      {
        title: "Your applicable rights",
        paragraphs: [
          "Nothing on this page is intended to remove consumer rights that cannot lawfully be excluded. The business should publish a complete policy reviewed for the laws applicable to the markets in which it sells before accepting online orders.",
        ],
      },
    ],
  },
  terms: {
    title: "Website & Enquiry Terms",
    eyebrow: "How this store works",
    intro:
      "The public Novalestic website is currently a product catalogue and enquiry service, not a completed online checkout system.",
    sections: [
      {
        title: "Enquiries are not orders",
        paragraphs: [
          "Adding a piece to the shopping bag saves a selection in your browser. Sending an enquiry opens WhatsApp with a message for the team. Neither action creates a confirmed order or takes payment.",
          "An order should only be treated as accepted after the team confirms the specific item's availability, final price, materials and specifications, delivery arrangements and payment method, and communicates acceptance to you.",
        ],
      },
      {
        title: "Product details and pricing",
        paragraphs: [
          "A price shown on a product card is a listed PKR price and should still be confirmed with the team before an order is accepted. Items marked Price on enquiry do not have a confirmed public price. Product photos and descriptions are provided to help identify a piece; metal purity, gemstone origin, certification, availability and other specifications should be relied on only when confirmed for that item in writing.",
        ],
      },
      {
        title: "Payment and delivery",
        paragraphs: [
          "The site does not currently collect online payments or calculate delivery charges. The team will confirm the applicable payment and delivery arrangements before accepting an order. Do not send payment details through the website or through an unverified message.",
        ],
      },
      {
        title: "Terms before launch",
        paragraphs: [
          "These provisional website notes do not replace complete business terms. The business should confirm its legal identity, governing law, cancellation rules, warranties, returns, delivery responsibilities and dispute contact before enabling online sales.",
        ],
      },
    ],
  },
};

interface PolicyViewProps {
  kind: PolicyKind;
}

export const PolicyView: React.FC<PolicyViewProps> = ({ kind }) => {
  const { navigateTo } = useShop();
  const policy = policies[kind];

  return (
    <main className="min-h-screen bg-background pb-24 pt-32">
      <div className="shell max-w-4xl">
        <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => navigateTo("home")}
            className="flex items-center gap-1 rounded-sm transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Home
          </button>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-medium text-foreground">
            {policy.title}
          </span>
        </nav>

        <header className="mb-12 max-w-3xl">
          <p className="eyebrow mb-4">{policy.eyebrow}</p>
          <h1 className="font-serif-luxury text-4xl tracking-tight text-foreground sm:text-6xl">
            {policy.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {policy.intro}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">Last reviewed: 19 October 2026</p>
        </header>

        <div className="space-y-10">
          {policy.sections.map((section) => (
            <section key={section.title} aria-labelledby={`policy-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
              <h2
                id={`policy-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="font-serif-luxury text-2xl text-foreground sm:text-3xl"
              >
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="list-disc space-y-2 pl-6">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-serif-luxury text-2xl text-foreground">Have a question before you order?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Contact the team to confirm the terms that apply to your piece before making a payment.
          </p>
          <button
            type="button"
            onClick={() => navigateTo("contact")}
            className="mt-5 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Contact Novalestic
          </button>
        </div>
      </div>
    </main>
  );
};
