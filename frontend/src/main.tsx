import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { TmaProvider } from "./providers/tma-provider.tsx";
import { QueryProvider } from "./providers/query-provider.tsx";

import "./globals.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.ts";
import { ThemeProvider } from "./providers/shadcn-provider.tsx";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { config } from "./config.ts";
import { router } from "./router.tsx";

export const Root = () => {
  return (
    <TonConnectUIProvider
      manifestUrl={`https://raw.githubusercontent.com/kirillmelcin96/test/refs/heads/main/manifest.json`}
      actionsConfiguration={{
        twaReturnUrl: `https://t.me/${config.botName}/app`,
      }}
    >
      <ThemeProvider defaultTheme="dark" storageKey="shadcn-ui-theme">
        <QueryProvider>
          <TmaProvider>
            <I18nextProvider i18n={i18n}>
              <RouterProvider router={router} />
            </I18nextProvider>
          </TmaProvider>
        </QueryProvider>
      </ThemeProvider>
    </TonConnectUIProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
