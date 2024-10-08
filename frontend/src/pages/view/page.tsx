import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card } from "~/components/ui/card";
import { minifyAddress } from "~/lib/utils";
import { useMainButton, useMiniApp, useUtils } from "@telegram-apps/sdk-react";
import { useBack } from "~/hooks/useBack";
import { config } from "~/config";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { toast } from "~/components/ui/use-toast.ts";
import { useCollectionStore } from "~/db/collectionStore";
import { Badge } from "~/components/ui/badge";
import SocialLogo from "~/components/socia-logo";
import { CollectionContract } from "~/contracts/collection";
import { useDeployMutation } from "../create/hooks/useDeployMutation";

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
  const miniApp = useMiniApp();
  const mb = useMainButton();
  const navigate = useNavigate();
  const utils = useUtils();
  const [tonConnect] = useTonConnectUI();
  const userAddress = useTonAddress();
  const collectionContract = new CollectionContract();
  const deployCollection = useDeployMutation();
  const collection = useCollectionStore((state) =>
    state.getCollection(collectionId!)
  );
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = useCallback(async () => {
    if (!userAddress) {
      return tonConnect.openModal();
    }

    if (!collection) {
      return;
    }

    setIsDeploying(true);

    try {
      const payload = await collectionContract.deploy({
        tonConnect,
        userAddress,
        collection,
      });

      await deployCollection.mutateAsync({
        id: collection?._id,
        address: payload.address.toString(),
      });
    } catch (e) {
      console.log(e);
      toast({
        variant: "destructive",
        title: "Some error occured",
      });
    }

    setIsDeploying(false);
  }, [utils]);

  const handleShare = useCallback(() => {
    utils.openTelegramLink(generateShareUrl("Mint my NFT", collection?._id!));
  }, [utils, collection]);

  useEffect(() => {
    miniApp.setHeaderColor("#2b2b2b");
  }, [miniApp]);

  useEffect(() => {
    if (isDeploying) {
      mb.disable().setText("Deploying");
    } else {
      mb.enable().setText("Deploy Collection");
    }
  }, [mb, isDeploying]);

  useEffect(() => {
    mb.show().enable();

    if (collection?.deployed) {
      mb.setText("Share Collection").on("click", handleShare);
    } else {
      mb.setText("Deploy Collection").on("click", handleDeploy);
    }

    return () => {
      mb.hide().off("click", handleShare);
      mb.off("click", handleDeploy);
    };
  }, [mb, collection, navigate, handleShare, handleDeploy]);

  return (
    collection && (
      <div className="-mt-4 -mx-4">
        <header className="bg-card space-y-2 flex flex-col items-center pb-4 py-8">
          <div className="relative">
            {collection.image && (
              <img
                src={collection.image}
                className="rounded-2xl w-32 h-32 shadow-lg"
                alt={collection.name}
              />
            )}
            <img
              src={collection.nfts[0].image}
              className="rounded-2xl w-10 h-10 absolute -right-2 -bottom-2"
              alt={collection.nfts[0].name}
            />
          </div>

          <h1 className="text-2xl font-semibold">{collection.name}</h1>
          <div className="text-muted-foreground">{collection.description}</div>
          {collection && collection.links && collection.links.length > 0 && (
            <div className="flex">
              {collection.links?.map((url, index) =>
                url ? (
                  <Link to={url} target="_blank" key={index}>
                    <Badge className="flex gap-1" variant="secondary">
                      <SocialLogo className="w-4 h-4" url={url} />
                      {url}
                    </Badge>
                  </Link>
                ) : (
                  <></>
                )
              )}
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
              <div>{collection.nftPrice} TON</div>
            </div>
          </Card>
        </section>
      </div>
    )
  );
};
