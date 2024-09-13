'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface LoadingButtonProps {
  href: string
  children: React.ReactNode
}

const LoadingButton = ({ href, children }: LoadingButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    setIsLoading(true)
    router.push(href)
  }

  return (
    <Button 
      variant="outline" 
      className="shad-primary-btn" 
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading
        </>
      ) : (
        children
      )}
    </Button>
  )
}

export default LoadingButton