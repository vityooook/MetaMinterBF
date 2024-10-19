// WelcomeView.tsx
import WelcomeBg from "~/assets/images/WelcomeBg.svg"; // Ensure this is an SVG or image file
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import LogoSvg from "~/assets/images/metaming-logo.svg";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useUserStore } from "~/db/userStore";
import { completeOnboarding } from "~/api/backend";
import { REDIRECT_KEY } from "~/config";

export const OnboardingPage = () => {
  const { t } = useTranslation();
  const patchUser = useUserStore((state) => state.patchUser);
  const navigate = useNavigate();
  const redirectKey = window.localStorage.getItem(REDIRECT_KEY);

  const updateUserMutation = useMutation({
    mutationFn: completeOnboarding,
  });

  const handleComplete = useCallback(() => {
    patchUser({
      isOnboarded: true,
    });

    if (redirectKey) {
      navigate(redirectKey);
    } else {
      navigate("/");
    }

    updateUserMutation.mutate();
  }, [updateUserMutation]);

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
        <Button size="lg" className="w-full" onClick={handleComplete}>
          Open the app
        </Button>
      </div>
    </div>
  );
};
