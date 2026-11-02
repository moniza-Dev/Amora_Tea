// Static info pages. Placeholder copy: have it reviewed before launch (especially shipping, returns, terms, privacy).
export interface InfoPage { title: string; intro: string; sections: { h: string; p: string }[] }

export const INFO_PAGES: Record<string, InfoPage> = {
  faqs: {
    title: "FAQs", intro: "Quick answers to common questions.",
    sections: [
      { h: "How do I brew my tea?", p: "Every product page lists the best water temperature and steeping time for that tea." },
      { h: "Are your teas organic?", p: "We choose organic and natural teas. Check each product page for ingredients." },
      { h: "Which payment methods do you accept?", p: "Card payments, Cash on Delivery and KHQR/Bakong are planned for checkout." },
      { h: "Do you deliver outside Phnom Penh?", p: "Delivery details are on the Shipping Policy page." },
    ],
  },
  "shipping-policy": {
    title: "Shipping Policy", intro: "How and when your order reaches you.",
    sections: [
      { h: "Free shipping", p: "Orders above $39 ship free (to be confirmed before checkout launches)." },
      { h: "Delivery times", p: "Delivery times and fees will be listed here once shipping rules are finalised." },
    ],
  },
  returns: {
    title: "Return & Refund", intro: "Not happy? Let us know.",
    sections: [
      { h: "Returns", p: "Contact us if there is a problem with your order. Final return terms will be added before launch." },
      { h: "Refunds", p: "Approved refunds go back to your original payment method." },
    ],
  },
  terms: { title: "Terms & Conditions", intro: "Draft terms.", sections: [{ h: "Use of this site", p: "Final terms will be added before launch." }] },
  privacy: { title: "Privacy Policy", intro: "How we treat your data.", sections: [{ h: "Your data", p: "We store only what we need to serve you, such as your email for the newsletter. The final policy will be added before launch." }] },
  track: { title: "Track Order", intro: "Order tracking arrives with checkout.", sections: [{ h: "Coming soon", p: "Once checkout is live you will be able to track your order here." }] },
  account: { title: "My Account", intro: "Accounts arrive soon.", sections: [{ h: "Coming soon", p: "Sign-in, order history and your wishlist will live here." }] },
};
