import React, { useCallback, useEffect } from "react";
import { useBack } from "~/hooks/useBack";
import { Vortex } from "~/components/ui/vortex";
import { useNavigate, useParams } from "react-router-dom";
import { useMainButton } from "@telegram-apps/sdk-react";
import LogoSvg from "~/assets/images/metaming-logo.svg";

export const CollectionMintedPage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const mb = useMainButton();
  const navigate = useNavigate();

  useBack(`/collections/${collectionId}/mint`);

  const handleBack = useCallback(() => {
    navigate(`/collections/${collectionId}/mint`);
  }, [navigate]);

  useEffect(() => {
    mb.show().enable();
    mb.setText("Back to NFT").on("click", handleBack);

    return () => {
      mb.hide().off("click", handleBack);
    };
  }, [mb, navigate, handleBack]);

  return (
    <main className="-my-4">
      <Vortex
        baseHue={130}
        className="h-dvh w-full flex flex-col justify-center items-center"
      >
        <header className="py-8">
          <img src={LogoSvg} alt="" className="h-8" />
        </header>
        <section className="mt-auto text-center pb-8 space-y-1">
          <h1 className="text-3xl font-bold">NFT is minted</h1>
          <p className="text-muted-foreground">
            Soon it will appear in your wallet
          </p>
        </section>
      </Vortex>
    </main>
  );
};
