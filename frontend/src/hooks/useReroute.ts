import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { REDIRECT_KEY } from "~/config";
import { useUserStore } from "~/db/userStore";

export const useReroute = () => {
  const navigate = useNavigate();
  const launchParams = useLaunchParams();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (launchParams.startParam) {

      if (launchParams.startParam?.includes("nft")) {
        const collectionId = launchParams.startParam.split("nft-")[1];

        console.log(user?.isOnboarded)

      //   navigate("/onboarding");
      // }
        if (user?.isOnboarded) {
          navigate(`/collections/${collectionId}/mint`);
        } else {
          window.localStorage.setItem(REDIRECT_KEY, `/collections/${collectionId}/mint`);
        }
      }
    }
  }, [user, launchParams]);
};
