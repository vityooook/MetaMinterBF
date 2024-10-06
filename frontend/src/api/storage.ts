import { config } from "~/config";

export function getImageUrl(imageUrl: string) {
    return `${config.apiUrl}/${imageUrl}`;
}