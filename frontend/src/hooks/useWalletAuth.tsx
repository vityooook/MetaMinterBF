import { useCallback, useEffect, useRef } from "react";
import { ConnectedWallet, useTonConnectUI } from "@tonconnect/ui-react";
import { useInterval } from "~/hooks/useInterval.tsx";
import { BackendAuth } from "~/api/backend-auth.ts";

export const useWalletAuth = () => {
  const firstProofLoading = useRef<boolean>(true);
  const [tonConnectUI] = useTonConnectUI();

  const recreateProofPayload = useCallback(async () => {
    if (firstProofLoading.current) {
      tonConnectUI.setConnectRequestParameters({ state: "loading" });
      firstProofLoading.current = false;
    }

    try {
      const payload = await BackendAuth.generatePayload();

      if (payload) {
        tonConnectUI.setConnectRequestParameters({
          state: "ready",
          value: {
            tonProof: payload,
          },
        });
      } else {
        tonConnectUI.setConnectRequestParameters(null);
      }
    } catch (error) {
      console.error("Error generating payload:", error);
      tonConnectUI.setConnectRequestParameters(null);
    }
  }, [tonConnectUI]);

  useEffect(() => {
    if (firstProofLoading.current) {
      recreateProofPayload();
    }
  }, [recreateProofPayload]);

  useInterval(recreateProofPayload, BackendAuth.refreshIntervalMs);

  useEffect(() => {
    const handleStatusChange = async (wallet: ConnectedWallet | null) => {
      if (!wallet) {
        BackendAuth.reset();
        return;
      }

      if (
        wallet.connectItems?.tonProof &&
        "proof" in wallet.connectItems.tonProof
      ) {
        const isProofValid = await BackendAuth.checkProof(
          wallet.connectItems.tonProof.proof,
          wallet.account,
        );

        if (isProofValid) {
          BackendAuth.authorized = true;
        } else {
          tonConnectUI.disconnect();
          BackendAuth.authorized = false;
          console.log("Not authorized, no access token");
        }
      } else {
        BackendAuth.authorized = true;
      }
    };

    tonConnectUI.onStatusChange(handleStatusChange);
  }, [tonConnectUI]);
};
