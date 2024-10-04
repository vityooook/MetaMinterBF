import { Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  useMiniApp,
  useThemeParams,
} from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { Toaster } from "~/components/ui/toaster";
import { useTheme } from "./providers/shadcn-provider";
import { WelcomePage } from "./pages/welcome/page";
import { CollectionPage } from "./pages/collections/page";
import { useCollections } from "./hooks/useCollections";
import { CollectionView } from "./pages/collections/view/page";
import { CollectionCreate } from "./pages/collections/create/page";

function App() {
  useAuth();
  useCollections();

  const theme = useTheme();
  const themeParams = useThemeParams();
  const miniApp = useMiniApp();

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    theme.setTheme(themeParams.isDark ? "dark" : "light");
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
        <Route path="/collections/create" element={<CollectionCreate />} />
        <Route path="/collections/:hash" element={<CollectionView />} />
      </Routes>
      <Toaster />
      
    </div>
  );
}

export default App;
