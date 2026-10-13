import { createFileRoute } from "@tanstack/react-router";
import App from "../novalestic/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Novalestic Jewellers — Fine Gemstone Jewellery" },
      {
        name: "description",
        content:
          "Novalestic Jewellers — handcrafted rings, earrings, necklaces and bangles with four decades of gemstone mastery.",
      },
      { property: "og:title", content: "Novalestic Jewellers — Fine Gemstone Jewellery" },
      {
        property: "og:description",
        content:
          "Handcrafted rings, earrings, necklaces and bangles with four decades of gemstone mastery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <App />;
}
