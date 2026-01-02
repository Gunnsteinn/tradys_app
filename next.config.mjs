/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.ignoreWarnings = [{ module: /sequelize/ }];
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["sequelize", "sequelize-typescript", "pg", "pg-hstore"],
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

export default nextConfig;
