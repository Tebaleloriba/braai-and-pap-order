import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import papMealImage from "@/assets/pap-meal.jpg";
import boereworsImage from "@/assets/boerewors.jpg";
import potjiekosImage from "@/assets/potjiekos.jpg";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  spicy?: boolean;
  popular?: boolean;
}

interface MenuProps {
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Traditional Pap & Braai Combo",
    description: "",
    price: 159,
    image: papMealImage,
    category: "Combo Meals",
    popular: true
  },
  {
    id: "2", 
    name: "Boerewors & Pap",
    description: "",
    price: 119,
    image: boereworsImage,
    category: "Traditional"
  },
  {
    id: "3",
    name: "Potjiekos Special",
    description: "",
    price: 189,
    image: potjiekosImage,
    category: "Specialties",
    popular: true
  },
  {
    id: "4",
    name: "Braai Platter for Two",
    description: "",
    price: 299,
    image: papMealImage,
    category: "Sharing"
  },
  {
    id: "5",
    name: "Pap & Morogo",
    description: "",
    price: 89,
    image: potjiekosImage,
    category: "Vegetarian"
  },
  {
    id: "6",
    name: "Sosaties",
    description: "",
    price: 145,
    image: boereworsImage,
    category: "Traditional",
    spicy: true
  },
  {
    id: "7",
    name: "Mageu",
    description: "",
    price: 25,
    image: potjiekosImage,
    category: "Drinks"
  },
  {
    id: "8",
    name: "Rooibos Tea",
    description: "",
    price: 20,
    image: boereworsImage,
    category: "Drinks"
  },
  {
    id: "9",
    name: "Castle Lager",
    description: "",
    price: 35,
    image: papMealImage,
    category: "Drinks"
  },
  {
    id: "10",
    name: "Amarula Cream",
    description: "",
    price: 45,
    image: potjiekosImage,
    category: "Drinks"
  }
];

const Menu = ({ onAddToCart }: MenuProps) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredItems = selectedCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const updateQuantity = (itemId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  const addToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 1;
    onAddToCart(item, quantity);
    setQuantities(prev => ({ ...prev, [item.id]: 0 }));
  };

  return (
    <section id="menu" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Traditional Menu
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover authentic South African flavors, prepared with love and tradition
          </p>
        </div>

        {/* Category Filter - Image Cards with Horizontal Scroll */}
        <div className="flex overflow-x-auto gap-4 mb-12 pb-2 scrollbar-hide">
          <div className="flex gap-4 min-w-max px-4">
            {categories.map((category, index) => {
              const categoryImages = {
                "All": papMealImage,
                "Combo Meals": papMealImage,
                "Traditional": boereworsImage,
                "Specialties": potjiekosImage,
                "Sharing": papMealImage,
                "Vegetarian": potjiekosImage,
                "Drinks": boereworsImage
              };
              
              return (
                <div
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="relative group cursor-pointer flex-shrink-0"
                >
                  <div className={`relative w-24 h-24 rounded-full overflow-hidden border-4 transition-all duration-300 ${
                    selectedCategory === category 
                      ? 'border-primary shadow-glow' 
                      : 'border-border hover:border-primary/50'
                  }`}>
                    <img 
                      src={categoryImages[category as keyof typeof categoryImages] || papMealImage}
                      alt={category}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Hover Label */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                    {category}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-warm transition-all duration-300 bg-gradient-card border-border/50 flex flex-col">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-1 sm:gap-2">
                  {item.popular && (
                    <Badge className="bg-primary text-primary-foreground text-xs sm:text-sm">Popular</Badge>
                  )}
                  {item.spicy && (
                    <Badge variant="destructive" className="text-xs sm:text-sm">Spicy</Badge>
                  )}
                </div>
              </div>
              
              <CardHeader className="p-3 sm:p-6 flex-grow">
                <CardTitle className="text-lg sm:text-xl text-foreground">{item.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl font-bold text-primary">R{item.price}</span>
                  <Badge variant="outline" className="text-xs sm:text-sm">{item.category}</Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={!quantities[item.id]}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium text-sm sm:text-base">
                      {quantities[item.id] || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => addToCart(item)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base px-3 sm:px-4"
                    size="sm"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;