import { config } from "~/config";
import { NftCollection } from "~/db/models";
import { CollectionFormData } from "~/pages/collections/create/zod";

export const createCollection = async (data: CollectionFormData) => {
  const accessToken = localStorage.getItem("accessToken");

  const formData = new FormData();

  if (data.image && data.image) {
    formData.append("image", data.image); // Append the first file
  }

  // Append collection details
  formData.append("name", data.name);
  formData.append("description", data.description);
  if (data.itemsLimit) {
    formData.append("itemsLimit", data.itemsLimit.toString());
  }

  // Append links
  if (data.links) {
    data.links.forEach((link) => formData.append("links[]", link));
  }

  // Convert dates to UTC and append them
  if (data.dateFrom) {
    const fromDateUTC = new Date(data.dateFrom).toISOString();
    formData.append("dateFrom", fromDateUTC);
  }
  if (data.dateTo) {
    const toDateUTC = new Date(data.dateTo).toISOString();
    formData.append("dateTo", toDateUTC);
  }

  // Append items details
  data.items.forEach((item, index) => {
    if (item.image && item.image) {
      formData.append(`items.image`, item.image); // Append the first file if it exists
    }
    formData.append(`items[${index}][name]`, item.name);
    formData.append(`items[${index}][description]`, item.description);
    formData.append(`items[${index}][price]`, item.price.toString());
  });

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
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error creating collection", error);
    throw error;
  }
};

export const fetchCollections = async (): Promise<NftCollection[]> => {
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

    return data as NftCollection[];
  } catch (error) {
    console.error("Error in fetchCollections:", error);
    throw error;
  }
};
