import { useCollectionStore } from "~/db/collectionStore";
import { Button } from "~/components/ui/button";
import { Link } from "react-router-dom";
import { useUserStore } from "~/db/userStore";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Card } from "~/components/ui/card";
import { CollectionItem } from "./collection-item";

export const CollectionPage: React.FC = () => {
  const toncoinPrice = 6;
  const user = useUserStore((state) => state.user);
  const collections = useCollectionStore((state) => state.collections);

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
      <Button className="w-full" size="lg" asChild>
        <Link to="/collections/create">Create Collection</Link>
      </Button>
      {collections && collections.length === 0 ? (
        <div className="flex justify-center items-center h-[calc(100vh-220px)] text-gray-500">
          No collections found
        </div>
      ) : (
        <>
          <div className="text-lg font-semibold mt-6 mb-2">
            Created Collections
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
