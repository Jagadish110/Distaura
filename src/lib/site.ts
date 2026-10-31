export const site = {
  name: "Distaura",
  title: "Distaura | Software distribution for Indian businesses",
  description:
    "Distaura is a B2B distribution business that connects software and service suppliers with Indian businesses.",
  tagline: "Software distribution for Indian businesses",
  emails: {
    partners: "amoghravikumar93@gmail.com",
    hello: "amoghravikumar93@gmail.com",
  },
  supplierPartner: "Acreo Tech",
  phone: "+91 81235 93336",
  phoneHref: "tel:+918123593336",
  whatsapp: "918123593336",
  basedIn: "India",
  cities: [
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Ahmedabad",
    "Kolkata",
    "Jaipur",
    "Kochi",
    "Indore",
    "Chandigarh",
  ],
} as const;

/** WhatsApp chat link with Distaura, optionally pre-filled with a message. */
export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
