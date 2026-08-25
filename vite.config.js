import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

/**
 * Two build targets:
 *   npm run build       -> normal dist/ (serve with `npx serve dist`)
 *   npm run build:solo  -> ONE self-contained .html (images + js + css inlined)
 *                          that opens straight off the filesystem — handy for
 *                          emailing the client a demo they can just double-click.
 */
const SOLO = process.env.SOLO === '1'

export default defineConfig({
  base: './',
  plugins: [react(), ...(SOLO ? [viteSingleFile()] : [])],
  // Compile-time constant so the small srcset variants can be dead-code
  // eliminated from the single-file build (see src/lib/images.js).
  define: { __SOLO__: JSON.stringify(SOLO) },
  build: {
    outDir: SOLO ? 'dist-solo' : 'dist',
    // In solo mode every asset gets base64-inlined into the single HTML file.
    assetsInlineLimit: SOLO ? 100 * 1024 * 1024 : 4096,
    cssCodeSplit: !SOLO,
    chunkSizeWarningLimit: 1200,
  },
})
