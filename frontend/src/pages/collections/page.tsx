import { useCollectionStore } from "~/db/collectionStore";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "~/db/userStore";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Card } from "~/components/ui/card";
import { CollectionItem } from "./collection-item";
import { useCallback, useEffect } from "react";
import { useBackButton } from "@telegram-apps/sdk-react";
import { Button } from "~/components/ui/button";
import { Footer } from "~/components/footer";
import LogoSvg from "~/assets/images/metaming-logo.svg";

export const CollectionPage: React.FC = () => {
  const toncoinPrice = 6;
  const user = useUserStore((state) => state.user);
  const collections = useCollectionStore((state) => state.collections);
  const bb = useBackButton();
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate("/collections/create");
  }, [navigate]);

  useEffect(() => {
    bb.hide();
  }, [bb]);

  return (
    <div className="h-dvh flex flex-col -my-4 py-4">
      <header className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <img src={LogoSvg} alt="MetaMinter" className="h-6" />
        </div>
        <div className="flex items-center gap-2">
          <img
            src={`https://unavatar.io/telegram/${user.username}`}
            className="w-8 h-8 border-2 border-primary rounded-full"
            alt=""
          />
          <div className="[&_button]:bg-card [&_button_div]:text-card-foreground">
            <TonConnectButton />
          </div>
        </div>
      </header>
      <Button size="lg" onClick={handleClick} className="w-full">
        Create Collection
      </Button>
      {collections && collections.length === 0 ? (
        <div className="flex-1 flex justify-center items-center text-gray-500">
          No collections found
        </div>
      ) : (
        <>
          <div className="text-lg font-semibold mb-2">Created Collections</div>
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
      <Footer />
    </div>
  );
};
