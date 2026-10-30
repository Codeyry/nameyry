"use client"


import CopyIcon from "./icons/CopyIcon"
import CheckIcon from "./icons/CheckIcon"
import { useState } from "react"


type CopyButtonProps = {
    text: string
}

export default function CopyButton({ text }: CopyButtonProps) {
    const [copied, setcopied] = useState(false)

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(text);
            setcopied(true);
            setTimeout(() => setcopied(false), 1500);
        } catch (error) {
        console.error("Failed to copy:", error);
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy"}
            title={copied ? "Copied" : "Copy"}
        >
            {copied ? ( 
                <CheckIcon className="h-5 w-5 text-primary"/>
            ) : ( 
                <CopyIcon className="h-5 w-5 text-text/70 hover:text-text"/>
            )}
        </button>
    )
}