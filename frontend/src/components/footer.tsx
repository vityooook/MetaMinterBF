import { Link } from "react-router-dom";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";
import { Headset } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="flex justify-between items-center mt-auto mt-4">
      <p className="text-sm">
        Crafted with love <br /> by <span className="text-primary">@</span>
        tmadevs
      </p>
      <div className="flex gap-2">
        <ThemeSwitcher />
        <Button asChild size="icon" variant="ghost" className="text-foreground">
          <Link to="https://t.me/tmadevs_support/3" target="_blank">
            <Headset className="text-foreground w-5 h-5" />
          </Link>
        </Button>
      </div>
    </footer>
  );
};
