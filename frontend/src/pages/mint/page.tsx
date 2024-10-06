import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SocialLogo from "~/components/socia-logo";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { minifyAddress } from "~/lib/utils";
import { getImageUrl } from "~/api/utils";
import { useMainButton, useMiniApp, useUtils } from "@telegram-apps/sdk-react";
import { useBack } from "~/hooks/useBack";
import { config } from "~/config";
import { Button } from "~/components/ui/button";
import { MinusIcon, PlusIcon, ShareIcon, XIcon } from "lucide-react";
import {
  TonConnectButton,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { Input } from "~/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { fetchCollectionById } from "~/api/backend";
import { Footer } from "~/components/footer";
import { toast } from "~/components/ui/use-toast";
import { SDK } from "~/api/sdk";

export function generateShareUrl(text: string = "", id: string): string {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(
    `https://t.me/${config.botName}/app?startapp=nft-${id.toString()}`
  );

  return `https://t.me/share/url?text=${encodedText}&url=${encodedUrl}`;
}

export const CollectionMintPage: React.FC = () => {
  useBack("/");
  const { collectionId } = useParams<{ collectionId: string }>();

  const { data: collection } = useQuery({
    queryKey: ["collections", collectionId],
    queryFn: async () => {
      return await fetchCollectionById(collectionId!);
    },
    enabled: !!collectionId,
  });
  const miniApp = useMiniApp();
  const mb = useMainButton();
  const navigate = useNavigate();
  const utils = useUtils();
  const userAddress = useTonAddress();
  const [quantity, setQuantity] = useState(1);
  const [tonConnect] = useTonConnectUI();
  const sdk = new SDK();

  const handleShare = useCallback(() => {
    utils.openTelegramLink(generateShareUrl("Mint my NFT", collection?._id!));
  }, [utils, collection]);

  const handleBuy = useCallback(async () => {
    if (!userAddress) {
      tonConnect.openModal();
    }

    if (!collection?.address) {
      toast({
        variant: "destructive",
        title: "Collection is not deployed yet",
      });
    }

    try {
      await sdk.mintNft({
        tonConnect,
        userAddress,
        collectionAddress: collection?.address!,
        quantity,
        price: collection?.items[0].price!,
      });

      navigate(`/collections/${collectionId}/minted`);
    } catch (e) {
      console.log(e);
    }
  }, [utils, collection]);

  useEffect(() => {
    miniApp.setHeaderColor("#2b2b2b");
  }, [miniApp]);

  useEffect(() => {
    if (userAddress) {
      mb.show().enable();

      if (collection?.deployed) {
        mb.setText("Mint NFT").on("click", handleBuy);
      }
    }

    return () => {
      mb.hide().off("click", handleBuy);
    };
  }, [mb, collection, userAddress, navigate, handleShare]);

  return (
    collection && (
      <div className="-my-4 -mx-4 relative min-h-dvh flex flex-col pb-4">
        <Button
          onClick={handleShare}
          size="icon"
          variant="ghost"
          className="absolute top-4 left-4 bg-background"
        >
          <ShareIcon className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => navigate("/")}
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 bg-background"
        >
          <XIcon className="w-5 h-5" />
        </Button>

        <header className="bg-card space-y-2 flex flex-col items-center pb-4 py-8">
          <div className="relative">
            {collection.imageUrl && (
              <img
                src={getImageUrl(collection.imageUrl)}
                className="rounded-2xl w-32 h-32 shadow-lg bg-background"
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
        {userAddress && (
          <div className="flex items-center px-20">
            <Button
              onClick={() => setQuantity(Number(quantity) - 1)}
              size="icon"
              variant="ghost"
              className=" bg-card min-w-10"
            >
              <MinusIcon className="w-5 h-5" />
            </Button>
            <div className="flex items-center flex-col gap-1">
              <Input
                onChange={(e) => setQuantity(e.target.value as any)}
                value={quantity}
                className="bg-transparent border-none text-4xl text-center"
              />
              <span className="text-muted-foreground">
                {collection.items[0].price * quantity} TON
              </span>
            </div>
            <Button
              onClick={() => setQuantity(Number(quantity) + 1)}
              size="icon"
              variant="ghost"
              className=" bg-card min-w-10"
            >
              <PlusIcon className="w-5 h-5" />
            </Button>
          </div>
        )}
        {!userAddress && (
          <section className="flex flex-col text-center items-center gap-4 mt-auto pb-16">
            <p className="text-muted-foreground text-sm px-24">
              To make a purchase, you need to connect a TON wallet.
            </p>
            <TonConnectButton />
          </section>
        )}
        <Footer />
      </div>
    )
  );
};
