import { IMG } from './images.js'

export const BRAND = {
  name: "Luke's Renovations",
  phone: '0450 749 214',
  phoneHref: 'tel:0450749214',
  email: 'luke@lukesrenovations.com.au',
  address: '1/2a Burrows Road, St Peters NSW 2044, Australia',
}

/** Home is the only real page in this demo; the rest are visual shell. */
export const NAV_LINKS = [
  { label: 'Home', href: '#top', active: true },
  { label: 'About Us' },
  { label: 'Services' },
  { label: 'Bathroom Renovations Sydney' },
  { label: 'Blog' },
  { label: 'Portfolio' },
  { label: 'Media Gallery' },
  { label: 'Contact Us' },
]

export const TRUST_PILLS = [
  '10+ Years',
  'Fully Licensed & Insured',
  '180+ 5★ Google Reviews',
  '~2 Week Bathrooms',
]

export const SERVICES = [
  {
    key: 'renovations',
    title: 'Renovations',
    body: 'Bathrooms, kitchens, laundries and full-home renovations. One team manages the job from demolition through to handover.',
  },
  {
    key: 'kitchen',
    title: 'Kitchen',
    body: 'Kitchen renovations, trade work, custom joinery and stone. We coordinate the full job so you are not chasing separate trades.',
  },
  {
    key: 'bathroom',
    title: 'Bathroom',
    body: 'Complete bathroom renovations across Sydney, with most standard bathrooms finished in around two weeks.',
  },
]

export const PROJECTS = [
  {
    id: 'p1',
    title: 'Inner Sydney Family Bathroom',
    meta: 'Freestanding bath · walk-in shower · brushed brass',
    before: IMG.p1before,
    after: IMG.p1after,
  },
  {
    id: 'p2',
    title: 'Apartment Bathroom Rebuild',
    meta: 'Bath removed · full-height stone · matte black',
    before: IMG.p2before,
    after: IMG.p2after,
  },
  {
    id: 'p3',
    title: 'Ensuite Shower Upgrade',
    meta: 'Frameless glass · herringbone feature · patterned floor',
    before: IMG.p3before,
    after: IMG.p3after,
  },
]

export const REVIEWS = [
  {
    name: 'Emma Spence',
    text: 'Engaged Luke and team to renovate two bathrooms. Both were complete in three weeks. His process works like a well-oiled machine.',
  },
  {
    name: 'Tim Miles',
    text: "We chose Luke's company to renovate one of our bathrooms. We are so happy with the result and love our new bathroom.",
  },
  {
    name: 'Nic Fodor',
    text: 'We recently had our bathroom renovated by Luke and his team, and are very happy with the final result. The finished space looks fantastic.',
  },
  {
    name: 'Julia van Graas',
    text: "Found Luke's Renovations on Google reviews as they looked like specialists in inner Sydney. Had a read through the reviews and glad we chose them.",
  },
  {
    name: 'Alvin Chan',
    text: 'I recently had my bathroom renovated by Luke and his team, and I couldn\u2019t be more pleased with the results! From the start, Luke was professional and clear.',
  },
  { name: 'Suket Pathak', text: 'Great team and fab finish.' },
  {
    name: 'Lucas Rusiecki',
    text: 'It was a pleasure working with Luke and Abe. The brief was challenging, involving moving plumbing around in a first-floor apartment building.',
  },
  {
    name: 'Pat Lebre',
    text: 'We recently had our bathroom renovated. The experience has been excellent from start to finish.',
  },
]

export const WHY_US = [
  {
    title: 'Renovation',
    body: 'Our team specialise in home renovations, interior design, custom carpentry, bathrooms and more. With a commitment to quality workmanship, we bring your vision to life. Contact us for a consultation and elevate your living spaces.',
  },
  {
    title: 'Kitchen',
    body: "Renovate your kitchen with Luke's Renovations — expert craftsmanship and personalised design. Specialising in precision remodelling, we bring your vision to life. Contact us for a consultation and transform your kitchen space.",
  },
  {
    title: 'Bathroom',
    body: "Transform your bathroom with Luke's Renovations — expert advice, professional tradesmen, personalised service and top-notch project management. Contact us for a consultation and elevate your bathroom within a 2-week turnaround.",
  },
]

export const FEATURES = [
  { title: 'Fast Process', body: "Fast-process experts at Luke's Renovations.", icon: 'bolt' },
  { title: 'Best Quality', body: "Luke's Renovations sets the standard for best quality.", icon: 'gem' },
  { title: 'Free Support', body: "Luke's Renovations offers free ongoing support.", icon: 'support' },
  { title: 'Consistent', body: 'Over 10 years of consistent, high-quality workmanship.', icon: 'wave' },
  { title: 'Experienced', body: "Luke's Renovations masters every detail.", icon: 'rule' },
  { title: 'Thorough', body: "Luke's Renovations leaves no detail untouched.", icon: 'scan' },
]

export const CREDENTIALS = [
  '10+ Years Experience',
  'Fully Licensed & Insured',
  'Workmanship Warranty',
  'Fixed Price Quotes',
  '180+ 5-Star Google Reviews',
  'Around 2 Weeks for Standard Bathrooms',
]

export const PROJECT_TYPES = [
  { id: 'bathroom', title: 'Bathroom', range: 'Projects $25k–$40k' },
  { id: 'kitchen', title: 'Kitchen', range: 'Projects $30k–$60k' },
  { id: 'full-home', title: 'Full Home', range: '$100k+ Projects' },
]

export const TIMEFRAMES = ['ASAP', '1–3 months', '3–6 months', 'Just exploring']

/** Gallery draws on every finished-work shot in the asset set. */
export const GALLERY = [
  { img: IMG.p1after, caption: 'Freestanding bath, Inner West' },
  { img: IMG.bathroomVanity, caption: 'Fluted timber vanity with stone top' },
  { img: IMG.p2after, caption: 'Apartment bathroom, matte black tapware' },
  { img: IMG.kitchenIsland, caption: 'Kitchen island in engineered stone' },
  { img: IMG.p3after, caption: 'Ensuite with herringbone feature wall' },
  { img: IMG.kitchenGalley, caption: 'Galley kitchen with integrated laundry' },
]
