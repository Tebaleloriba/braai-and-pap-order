import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-braai.jpg";

const Hero = () => {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Traditional South African braai" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>
      
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
          Authentic
          <span className="block bg-gradient-hero bg-clip-text text-transparent">
            Mzansi Flavors
          </span>
        </h1>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};

export default Hero;