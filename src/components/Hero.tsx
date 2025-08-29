import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-braai.jpg";

const Hero = () => {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          Authentic
          <span className="block bg-gradient-hero bg-clip-text text-transparent">
            Mzansi Flavors
          </span>
        </h1>
        
        <p className="text-base sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
          Experience the rich traditions of South African cuisine with our authentic pap, 
          perfectly grilled braai meat, and traditional favorites delivered to your door.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Button 
            onClick={scrollToMenu}
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-glow w-full sm:w-auto"
          >
            Order Now
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white text-white hover:bg-white hover:text-black px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg w-full sm:w-auto"
          >
            View Menu
          </Button>
        </div>
        
        <div className="mt-8 sm:mt-16 animate-bounce">
          <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 text-white/70 mx-auto" />
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};

export default Hero;