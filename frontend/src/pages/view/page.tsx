import React, { useCallback, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SocialLogo from "~/components/socia-logo";
import { useCollectionStore } from "~/db/collectionStore";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { minifyAddress } from "~/lib/utils";
import { getImageUrl } from "~/api/utils";
import { useMainButton, useMiniApp, useUtils } from "@telegram-apps/sdk-react";
import { useBack } from "~/hooks/useBack";
import { config } from "~/config";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { toast } from "~/components/ui/use-toast.ts";

import { usePublishMutation } from "./use-publish-mutation.tsx";
import { SDK } from "~/api/sdk.ts";

export function generateShareUrl(text: string = "", id: string): string {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(
    `https://t.me/${config.botName}/mint?startapp=nft-${id.toString()}`
  );

  return `https://t.me/share/url?text=${encodedText}&url=${encodedUrl}`;
}

export const CollectionViewPage: React.FC = () => {
  useBack("/");
  const { collectionId } = useParams<{ collectionId: string }>();
  const collection = useCollectionStore((state) =>
    state.getCollection(collectionId!)
  );
  const miniApp = useMiniApp();
  const mb = useMainButton();
  const navigate = useNavigate();
  const utils = useUtils();
  const [tonConnect] = useTonConnectUI();
  const userAddress = useTonAddress();
  const sdk = new SDK();

  const publishCollection = usePublishMutation();

  const handleShare = useCallback(() => {
    utils.openTelegramLink(generateShareUrl("Mint my NFT", collection?._id!));
  }, [utils, collection]);

  const handlePublish = useCallback(async () => {
    if (!collection?._id || collection.items.length === 0) return;

    if (!userAddress) {
      return tonConnect.openModal();
    }

    try {
      const payload = await sdk.publishCollection({
        tonConnect,
        userAddress,
        collectionId: collection._id,
        itemId: collection.items[0]._id!,
        price: collection.items[0].price,
        limit: collection.itemsLimit,
        startTime: collection.startTime,
        endTime: collection.endTime,
      });

      publishCollection.mutate({
        collectionId: collection?._id,
        collectionAddress: payload.address.toString(),
      });
    } catch (e) {
      console.log(e);
      toast({
        variant: "destructive",
        title: "Some error occured",
      });
    }
  }, [utils, collection]);

  useEffect(() => {
    miniApp.setHeaderColor("#2b2b2b");
  }, [miniApp]);

  useEffect(() => {
    mb.show().enable();

    if (collection?.deployed) {
      mb.setText("Share").on("click", handleShare);
    } else {
      mb.setText("Publish").on("click", handlePublish);
    }

    return () => {
      mb.hide().off("click", handleShare);
      mb.off("click", handlePublish);
    };
  }, [mb, collection, navigate, handleShare, handlePublish]);

  return (
    collection && (
      <div className="-mt-4 -mx-4">
        <header className="bg-card space-y-2 flex flex-col items-center pb-4 py-8">
          <div className="relative">
            {collection.imageUrl && (
              <img
                src={getImageUrl(collection.imageUrl)}
                className="rounded-2xl w-32 h-32 shadow-lg"
                alt={collection.name}
              />
            )}
            <img
              src={getImageUrl(collection.items[0].imageUrl)}
              className="rounded-2xl w-10 h-10 absolute -right-2 -bottom-2"
              alt={collection.items[0].name}
            />
          </div>

          <h1 className="text-2xl font-semibold">{collection.name}</h1>
          <div className="text-muted-foreground">{collection.description}</div>
          {collection && collection.links && collection.links.length > 0 && (
            <div className="flex">
              {collection.links.map((url, index) => (
                <Link to={url} target="_blank" key={index}>
                  <Badge className="flex gap-1" variant="secondary">
                    <SocialLogo className="w-4 h-4" url={url} />
                    {url}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </header>

        <section className="px-4 py-5">
          <Card>
            {collection.address && (
              <div className="flex items-center justify-between p-3 border-b border-border">
                <div className="text-muted-foreground">Address</div>
                <div>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    to={`https://tonscan.org/address/${collection.address}`}
                  >
                    {minifyAddress(collection.address)}
                  </Link>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between p-3 border-b border-border">
              <div className="text-muted-foreground">Items</div>
              <div>
                {collection.itemsLimit === 0 ? "∞" : collection.itemsLimit}
              </div>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="text-muted-foreground">Price</div>
              <div>{collection.items[0].price} TON</div>
            </div>
          </Card>
        </section>
      </div>
    )
  );
};
