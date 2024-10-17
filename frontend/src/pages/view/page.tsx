import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card } from "~/components/ui/card";
import { cn, formatDateToLocal, minifyAddress } from "~/lib/utils";
import { useMainButton, useMiniApp, useUtils } from "@telegram-apps/sdk-react";
import { useBack } from "~/hooks/useBack";
import { config } from "~/config";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { toast } from "~/components/ui/use-toast.ts";
import { useCollectionStore } from "~/db/collectionStore";
import { Badge } from "~/components/ui/badge";
import { CollectionContract } from "~/contracts/collection";
import { useDeployMutation } from "../../hooks/useDeployMutation";
import { ConfirmDeploy } from "./steps/confirm";
import { getPlatformTitle, getPlatformIcon } from "~/lib/social-utils";
import { Button } from "~/components/ui/button";

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
    if (!userAddress && tonConnect.modalState.status !== "opened") {
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

  // const handleDeclineOwnership = useCallback(() => {}, []);

  useEffect(() => {
    miniApp.setHeaderColor("#2b2b2b");
  }, [miniApp]);

  useEffect(() => {
    const onShare = handleShare;

    if (collection?.deployed) {
      mb.show().enable().setText("Share Collection").on("click", onShare);
    }

    return () => {
      mb.hide().off("click", onShare);
    };
  }, [mb, collection, handleShare]);

  useEffect(() => {
    const onDeploy = handleDeploy;

    if (collection?.deployed) {
      mb.hide().off("click", onDeploy);
      return;
    }

    mb.show()
      .enable()
      .setText(userAddress ? "Deploy (0.3 TON)" : "Connect Wallet")
      .on("click", onDeploy);

    return () => {
      mb.hide().off("click", onDeploy);
    };
  }, [mb, collection, userAddress, handleDeploy]);

  useEffect(() => {
    if (isDeploying) {
      mb.hide();
    } else {
      mb.show();
    }
  }, [isDeploying]);

  return isDeploying ? (
    <ConfirmDeploy />
  ) : (
    collection && (
      <div className={cn('-mt-4 -mx-4', !collection.deployed && 'pb-4')}>
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
            <div className="flex gap-2">
              {collection.links?.map((url, index) =>
                url ? (
                  <Link to={url} target="_blank" key={index}>
                    <Badge className="flex gap-2 px-1.5" variant="secondary">
                      {getPlatformIcon(url, 4)}
                      {getPlatformTitle(url)}
                    </Badge>
                  </Link>
                ) : (
                  <></>
                )
              )}
            </div>
          )}
        </header>

        <section className="px-4 py-5 space-y-2">
          <Card>
            {collection.startTime && (
              <div className="flex items-center justify-between p-3 border-b border-border">
                <div className="text-muted-foreground">Start Time</div>
                <div>{formatDateToLocal(collection.startTime)}</div>
              </div>
            )}
            {collection.endTime && (
              <div className="flex items-center justify-between p-3 border-b border-border">
                <div className="text-muted-foreground">End Time</div>
                <div>{formatDateToLocal(collection.endTime)}</div>
              </div>
            )}
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
          <Button className="bg-card w-full" asChild>
            <Link to="edit">Edit collection</Link>
          </Button>
          {/* <div className="space-y-1">
            <ConfirmButton onClick={handleDeclineOwnership}>
              Decline ownership
            </ConfirmButton>
            <p className="text-sm px-8 text-center">
              Нажмите на кнопку три раза подряд, чтобы подтвердить свой выбор
            </p>
          </div> */}
          {!collection.deployed && <p className="text-xs bg-background text-muted-foreground text-center p-2 px-6 fixed bottom-0 left-0 right-0">Commissions: 0.3 TON to deploy a collection <br /> and 0.1 TON per mint.</p> }
        </section>
      </div>
    )
  );
};
