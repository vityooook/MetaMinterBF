import { config } from "~/config";
import { CollectionModel, UploadedImageModel } from "~/db/models";
import {
  CollectionFormData,
  EditCollectionFormData,
  PublishCollectionFormData,
} from "~/db/zod";

export const createCollection = async (
  formData: CollectionFormData
): Promise<CollectionModel> => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${config.apiUrl}/api/collections/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...formData,
        startTime: formData.startTime
          ? new Date(formData.startTime).toISOString()
          : "",
        endTime: formData.endTime
          ? new Date(formData.endTime).toISOString()
          : "",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    return data as CollectionModel;
  } catch (error) {
    console.error("Error creating collection", error);
    throw error;
  }
};

export const editCollection = async (
  formData: EditCollectionFormData
): Promise<CollectionModel> => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${config.apiUrl}/api/collections/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...formData,
        startTime: formData.startTime
          ? new Date(formData.startTime).toISOString()
          : "",
        endTime: formData.endTime
          ? new Date(formData.endTime).toISOString()
          : "",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    return data as CollectionModel;
  } catch (error) {
    console.error("Error editing collection", error);
    throw error;
  }
};

export const publishCollection = async (
  data: PublishCollectionFormData
): Promise<CollectionModel> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${config.apiUrl}/api/collections/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchCollections:", error);
    throw error;
  }
};

export const fetchCollections = async (): Promise<CollectionModel[]> => {
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

    return data as CollectionModel[];
  } catch (error) {
    console.error("Error in fetchCollections:", error);
    throw error;
  }
};

export const uploadImage = async (file: File): Promise<UploadedImageModel> => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${config.apiUrl}/api/upload/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data as UploadedImageModel;
  } catch (error) {
    console.error("Error in fetchCollections:", error);
    throw error;
  }
};

export const fetchCollectionById = async (
  collectionId: string
): Promise<CollectionModel> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(
      `${config.apiUrl}/api/collections/${collectionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data as CollectionModel;
  } catch (error) {
    console.error("Error in fetchCollections:", error);
    throw error;
  }
};
