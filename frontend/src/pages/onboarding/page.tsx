// WelcomeView.tsx
import WelcomeBg from "~/assets/images/WelcomeBg.svg"; // Ensure this is an SVG or image file
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import LogoSvg from "~/assets/images/metaming-logo.svg";
import { Link } from "react-router-dom";

export const OnboardingPage = () => {
  const { t } = useTranslation();

  return (
    <div
      className="bg-background -m-4 px-4"
      style={{
        background: `url(${WelcomeBg}) no-repeat center`,
        backgroundSize: "cover",
      }}
    >
      <div className="flex flex-col items-center justify-around h-screen">
        <div className="text-center">
          <h1 className="font-display font-bold whitespace-nowrap text-3xl space-y-2">
            <img src={LogoSvg} alt="Metaminter logo" className="w-48" />
            <div>Metaminter</div>
          </h1>
        </div>
        <div className="flex flex-col items-center px-10 w-screen animate-slideUp">
          <p className="text-3xl font-bold">{t("welcome_hello")}</p>
          <p className="text-center mt-2">{t("welcome_instruction")}</p>
        </div>
        <Button asChild size="lg" className="w-full">
          <Link to="/">Continue</Link>
        </Button>
      </div>
    </div>
  );
};
