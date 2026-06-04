import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: isProd ? "export" : undefined,
  basePath: isProd ? "/portfolio" : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
