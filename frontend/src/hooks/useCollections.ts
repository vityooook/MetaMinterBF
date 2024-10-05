import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { fetchCollections } from "~/api/backend";
import { useAuthStore } from "~/db/authStore";
import { useCollectionStore } from "~/db/collectionStore";

export const useCollections = () => {
  const setCollections = useCollectionStore((state) => state.setCollections);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isFetchingRef = useRef(false); // Ref to track if a fetch is in progress

  const { data: collections, isLoading } = useQuery({
    queryKey: ["collections", accessToken],
    queryFn: async () => {
      isFetchingRef.current = true;
      return fetchCollections();
    },
    enabled: !!accessToken && !isFetchingRef.current,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!isLoading && collections) {
      setCollections(collections);
    }
  }, [collections, isLoading, setCollections]);
};
