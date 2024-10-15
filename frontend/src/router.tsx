import { createBrowserRouter } from "react-router-dom";
import App from "./app";
import { CollectionPage } from "./pages/collections/page";
import { CollectionCreatePage } from "./pages/create/page";
import { CollectionMintPage } from "./pages/mint/page";
import { WelcomePage } from "./pages/welcome/page";
import { CollectionForm } from "./pages/create/steps/collection";
import { NftForm } from "./pages/create/steps/nft";
import { SettingsForm } from "./pages/create/steps/settings";
import { CollectionViewPage } from "./pages/view/page";
import { CollectionEditPage } from "./pages/edit/page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <CollectionPage /> },
      { path: "/welcome", element: <WelcomePage /> },
      { path: "/collections", element: <CollectionPage /> },
      {
        path: "/collections/create",
        element: <CollectionCreatePage />,
        children: [
          // Add child routes for create page here
          { path: "", element: <CollectionForm /> }, // default route for create
          { path: "nft", element: <NftForm /> },
          { path: "settings", element: <SettingsForm /> },
        ],
      },
      { path: "/collections/:collectionId", element: <CollectionViewPage /> },
      {
        path: "/collections/:collectionId/edit",
        element: <CollectionEditPage />,
      },
      {
        path: "/collections/:collectionId/mint",
        element: <CollectionMintPage />,
      },
    ],
  },
]);
