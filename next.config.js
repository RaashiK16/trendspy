/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
      serverComponentsExternalPackages: ['mongoose']
    },
    images: {
      domains: ['m.media-amazon.com']
    },
    webpack:(config)=>{
      config,module.rules.push({
        test:/\mjs$/,
        include: /node_modules/,
        type:"javascript/auto",
      })
    }
  }
  
  module.exports = nextConfig