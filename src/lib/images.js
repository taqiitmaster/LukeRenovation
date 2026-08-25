/**
 * Every photo is imported through the bundler (not dropped in /public) so that
 * the single-file build can base64-inline it. Each entry carries the full-size
 * source, an 800w variant for srcset where one exists, and intrinsic dimensions
 * + a blur-up LQIP from imageMeta.js — that combination is what keeps the page
 * at zero cumulative layout shift.
 */
import { IMAGE_META } from './imageMeta.js'

import logo from '../assets/images/logo.png'
import logoLight from '../assets/images/logo-light.png'

import bathroomVanity from '../assets/images/bathroom-vanity.jpg'
import kitchenIsland from '../assets/images/kitchen-island.jpeg'
import kitchenGalley from '../assets/images/kitchen-galley.jpg'

import p1before from '../assets/images/project1-before.jpeg'
import p1after from '../assets/images/project1-after.webp'
import p2before from '../assets/images/project2-before.webp'
import p2after from '../assets/images/project2-after.webp'
import p3before from '../assets/images/project3-before.jpeg'
import p3after from '../assets/images/project3-after.jpeg'

// 800w variants, used for srcset in the normal build only.
import bathroomVanity800 from '../assets/images/bathroom-vanity-800.jpg'
import kitchenGalley800 from '../assets/images/kitchen-galley-800.jpg'
import p1after800 from '../assets/images/project1-after-800.webp'
import p2before800 from '../assets/images/project2-before-800.webp'
import p2after800 from '../assets/images/project2-after-800.webp'

/**
 * Why the 800w variants are gated behind a compile-time constant:
 *
 * In the single-file build every asset becomes a base64 data URI. There, srcset
 * is pointless (nothing is fetched over the network, so there is no bandwidth
 * to save) and mildly fragile — a data URI contains a comma, which is the same
 * character srcset uses as its separator. Browsers do parse it correctly, since
 * the URL token is delimited by whitespace rather than the comma, but there is
 * no reason to lean on that.
 *
 * Because `__SOLO__` is substituted at build time, Rollup collapses this whole
 * expression to `{}` for that target, the five imports above go unreferenced,
 * and asset imports are side-effect free — so they get tree-shaken and the
 * single file never carries a second copy of any photo.
 */
const SMALL = __SOLO__
  ? {}
  : {
      bathroomVanity: bathroomVanity800,
      kitchenGalley: kitchenGalley800,
      p1after: p1after800,
      p2before: p2before800,
      p2after: p2after800,
    }

const build = (key, file, src) => {
  const small = SMALL[key]
  return {
    src,
    // Only emit a srcset when a genuinely smaller variant exists.
    srcSet: small ? `${small} 800w, ${src} ${IMAGE_META[file].w}w` : undefined,
    width: IMAGE_META[file].w,
    height: IMAGE_META[file].h,
    lqip: IMAGE_META[file].lqip,
  }
}

export const LOGO = logo
export const LOGO_LIGHT = logoLight

export const IMG = {
  bathroomVanity: build('bathroomVanity', 'bathroom-vanity.jpg', bathroomVanity),
  kitchenIsland: build('kitchenIsland', 'kitchen-island.jpeg', kitchenIsland),
  kitchenGalley: build('kitchenGalley', 'kitchen-galley.jpg', kitchenGalley),

  p1before: build('p1before', 'project1-before.jpeg', p1before),
  p1after: build('p1after', 'project1-after.webp', p1after),
  p2before: build('p2before', 'project2-before.webp', p2before),
  p2after: build('p2after', 'project2-after.webp', p2after),
  p3before: build('p3before', 'project3-before.jpeg', p3before),
  p3after: build('p3after', 'project3-after.jpeg', p3after),
}
