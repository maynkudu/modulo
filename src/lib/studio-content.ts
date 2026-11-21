/** Studio projects shared by the homepage and Work. Each slug has a live component detail page. */
export const studioProjects = [
  { slug: "nilkamal", title: "Nilkamal", type: "Interactive art", alt: "A blue lotus on a night pond" },
  { slug: "diwali-26", title: "Diwali / 26", type: "Moving poster", alt: "A digital Diwali poster with floral rangoli and fireworks" },
  { slug: "logo-refraction", title: "Logo Refraction", type: "Identity in motion", alt: "A white Devanagari mark refracted through glass" },
] as const;

/** Offerings and real examples used on the homepage and Services page. */
export const studioServices = [
  { title: "Brand identity", copy: "Visual direction, wordmarks, typography and guidelines your team can work with.", example: studioProjects[2] },
  { title: "Websites", copy: "Art direction, design and frontend development for launches and brand sites.", example: studioProjects[0] },
  { title: "Motion", copy: "Animated identities, site interactions and moving artwork for launches and campaigns.", example: studioProjects[1] },
  { title: "Print and merch", copy: "Posters, apparel and campaign graphics, with files prepared for production." },
];

/** Keeps the same project inquiry wording and email action on Home and Contact. */
export const studioInquiry = {
  heading: "Start a project",
  copy: "Tell us what you're making, when it needs to launch and the budget you have in mind.",
  emailHref: "mailto:maynkudu@gmail.com?subject=Modulo%20project%20inquiry",
};
