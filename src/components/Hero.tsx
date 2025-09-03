import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-braai.jpg";
import cocaColaImage from "@/assets/coca-cola.jpg";
import castleLagerImage from "@/assets/castle-lager.jpg";
import chocolateMilkshakeImage from "@/assets/chocolate-milkshake.jpg";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: heroImage,
      alt: "Traditional South African braai",
      title: "Authentic",
      subtitle: "Mzansi Flavors"
    },
    {
      image: cocaColaImage,
      alt: "Refreshing Coca-Cola",
      title: "Refreshing",
      subtitle: "Coca-Cola"
    },
    {
      image: castleLagerImage,
      alt: "Castle Lager beer",
      title: "Ice Cold",
      subtitle: "Castle Lager"
    },
    {
      image: chocolateMilkshakeImage,
      alt: "Creamy chocolate milkshake",
      title: "Creamy",
      subtitle: "Chocolate Milkshake"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[25vh] flex items-center justify-center overflow-hidden">
      {/* Sliding Background Images */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'translate-x-0' 
                : index < currentSlide 
                  ? '-translate-x-full' 
                  : 'translate-x-full'
            }`}
          >
            <img 
              src={slide.image} 
              alt={slide.alt} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight animate-fade-in">
          {slides[currentSlide].title}
          <span className="block bg-gradient-hero bg-clip-text text-transparent">
            {slides[currentSlide].subtitle}
          </span>
        </h1>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};

export default Hero;