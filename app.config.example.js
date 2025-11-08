export const config = {
  public: {
    storeName: "MC STORE",
    serverIp: "play.yourserver.com",
    serverPort: 25565,
    discordLink: "https://discord.gg/yourserver",
    discordId: "YourDiscordServer",

    assets: {
      backgroundImage:
        "/attached_assets/febd862108d5aea0b5874cb846c4fca0_1762605406041.jpg",
      logo: "/template/assets/logo.png",
    },

    theme: {
      enableHalloween: false,
      enableChristmas: false,
    },

    urls: {
      completeUrl: "/success",
      cancelUrl: "/cancel",
    },

    tebex: {
      publicToken:
        process.env.VITE_TEBEX_PUBLIC_TOKEN || "your_tebex_public_token_here",
    },
  },

  private: {
    tebex: {
      privateKey:
        process.env.VITE_TEBEX_PRIVATE_KEY ||
        "your_tebex_private_key_here_keep_secret",
    },
  },
};

export default config;
