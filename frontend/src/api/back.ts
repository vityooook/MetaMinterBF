import { config } from "~/config";
import { NftCollectionDto } from "~/db/dto";
import { CollectionFormData } from "~/pages/collections/create/zod";

export const createCollection = async (data: CollectionFormData) => {
  const accessToken = localStorage.getItem("accessToken");

  const formData = new FormData();

  if (data.collectionImage && data.collectionImage.length > 0) {
    formData.append("collectionImage", data.collectionImage[0]); // Append the first file
  }

  formData.append("collectionName", data.collectionName);
  formData.append("collectionDescription", data.collectionDescription);
  formData.append("itemsLimit", data.itemsLimit.toString());
  formData.append("itemPrice", data.itemPrice.toString());

  data.links.forEach((link) => formData.append("links[]", link));

  if (data.itemImage && data.itemImage.length > 0) {
    formData.append("itemImage", data.itemImage[0]); // Append the first file if it exists
  }
  formData.append("itemName", data.itemName);
  formData.append("itemDescription", data.itemDescription);

  try {
    const response = await fetch(`${config.apiUrl}/api/collections/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching events", error);
    throw error;
  }
};

export const fetchCollections = async (): Promise<NftCollectionDto[]> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${config.apiUrl}/api/collections`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data as NftCollectionDto[];
  } catch (error) {
    console.error("Error in fetchCollections:", error);
    throw error;
  }
};
