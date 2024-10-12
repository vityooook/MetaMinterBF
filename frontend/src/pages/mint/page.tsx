import { useQuery } from "@tanstack/react-query";
import { useMiniApp, useMainButton, useUtils } from "@telegram-apps/sdk-react";
import { address } from "@ton/core";
import {
  useTonAddress,
  useTonConnectUI,
  TonConnectButton,
} from "@tonconnect/ui-react";
import { Loader2, ShareIcon, XIcon } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchCollectionById } from "~/api/backend";
import { Countdown } from "~/components/countdown";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { toast } from "~/components/ui/use-toast";
import { CollectionContract } from "~/contracts/collection";
import { useBack } from "~/hooks/useBack";
import { getPlatformIcon, getPlatformTitle } from "~/lib/social-utils";
import { minifyAddress } from "~/lib/utils";
import { generateShareUrl } from "../view/page";
import { QuantityField } from "./ui/quantity-field";
import { Badge } from "~/components/ui/badge";
import { ConfirmMint } from "./steps/confirm";

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
  const collectionContract = new CollectionContract();
  const [isMinting, setIsMinting] = useState<boolean>(false);

  const isBeforeStartTime = collection?.startTime
    ? new Date(collection.startTime) > new Date()
    : false;

  const { data: collectionData } = useQuery({
    queryKey: ["collectionData"],
    queryFn: async () => {
      return await collectionContract.getData(address(collection?.address!));
    },
    enabled: !!collection,
  });

  const handleShare = useCallback(() => {
    utils.openTelegramLink(generateShareUrl("Mint my NFT", collection?._id!));
  }, [utils, collection]);

  const handleMint = useCallback(async () => {
    setIsMinting(true);

    if (!userAddress) {
      return tonConnect.openModal();
    }

    if (!collection?.address) {
      toast({
        variant: "destructive",
        title: "Collection is not deployed yet",
      });
    }

    try {
      await collectionContract.mint({
        tonConnect,
        userAddress,
        collectionAddress: collection?.address!,
        quantity,
        price: collection?.nftPrice!,
      });
    } catch (e) {
      console.log(e);
    }

    setIsMinting(false);
  }, [utils, collection]);

  useEffect(() => {
    miniApp.setHeaderColor("#2b2b2b");
  }, [miniApp]);

  useEffect(() => {
    const onMint = handleMint;

    if (userAddress && !isBeforeStartTime) {
      mb.show();

      if (quantity === 0) {
        mb.disable();
      } else {
        mb.enable();
      }

      if (collection?.deployed) {
        mb.setText("Mint NFT").on("click", onMint);
      } else {
        mb.hide();
      }
    } else {
      mb.hide();
    }

    return () => {
      mb.hide().off("click", onMint);
    };
  }, [mb, collection, userAddress, collection, handleMint]);

  useEffect(() => {
    if (isMinting || isBeforeStartTime) {
      mb.hide();
    }
  }, [isMinting, isBeforeStartTime]);

  return isMinting ? (
    <ConfirmMint />
  ) : collection ? (
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
          {collection.image && (
            <img
              src={collection.image}
              className="rounded-2xl w-32 h-32 shadow-lg bg-background"
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

        {collection.links?.length > 0 && (
          <div className="flex gap-2">
            {collection.links?.map((url, index) =>
              url ? (
                <Link to={url} target="_blank" key={index}>
                  <Badge className="flex gap-2 px-1.5" variant="secondary">
                    {getPlatformIcon(url, 4)}
                    {getPlatformTitle(url)}
                  </Badge>
                </Link>
              ) : null
            )}
          </div>
        )}
      </header>

      {isBeforeStartTime ? (
        <>
          <section className="flex flex-col items-center pt-10">
            <div className="flex gap-3">
              <Countdown
                time={collection.startTime!}
                className="text-primary italic text-5xl font-bold tracking-tighter"
              />
            </div>
          </section>
          <section className="mt-auto text-center mb-10">
            <p className="text-2xl">Mint will start soon</p>
            <p className="text-muted-foreground">Please wait...</p>
          </section>
        </>
      ) : (
        <>
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
                <div className="text-muted-foreground">Total Minted</div>
                <div>
                  {collectionData?.totalMinted || 0} /{" "}
                  {collection.itemsLimit === 0 ? "∞" : collection.itemsLimit}
                </div>
              </div>
              <div className="flex items-center justify-between p-3">
                <div className="text-muted-foreground">Price</div>
                <div>{collection.nftPrice} TON</div>
              </div>
              {collection.endTime && (
                <div className="flex items-center justify-between p-3">
                  <div className="text-muted-foreground">Time Left</div>
                  <div>
                    <Countdown time={collection.endTime} />
                  </div>
                </div>
              )}
            </Card>
          </section>
          {userAddress && (
            <QuantityField
              nftPrice={collection.nftPrice}
              onQuantityChange={(value) => setQuantity(value)}
            />
          )}
          {!userAddress && (
            <section className="flex flex-col text-center items-center gap-4 mt-auto pb-16">
              <p className="text-muted-foreground text-sm px-24">
                To make a purchase, you need to connect a TON wallet.
              </p>
              <TonConnectButton />
            </section>
          )}
        </>
      )}
    </div>
  ) : (
    <div className="h-dvh flex items-center justify-center">
      <Loader2 className="animate-spin w-5 h-5" />
    </div>
  );
};
