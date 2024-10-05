import { Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  useMainButton,
  useMiniApp,
  useThemeParams,
} from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { Toaster } from "~/components/ui/toaster";
import { useTheme } from "./providers/shadcn-provider";
import { WelcomePage } from "./pages/welcome/page";
import { CollectionPage } from "./pages/collections/page";
import { useCollections } from "./hooks/useCollections";
import { CollectionCreatePage } from "./pages/collections/create/page";
import { CollectionMintPage } from "./pages/collections/mint/page";
import { CollectionViewPage } from "./pages/collections/view/page";
import { CollectionMintedPage } from "./pages/collections/mint/minted/page";

function App() {
  useAuth();
  useCollections();

  const theme = useTheme();
  const themeParams = useThemeParams();
  const miniApp = useMiniApp();
  const mb = useMainButton();

  useEffect(() => {
    mb.setBgColor('#20d2df').setTextColor('#000000')
  }, [mb])

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    theme.setTheme(themeParams.isDark ? "dark" : "light");
    miniApp.setBgColor('#1F1F1F')
    miniApp.setHeaderColor(themeParams.isDark ? "#000000" : "#ffffff");
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    document.documentElement.classList.add("twa");
    miniApp.ready();
    miniApp.requestWriteAccess();
  }, []);

  return (
    <div className="container max-w-xl py-4">
      <Routes>
        <Route path="/" element={<CollectionPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/collections" element={<CollectionPage />} />
        <Route path="/collections/create" element={<CollectionCreatePage />} />
        <Route path="/collections/:collectionId/" element={<CollectionViewPage />} />
        <Route path="/collections/:collectionId/mint" element={<CollectionMintPage />} />
        <Route path="/collections/:collectionId/minted" element={<CollectionMintedPage />} />
      </Routes>
      <Toaster />
      
    </div>
  );
}

export default App;
