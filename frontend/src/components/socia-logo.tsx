import GlobeDefault from "~/assets/icons/socials/GlobeDefault.svg";
import TelegramLogo from "~/assets/icons/socials/TelegramLogo.svg";
import DiscordLogo from "~/assets/icons/socials/DiscordLogo.svg";
import FacebookLogo from "~/assets/icons/socials/FacebookLogo.svg";
import InstagramLogo from "~/assets/icons/socials/InstagramLogo.svg";
import RedditLogo from "~/assets/icons/socials/RedditLogo.svg";
import TikTokLogo from "~/assets/icons/socials/TikTokLogo.svg";
import VKLogo from "~/assets/icons/socials/VKLogo.svg";
import YoutubeLogo from "~/assets/icons/socials/YoutubeLogo.svg";
import GithubLogo from "~/assets/icons/socials/GithubLogo.svg";

const linksMap: {
  [key in string]: any;
} = {
  "t.me": TelegramLogo,
  "telegram.org": TelegramLogo,
  "discord.com": DiscordLogo,
  "discord.gg": DiscordLogo,
  "facebook.com": FacebookLogo,
  "instagram.com": InstagramLogo,
  "reddit.com": RedditLogo,
  "youtube.com": YoutubeLogo,
  "youtu.be": YoutubeLogo,
  "vk.com": VKLogo,
  "tiktok.com": TikTokLogo,
  "github.com": GithubLogo,
};

const SocialLogo = ({ url = "", className }: {
    className: string, 
    url: string
}) => {
  const getIcon = () => {
    if (!url) return GlobeDefault;

    for (const key in linksMap) {
      if (url.includes(key)) return linksMap[key];
    }

    return GlobeDefault;
  };


  return <img src={getIcon()} className={className} />;
};

export default SocialLogo;
