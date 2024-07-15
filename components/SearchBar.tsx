"use client"

import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react"

const isValidAmazonProductURL = (url: string)=>{
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname;
        
        if(hostname.includes("amazon.com") || hostname.includes("amazon.") || hostname.endsWith("amazon")){
            return true;
        }
    } catch (error) {
        return false;
    }
    return false;
}

const SearchBar = () => {
    const [searchPrompt, setsearchPrompt] = useState("")
    const [isLoading, setisLoading] = useState(false);

    const handleSubmit = async(event:FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const isValidLink = isValidAmazonProductURL(searchPrompt)
        
        if(!isValidLink)return alert("Please provide a valid amazon link")

        try {
            setisLoading(true);
            //scrape the product page
            const products = await scrapeAndStoreProduct(searchPrompt)
        } catch (error) {
            console.log("Erro - ",error)
        }finally{
            setisLoading(false);
        }
    }

  return (
    <form onSubmit={e=>handleSubmit(e)} className='flex flex-wrap gap-4 mt-12'>
        <input value={searchPrompt} onChange={(e)=>setsearchPrompt(e.target.value)} type="text" placeholder="Enter product link" className="searchbar-input"/>
        <button disabled={searchPrompt===""} type="submit" className="searchbar-btn">
            {isLoading ? "Searching..." : "Search"}
        </button>
    </form>
  )
}

export default SearchBar
