// WelcomeView.tsx
import WelcomeBg from "~/assets/images/WelcomeBg.svg"; // Ensure this is an SVG or image file
import { useTranslation } from "react-i18next";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Button } from "~/components/ui/button";

export const WelcomePage = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { t } = useTranslation();

  const connectWallet = async () => {
    await tonConnectUI.openModal();
  };

  return (
    <div
      className="bg-background"
      style={{
        background: `url(${WelcomeBg}) no-repeat center`,
        backgroundSize: "cover",
      }}
    >
      <div className="flex flex-col items-center justify-between h-screen">
        <div className="relative top-1/2 transform -translate-y-1/2 text-center">
          <h1 className="font-display font-normal whitespace-nowrap">
            meta minter
            <span className="absolute text-[22px] top-0 right-10">beta</span>
          </h1>
        </div>
        <div className="flex flex-col items-center px-10 pb-12 w-screen animate-slideUp">
          <p className="text-[26px] font-medium">{t("welcome_hello")}</p>
          <p className="text-center mt-2">{t("welcome_instruction")}</p>
          <Button onClick={connectWallet}>{t("connect_wallet")}</Button>
        </div>
      </div>
    </div>
  );
};
