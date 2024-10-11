import { Globe } from "lucide-react";
import { DiscordIcon } from "../components/icons/discord";
import { FacebookIcon } from "../components/icons/facebook";
import { GithubIcon } from "../components/icons/github";
import { InstagramIcon } from "../components/icons/instagram";
import { RedditIcon } from "../components/icons/reddit";
import { TelegramIcon } from "../components/icons/telegram";
import { TiktokIcon } from "../components/icons/tiktok";
import { VkIcon } from "../components/icons/vk";
import { XIcon } from "../components/icons/x";
import { YoutubeIcon } from "../components/icons/youtube";

export const getPlatformIcon = (url: string, size: number = 5) => {
  if (url.includes("x.com")) return <XIcon className={`w-${size} h-${size}`} />;
  if (url.includes("discord.gg")) return <DiscordIcon className={`w-${size} h-${size}`} />;
  if (url.includes("t.me")) return <TelegramIcon className={`w-${size} h-${size}`} />;
  if (url.includes("instagram.com"))
    return <InstagramIcon className={`w-${size} h-${size}`} />;
  if (url.includes("youtube.com")) return <YoutubeIcon className={`w-${size} h-${size}`} />;
  if (url.includes("tiktok.com")) return <TiktokIcon className={`w-${size} h-${size}`} />;
  if (url.includes("vk.com")) return <VkIcon className={`w-${size} h-${size}`} />;
  if (url.includes("github.com")) return <GithubIcon className={`w-${size} h-${size}`} />;
  if (url.includes("facebook.com")) return <FacebookIcon className={`w-${size} h-${size}`} />;
  if (url.includes("reddit.com")) return <RedditIcon className={`w-${size} h-${size}`} />;

  return <Globe className={`w-${size} h-${size}`} />;
};

export const getPlatformTitle = (url: string) => {
  if (url.includes("x.com")) return "x.com";
  if (url.includes("discord.gg")) return "discord.gg";
  if (url.includes("t.me")) return "t.me";
  if (url.includes("instagram.com")) return "instagram.com";
  if (url.includes("youtube.com")) return "youtube.com";
  if (url.includes("tiktok.com")) return "tiktok.com";
  if (url.includes("vk.com")) return "vk.com";
  if (url.includes("github.com")) return "github.com";
  if (url.includes("facebook.com")) return "facebook.com";
  if (url.includes("reddit.com")) return "reddit.com";

  return "Link";
};
