import React from "react";
import { Vortex } from "~/components/ui/vortex";
import LogoSvg from "~/assets/images/metaming-logo.svg";
import { useTheme } from "~/providers/shadcn-provider";
import { Button } from "~/components/ui/button";

export const ConfirmDeploy: React.FC<{
  onCancel: () => void;
}> = ({ onCancel }) => {
  const theme = useTheme();

  return (
    <main className="-my-4">
      <div className="absolute z-[1] top-0 left-0 right-0 bottom-40">
        <Vortex
          baseHue={140}
          backgroundColor={theme.theme === "dark" ? "#000000" : "#ffffff"}
        ></Vortex>
      </div>
      <div className="relative z-[2] h-dvh flex flex-col pb-12 px-2 justify-between items-center">
        <header className="py-8">
          <img src={LogoSvg} alt="" className="h-8" />
        </header>
        <section className="mt-auto text-center pb-8 space-y-4">
          <h1 className="text-3xl font-bold">
            Confirm edit <br /> in your wallet
          </h1>
          <p className="text-muted-foreground">
            Sign transaction in you wallet to edit collection. You will have
            90 seconds.
          </p>
        </section>
        <Button variant="outline" onClick={onCancel} className="w-full">
          Cancel
        </Button>
      </div>
    </main>
  );
};
