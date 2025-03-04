import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "meet.carlosnexans.com",
          },
        ],
        destination: "https://calendly.com/nexanscarlos/30min",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
