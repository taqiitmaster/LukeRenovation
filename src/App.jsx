import Navbar from './components/Navbar.jsx'
import MobileCallBar from './components/MobileCallBar.jsx'
import Hero from './components/Hero.jsx'
import ServicesTrio from './components/ServicesTrio.jsx'
import DesignService from './components/DesignService.jsx'
import Portfolio from './components/Portfolio.jsx'
import Reviews from './components/Reviews.jsx'
import ThreeScroll from './components/ThreeScroll.jsx'
import WhyUs from './components/WhyUs.jsx'
import MeetLuke from './components/MeetLuke.jsx'
import FeatureGrid from './components/FeatureGrid.jsx'
import Credentials from './components/Credentials.jsx'
import QuoteWizard from './components/QuoteWizard.jsx'
import Gallery from './components/Gallery.jsx'
import FinalCTA from './components/FinalCTA.jsx'
import Footer from './components/Footer.jsx'
import Cursor from './ui/Cursor.jsx'
import { ScrollProgress } from './ui/Atmosphere.jsx'

/**
 * Home page only. Sections alternate dark and light bands so the page has a
 * rhythm rather than one long gradient:
 *
 *   hero · services            dark
 *   design & renovation        light
 *   portfolio                  dark
 *   reviews                    light
 *   3D scroll · why us         dark
 *   meet luke · features       light
 *   credentials · quote        dark
 *   gallery                    light
 *   final CTA · footer         dark
 */
export default function App() {
  return (
    <>
      <ScrollProgress />
      <Cursor />
      <Navbar />

      <main>
        <Hero />
        <ServicesTrio />
        <DesignService />
        <Portfolio />
        <Reviews />
        <ThreeScroll />
        <WhyUs />
        <MeetLuke />
        <FeatureGrid />
        <Credentials />
        <QuoteWizard />
        <Gallery />
        <FinalCTA />
      </main>

      <Footer />
      <MobileCallBar />
    </>
  )
}
