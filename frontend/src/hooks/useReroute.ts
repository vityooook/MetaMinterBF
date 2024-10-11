import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "~/db/userStore";

export const REDIRECT_KEY = "redirect-after-onboarding";

export const useReroute = () => {
  const navigate = useNavigate();
  const launchParams = useLaunchParams();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (launchParams.startParam) {
      if (launchParams.startParam?.includes("nft")) {
        
        const collectionId = launchParams.startParam.split("nft-")[1];

        navigate(`/collections/${collectionId}/mint`);

        // if (user.isOnboarded) {
          
        // } else {
        //   window.localStorage.setItem(REDIRECT_KEY, `/collections/${collectionId}/mint`);
        // }
      }
    }
  }, [user]);
};
