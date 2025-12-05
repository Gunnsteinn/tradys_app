module.exports = {
  webpack: (config) => {
    config.ignoreWarnings = [{ module: /sequelize/ }];
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.tradysargentina.com.ar",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};
