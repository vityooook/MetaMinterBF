import { useCollectionStore } from "~/db/collectionStore";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "~/db/userStore";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Card } from "~/components/ui/card";
import { CollectionItem } from "./collection-item";
import { useCallback, useEffect } from "react";
import { useBackButton, useMainButton } from "@telegram-apps/sdk-react";

export const CollectionPage: React.FC = () => {
  const toncoinPrice = 6;
  const user = useUserStore((state) => state.user);
  const collections = useCollectionStore((state) => state.collections);
  const bb = useBackButton();
  const mb = useMainButton();
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate("/collections/create");
  }, [navigate]);

  useEffect(() => {
    mb.show().enable().setText("Create Collection").on("click", handleClick);
    bb.hide();

    return () => {
      mb.hide().off("click", handleClick);
    };
  }, [mb, bb]);

  return (
    <>
      <header className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <img
            src={`https://unavatar.io/telegram/${user.username}`}
            className="w-8 h-8 border-2 border-primary rounded-full"
            alt=""
          />
          <div className="font-medium text-lg">@{user.username}</div>
        </div>
        <div className="[&_button]:bg-card [&_button_div]:text-card-foreground">
          <TonConnectButton />
        </div>
      </header>
      {collections && collections.length === 0 ? (
        <div className="flex justify-center items-center h-[calc(100vh-220px)] text-gray-500">
          No collections found
        </div>
      ) : (
        <>
          <div className="text-lg font-semibold mb-2">
            My collections
          </div>
          <Card>
            {collections?.map((collection, index) => (
              <CollectionItem
                key={index}
                collection={collection}
                toncoinPrice={toncoinPrice || 0}
              />
            ))}
          </Card>
        </>
      )}
    </>
  );
};
