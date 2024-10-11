import React from "react";
import { Vortex } from "~/components/ui/vortex";
import LogoSvg from "~/assets/images/metaming-logo.svg";

export const ConfirmDeploy: React.FC = () => {
  return (
    <main className="-my-4">
      <Vortex
        baseHue={80}
        className="h-dvh w-full flex flex-col justify-center items-center"
      >
        <header className="py-8">
          <img src={LogoSvg} alt="" className="h-8" />
        </header>
        <section className="mt-auto text-center pb-8 space-y-1">
          <h1 className="text-3xl font-bold">Confirm action in your wallet</h1>
          <p className="text-muted-foreground">
            You will have one minute to sign the transaction. If it takes
            longer, the transaction will be canceled.
          </p>
        </section>
      </Vortex>
    </main>
  );
};
