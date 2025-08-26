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
    description: "Soft maize meal pap served with perfectly grilled beef and boerewors, sided with chakalaka",
    price: 159,
    image: papMealImage,
    category: "Combo Meals",
    popular: true
  },
  {
    id: "2", 
    name: "Boerewors & Pap",
    description: "Traditional South African farmer's sausage with creamy pap and tomato relish",
    price: 119,
    image: boereworsImage,
    category: "Traditional"
  },
  {
    id: "3",
    name: "Potjiekos Special",
    description: "Slow-cooked three-legged pot stew with tender meat, vegetables and traditional spices",
    price: 189,
    image: potjiekosImage,
    category: "Specialties",
    popular: true
  },
  {
    id: "4",
    name: "Braai Platter for Two",
    description: "Mixed grill with boerewors, lamb chops, chicken, served with pap, chakalaka and morogo",
    price: 299,
    image: papMealImage,
    category: "Sharing"
  },
  {
    id: "5",
    name: "Pap & Morogo",
    description: "Traditional African spinach cooked with onions and tomatoes, served with soft pap",
    price: 89,
    image: potjiekosImage,
    category: "Vegetarian"
  },
  {
    id: "6",
    name: "Sosaties",
    description: "Cape Malay curry-flavoured kebabs with lamb and dried apricots",
    price: 145,
    image: boereworsImage,
    category: "Traditional",
    spicy: true
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

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-warm transition-all duration-300 bg-gradient-card border-border/50">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {item.popular && (
                    <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                  )}
                  {item.spicy && (
                    <Badge variant="destructive">Spicy</Badge>
                  )}
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl text-foreground">{item.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {item.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">R{item.price}</span>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={!quantities[item.id]}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {quantities[item.id] || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => addToCart(item)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
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