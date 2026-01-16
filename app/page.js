import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import FeaturedProducts from './components/FeaturedProducts';
import CategoriesSection from './components/CategoriesSection';
import TestimonialsSection from './components/TestimonialsSection';
import NewsletterSection from './components/NewsletterSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Products */}
      <FeaturedProducts />
      
      {/* Categories Section */}
      <CategoriesSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Newsletter Section */}
      <NewsletterSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
