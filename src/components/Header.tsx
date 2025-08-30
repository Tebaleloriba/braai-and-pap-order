interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">M</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Mzansi Kitchen</h1>
            <p className="text-sm text-muted-foreground">Traditional SA Cuisine</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;