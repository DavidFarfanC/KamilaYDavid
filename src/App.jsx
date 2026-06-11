import { LanguageProvider } from './i18n/LanguageContext'
import PaperTexture from './components/PaperTexture'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import IntroVerseSection from './components/IntroVerseSection'
import OurStorySection from './components/OurStorySection'
import CountdownSection from './components/CountdownSection'
import ScheduleSection from './components/ScheduleSection'
import DetailsCardsSection from './components/DetailsCardsSection'
import FAQSection from './components/FAQSection'
import RSVPSection from './components/RSVPSection'
import GallerySection from './components/GallerySection'
import VisionSection from './components/VisionSection'
import FinalVerseSection from './components/FinalVerseSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <LanguageProvider>
      <PaperTexture />
      <Navbar />
      <main>
        <HeroSection />
        <IntroVerseSection />
        <OurStorySection />
        <CountdownSection />
        <ScheduleSection />
        <DetailsCardsSection />
        <FAQSection />
        <RSVPSection />
        <GallerySection />
        <VisionSection />
        <FinalVerseSection />
      </main>
      <Footer />
    </LanguageProvider>
  )
}
