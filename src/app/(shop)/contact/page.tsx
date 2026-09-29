import { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us & Customer Support | ShopHub",
  description:
    "Get in touch with the ShopHub support team. Whether you need order updates, exchange assistance, or general help, our concierge is here 7 days a week.",
  openGraph: {
    title: "Contact ShopHub Concierge Support",
    description:
      "Reach out to our customer care team for instant answers, order tracking assistance, or product inquiries.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ContactClient />
    </main>
  );
}
