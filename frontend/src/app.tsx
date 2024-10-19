import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  useMainButton,
  useMiniApp,
  useThemeParams,
  useViewport,
} from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { Toaster } from "~/components/ui/toaster";
import { useTheme } from "./providers/shadcn-provider";
import { useCollections } from "./hooks/useCollections";
import { useReroute } from "./hooks/useReroute";
// import { useWalletAuth } from "~/hooks/useWalletAuth.tsx";
import { useUserStore } from "./db/userStore";
import { useTonAddress } from "@tonconnect/ui-react";
import { useMutation } from "@tanstack/react-query";
import { addWalletAddress } from "./api/backend";

function App() {
  useAuth();
  useReroute();
  // useWalletAuth();
  useCollections();

  const theme = useTheme();
  const themeParams = useThemeParams();
  const miniApp = useMiniApp();
  const mb = useMainButton();
  const viewport = useViewport();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const isUserLoading = useUserStore((state) => state.isLoading);
  const userAddress = useTonAddress();

  const walletAddressMutation = useMutation({
    mutationKey: ["walletAddress"],
    mutationFn: addWalletAddress,
  });

  useEffect(() => {
    mb.setBgColor("#20d2df").setTextColor("#000000");
  }, [mb]);

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    theme.setTheme(themeParams.isDark ? "dark" : "light");
    miniApp.setBgColor("#1F1F1F");
    miniApp.setHeaderColor(themeParams.isDark ? "#000000" : "#ffffff");
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    document.documentElement.classList.add("twa");
    miniApp.ready();
    miniApp.requestWriteAccess();
  }, []);

  useEffect(() => {
    viewport?.expand();
  }, [viewport]);

  useEffect(() => {
    if (!user.isOnboarded && !isUserLoading) {
      navigate("/onboarding");
    }
  }, [user.isOnboarded, isUserLoading]);

  useEffect(() => {
    if (userAddress && user.walletAddress !== userAddress && !isUserLoading) {
      walletAddressMutation.mutate(userAddress);
    }
  }, [userAddress, isUserLoading]);

  return (
    <div className="container max-w-xl py-4">
      <Outlet />
      <Toaster />
    </div>
  );
}

export default App;
