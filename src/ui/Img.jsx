import { useState } from 'react'

/**
 * Lazy image with a blur-up LQIP underneath.
 *
 * The wrapper reserves space from the image's intrinsic ratio (or an explicit
 * `ratio` override when we're art-directing a crop), so nothing on the page
 * moves as photos stream in.
 */
export default function Img({
  image,
  alt,
  className = '',
  imgClassName = '',
  ratio,
  sizes = '100vw',
  priority = false,
  position = 'center',
}) {
  const [loaded, setLoaded] = useState(false)

  /**
   * ratio unset  -> reserve space from the photo's own dimensions
   * ratio "auto" -> caller is sizing this (e.g. a full-bleed hero), reserve nothing
   * ratio "4 / 3"-> art-directed crop
   */
  const aspect =
    ratio === 'auto' ? undefined : (ratio ?? `${image.width} / ${image.height}`)

  return (
    <div
      className={`relative overflow-hidden bg-ink-800 ${className}`}
      style={{ aspectRatio: aspect }}
    >
      {/* LQIP: 20px-wide base64 JPEG, scaled up and blurred. */}
      <img
        aria-hidden="true"
        src={image.lqip}
        alt=""
        className={`absolute inset-0 h-full w-full scale-110 object-cover blur-xl transition-opacity duration-700 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ objectPosition: position }}
      />
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={image.srcSet ? sizes : undefined}
        width={image.width}
        height={image.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
        style={{ objectPosition: position }}
      />
    </div>
  )
}
