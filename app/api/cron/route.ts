"use server"
import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose"
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { NextResponse } from "next/server";

const maxDuration = 60;
const dynamic = "force-dynamic"
const revalidate = 0;

export async function GET() {
    try {
        await connectToDB();
        const products = await Product.find({});
        if (!products)
            throw new Error("No products found");

        // 1. SCRAPE LATEST PRODUCT DETAILS AND UPDATE DB
        const updatedProducts = await Promise.all(
            products.map(async (currentProduct) => {
                const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
                if (!scrapedProduct)
                    throw new Error("No product found");

                const updatedPriceHistory = [
                    ...currentProduct.priceHistory,
                    { price: scrapedProduct.currentPrice }
                ]

                const product = {
                    ...scrapedProduct,
                    priceHistory: updatedPriceHistory,
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory)
                }

                const updatedProduct = await Product.findOneAndUpdate(
                    { url: product.url },
                    product,
                    { new: true }
                );

                // 2. CHECK EACH PRODUCTS STATUS AND SEND EMAIL ACCORDINGLY
                const emailNotifType = getEmailNotifType(scrapedProduct,currentProduct);
                if(emailNotifType && updatedProduct.users.length > 0){
                    const productInfo = {
                        title: updatedProduct.title,
                        url: updatedProduct.url
                    }

                    const emailContent = await generateEmailBody(productInfo, emailNotifType);
                    const userEmails = updatedProduct.users.map((user:any)=>user.email)

                    await sendEmail(emailContent,userEmails)
                }

                return updatedProduct
            }

            ))

            return NextResponse.json({
                message:"OK",
                data:updatedProducts
            })

    } catch (error) {
        throw new Error("ERROR IN GET - " + error)
    }
}