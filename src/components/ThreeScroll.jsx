import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Aurora } from '../ui/Atmosphere.jsx'
import { KineticHeading, Reveal } from '../ui/Motion.jsx'

/** Cheap capability probe — one throwaway context, released immediately. */
function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * The parts list. Each entry declares where the piece flies in FROM, where it
 * settles, and when in the scroll it starts moving. Ordering the `at` values
 * roughly the way a real bathroom gets built (slab, walls, then fit-off) is
 * what makes the assembly read as construction rather than random motion.
 */
const PARTS = [
  { id: 'floor',    at: 0.00, from: [0, -3.4, 0],  to: [0, -0.06, 0] },
  { id: 'backWall', at: 0.07, from: [0, 0, -5.2],  to: [0, 1.0, -1.32] },
  { id: 'sideWall', at: 0.13, from: [-5, 0, 0],    to: [-1.63, 1.0, 0] },
  { id: 'tileBand', at: 0.22, from: [0, 3.2, -1.3],to: [-0.72, 1.05, -1.25] },
  { id: 'bath',     at: 0.30, from: [-4.4, 1.4, 2],to: [-0.86, 0.34, 0.42] },
  { id: 'vanity',   at: 0.40, from: [0, 3.4, -1],  to: [0.66, 0.6, -1.02] },
  { id: 'benchtop', at: 0.48, from: [0, 3.9, -1],  to: [0.66, 0.88, -1.02] },
  { id: 'basin',    at: 0.56, from: [0, 4.3, -1],  to: [0.66, 0.98, -1.02] },
  { id: 'tap',      at: 0.63, from: [0, 4.6, -1.2],to: [0.66, 1.1, -1.24] },
  { id: 'mirror',   at: 0.70, from: [0.66, 1.6, -4.5], to: [0.66, 1.62, -1.27] },
  { id: 'screen',   at: 0.78, from: [4.6, 1, 0],   to: [1.42, 0.92, -0.1] },
  { id: 'shower',   at: 0.86, from: [1.42, 4.2, -1.3], to: [1.42, 1.72, -1.1] },
]

const SPAN = 0.2 // how much scroll each part takes to travel home
const smooth = (t) => t * t * (3 - 2 * t)
const clamp01 = (n) => Math.min(1, Math.max(0, n))

export default function ThreeScroll() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const progressRef = useRef(0)
  const reduce = useReducedMotion()

  const [webgl, setWebgl] = useState(null) // null = not probed yet
  const [ready, setReady] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Copy fades in over the first slice and holds.
  const copyOpacity = useTransform(scrollYProgress, [0, 0.12, 0.9, 1], [0, 1, 1, 0.85])

  useEffect(() => setWebgl(hasWebGL()), [])

  // Keep a plain ref in sync so the render loop never touches React.
  useEffect(() => scrollYProgress.on('change', (v) => { progressRef.current = v }), [scrollYProgress])

  useEffect(() => {
    if (webgl !== true) return
    const canvas = canvasRef.current
    if (!canvas) return

    let disposed = false
    let cleanup = () => {}

    /**
     * three.js is code-split and only fetched once this section is close to the
     * viewport, so the initial page load never pays for it.
     */
    const boot = async () => {
      const THREE = await import('three')
      if (disposed) return

      const scene = new THREE.Scene()
      scene.fog = new THREE.Fog(0x0b0f14, 6, 15)

      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
      camera.position.set(0, 1.55, 5.4)
      camera.lookAt(0, 0.85, 0)

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: window.devicePixelRatio < 2,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setClearColor(0x000000, 0)
      // Cap DPR: retina phones gain nothing visible here and lose a lot of fill rate.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))

      // --- Lighting: cool key, warm rim. Matches the page's cyan/amber pairing.
      scene.add(new THREE.HemisphereLight(0xbfe9f5, 0x0b0f14, 0.85))
      const key = new THREE.DirectionalLight(0xffffff, 1.5)
      key.position.set(3, 5, 4)
      scene.add(key)
      const cyanFill = new THREE.PointLight(0x22d3ee, 26, 14)
      cyanFill.position.set(-3.2, 2.2, 2.6)
      scene.add(cyanFill)
      const amberRim = new THREE.PointLight(0xf5a623, 18, 12)
      amberRim.position.set(3, 1.4, -1.6)
      scene.add(amberRim)

      // --- Materials
      const solid = (color, opts = {}) =>
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.55,
          metalness: 0.1,
          transparent: true,
          opacity: 0,
          ...opts,
        })

      const mats = {
        floor: solid(0xd8dcdf, { roughness: 0.35 }),
        wall: solid(0xc9d0d4, { roughness: 0.75 }),
        tile: solid(0x2dd4bf, { roughness: 0.25, metalness: 0.3, emissive: 0x0a3d3a, emissiveIntensity: 0.6 }),
        white: solid(0xf6f8f9, { roughness: 0.22 }),
        cabinet: solid(0x8a6a4a, { roughness: 0.6 }),
        stone: solid(0xf2f3f2, { roughness: 0.18, metalness: 0.05 }),
        metal: solid(0x2a3138, { roughness: 0.2, metalness: 0.92 }),
        brass: solid(0xf5a623, { roughness: 0.25, metalness: 0.85 }),
        glass: solid(0x9fd8e6, { roughness: 0.05, metalness: 0.1, opacity: 0 }),
      }

      const lineMat = new THREE.LineBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 1,
      })

      // --- Geometry per part. Low poly on purpose: this renders on phones.
      const geoFor = (id) => {
        switch (id) {
          case 'floor':    return new THREE.BoxGeometry(3.3, 0.12, 2.7)
          case 'backWall': return new THREE.BoxGeometry(3.3, 2.0, 0.1)
          case 'sideWall': return new THREE.BoxGeometry(0.1, 2.0, 2.7)
          case 'tileBand': return new THREE.BoxGeometry(1.5, 1.5, 0.04)
          case 'bath':     return new THREE.CapsuleGeometry(0.34, 0.86, 4, 12)
          case 'vanity':   return new THREE.BoxGeometry(1.45, 0.5, 0.52)
          case 'benchtop': return new THREE.BoxGeometry(1.55, 0.07, 0.58)
          case 'basin':    return new THREE.CylinderGeometry(0.21, 0.17, 0.15, 20)
          case 'tap':      return new THREE.CylinderGeometry(0.022, 0.022, 0.4, 10)
          case 'mirror':   return new THREE.TorusGeometry(0.34, 0.028, 8, 32)
          case 'screen':   return new THREE.BoxGeometry(0.035, 1.85, 1.15)
          case 'shower':   return new THREE.CylinderGeometry(0.16, 0.16, 0.035, 20)
          default:         return new THREE.BoxGeometry(0.3, 0.3, 0.3)
        }
      }

      const matFor = (id) =>
        ({
          floor: mats.floor,
          backWall: mats.wall,
          sideWall: mats.wall,
          tileBand: mats.tile,
          bath: mats.white,
          vanity: mats.cabinet,
          benchtop: mats.stone,
          basin: mats.white,
          tap: mats.metal,
          mirror: mats.brass,
          screen: mats.glass,
          shower: mats.metal,
        })[id] ?? mats.white

      const root = new THREE.Group()
      root.position.y = -0.55
      scene.add(root)

      const built = PARTS.map((part) => {
        const geo = geoFor(part.id)
        const mesh = new THREE.Mesh(geo, matFor(part.id))

        // A couple of pieces need orienting once, up front.
        if (part.id === 'bath') mesh.rotation.z = Math.PI / 2
        if (part.id === 'tap') mesh.rotation.x = 0.12
        if (part.id === 'shower') mesh.rotation.x = 0.18

        // Cyan wireframe twin: fully lit at the start, dissolving as the solid
        // fades up. That's the "drawing becomes building" beat.
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), lineMat.clone())
        edges.rotation.copy(mesh.rotation)

        const group = new THREE.Group()
        group.add(mesh, edges)
        root.add(group)
        return { ...part, group, mesh, edges, geo }
      })

      // --- Sizing
      const resize = () => {
        const w = canvas.clientWidth
        const h = canvas.clientHeight
        if (!w || !h) return
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        // Pull the camera back on narrow screens so the scene still fits.
        camera.fov = w < 640 ? 50 : w < 1024 ? 43 : 38
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(canvas)

      // --- Render loop, gated on visibility
      let raf = 0
      let visible = false
      let eased = progressRef.current

      const frame = () => {
        if (disposed) return
        const target = progressRef.current
        // Damp toward the scroll value so flicks feel weighted, not twitchy.
        eased += (target - eased) * 0.12
        const p = clamp01(eased)

        built.forEach((part) => {
          const local = clamp01((p - part.at) / SPAN)
          const t = smooth(local)
          part.group.position.set(
            part.from[0] + (part.to[0] - part.from[0]) * t,
            part.from[1] + (part.to[1] - part.from[1]) * t,
            part.from[2] + (part.to[2] - part.from[2]) * t,
          )
          part.mesh.material.opacity = part.id === 'screen' ? t * 0.32 : t
          part.edges.material.opacity = Math.max(0, 0.9 - t * 0.78)
          part.group.scale.setScalar(0.86 + 0.14 * t)
        })

        // Slow orbit tied to scroll, plus a small settle on the vertical axis.
        root.rotation.y = -0.62 + p * 1.15
        root.rotation.x = 0.16 - p * 0.1
        camera.position.z = 5.4 - p * 0.5

        renderer.render(scene, camera)
        raf = requestAnimationFrame(frame)
      }

      // Only burn frames while the canvas is actually on screen.
      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting
          if (visible && !raf) raf = requestAnimationFrame(frame)
          if (!visible && raf) {
            cancelAnimationFrame(raf)
            raf = 0
          }
        },
        { rootMargin: '120px' },
      )
      io.observe(canvas)

      const onContextLost = (e) => {
        e.preventDefault()
        if (raf) cancelAnimationFrame(raf)
        raf = 0
      }
      canvas.addEventListener('webglcontextlost', onContextLost)

      setReady(true)

      cleanup = () => {
        io.disconnect()
        ro.disconnect()
        canvas.removeEventListener('webglcontextlost', onContextLost)
        if (raf) cancelAnimationFrame(raf)
        built.forEach((p) => {
          p.geo.dispose()
          p.edges.geometry.dispose()
          p.edges.material.dispose()
        })
        Object.values(mats).forEach((m) => m.dispose())
        lineMat.dispose()
        renderer.dispose()
      }
    }

    boot()
    return () => {
      disposed = true
      cleanup()
    }
  }, [webgl])

  return (
    <section
      ref={sectionRef}
      className={`relative bg-ink-950 ${reduce ? '' : 'h-[210svh] lg:h-[270vh]'}`}
    >
      <div
        className={`grain sticky top-0 flex min-h-[100svh] items-center overflow-hidden ${
          reduce ? 'py-24' : ''
        }`}
      >
        <Aurora variant="amber" />

        {/* Canvas layer */}
        <div className="pointer-events-none absolute inset-0">
          {webgl === true ? (
            <canvas
              ref={canvasRef}
              className={`h-full w-full transition-opacity duration-1000 ${
                ready ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden="true"
            />
          ) : webgl === false ? (
            <CssFallback progress={scrollYProgress} />
          ) : null}
        </div>

        {/* Overlay copy */}
        <motion.div style={{ opacity: reduce ? 1 : copyOpacity }} className="shell relative">
          <div className="max-w-xl">
            <Reveal className="mb-5 flex items-center gap-3">
              <span className="h-px w-9 bg-amber" />
              <span className="eyebrow text-amber">How we work</span>
            </Reveal>
            <KineticHeading
              lines={['Speed, Quality', '& Communication.']}
              className="display-lg text-white"
            />
            <Reveal delay={0.1}>
              <p className="body-lg mt-6 text-mist/70">
                Luke&rsquo;s Renovations in Sydney offer excellent service and project
                management. With swift yet precise bathroom and kitchen renovations, we
                prioritise quality and seamless communication. Experience efficiency and
                transparency, where your satisfaction is paramount.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-muted/60">
                {reduce ? 'Bathroom assembly · static view' : 'Scroll to build the room'}
              </p>
            </Reveal>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * WebGL-free fallback: the same "parts assemble" idea in CSS 3D. Lighter than
 * the real scene and driven by the identical scroll progress value, so the
 * section still tells its story on locked-down or older devices.
 */
const FALLBACK_LAYERS = [
  { w: 260, h: 170, y: 90, delay: 0, color: 'rgba(216,220,223,.28)' },
  { w: 230, h: 150, y: 30, delay: 0.15, color: 'rgba(45,212,191,.22)' },
  { w: 190, h: 120, y: -30, delay: 0.32, color: 'rgba(34,211,238,.22)' },
  { w: 140, h: 86, y: -86, delay: 0.5, color: 'rgba(245,166,35,.24)' },
]

/** One slab. Its own component so each useTransform gets a stable hook slot. */
function FallbackLayer({ progress, layer }) {
  const y = useTransform(progress, [layer.delay, layer.delay + 0.28], [layer.y - 220, layer.y])
  const opacity = useTransform(progress, [layer.delay, layer.delay + 0.28], [0, 1])
  return (
    <motion.div
      style={{
        y,
        opacity,
        width: layer.w,
        height: layer.h,
        background: layer.color,
        border: '1px solid rgba(34,211,238,.5)',
      }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm backdrop-blur-sm"
    />
  )
}

function CssFallback({ progress }) {
  const rotate = useTransform(progress, [0, 1], [-28, 22])
  return (
    <div className="grid h-full w-full place-items-center [perspective:1100px]">
      <motion.div
        style={{ rotateY: rotate, rotateX: 52 }}
        className="relative [transform-style:preserve-3d]"
      >
        {FALLBACK_LAYERS.map((l, i) => (
          <FallbackLayer key={i} progress={progress} layer={l} />
        ))}
      </motion.div>
    </div>
  )
}
