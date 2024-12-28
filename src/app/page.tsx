'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { Button } from "./components/ui/button"
import Card from './components/Card'
import ColorSelector from './components/ColorSelector'
import Footer from './components/Footer'
import { Analytics } from "@vercel/analytics/react"

interface ColorMap {
  [key: string]: string[]
}

const popularColors: ColorMap = {
  calming: [
    '#FFFCF9',
    '#F4F1DE',
    '#E9C46A',
    '#264653',
    '#2A9D8F'
  ],
  vibe50s: [
    '#b73838',
    '#ddd3bc',
    '#322c2c',
    '#5a8696',
    '#e4b854'
  ],
  aethestetic: [
    '#66545e',
    '#a39193',
    '#aa6f73',
    '#eea990',
    '#f6e0b5'
  ]
}

export default function Home() {
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [backgroundColor, setBackgroundColor] = useState('#0B0E11')
  const [selectedElement, setSelectedElement] = useState<'text' | 'background' | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleColorSelect = (color: string) => {
    if (selectedElement === 'text') {
      setTextColor(color)
    } else if (selectedElement === 'background') {
      setBackgroundColor(color)
    }
  }

  const handleElementSelect = (element: 'text' | 'background') => {
    setSelectedElement(element)
  }

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        // Only deselect if clicking outside the card and not on a color selector
        if (!(event.target as Element).closest('.color-selector')) {
          setSelectedElement(null);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleDownload = useCallback(() => {
    if (cardRef.current) {
      const scale = 1920 / cardRef.current.offsetWidth
      html2canvas(cardRef.current, {
        scale: scale,
        onclone: (document, element) => {
          const textElement = element.querySelector('h1')
          if (textElement) {
            textElement.style.fontSize = '72px'
            textElement.style.fontFamily = 'Impact, sans-serif'
            textElement.style.position = 'relative'
            textElement.style.top = '-30px'
          }
        }
      }).then((canvas) => {
        const link = document.createElement('a')
        link.download = 'card.png'
        link.href = canvas.toDataURL()
        link.click()
      })
    }
  }, [])

  const handleShare = useCallback(async () => {
    // 1. Make sure there's a ref to the card
    if (!cardRef.current) return

    try {
      // 2. Calculate scale (e.g., if you want a 1920px wide image)
      const scale = 1920 / cardRef.current.offsetWidth

      // 3. Generate the canvas using html2canvas
      const canvas = await html2canvas(cardRef.current, {
        scale,
        onclone: (document, element) => {
          // Adjust style of the <h1> in the cloned version
          const textElement = element.querySelector('h1')
          if (textElement) {
            textElement.style.fontSize = '72px'
            textElement.style.fontFamily = 'Impact, sans-serif'
            textElement.style.position = 'relative'
            textElement.style.top = '-30px'
          }
        },
      })

      // 4. Convert the canvas to a Blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blobResult) => {
          resolve(blobResult)
        }, 'image/png')
      })

      if (!blob) {
        // If we failed to create the blob, log an error and bail out
        console.error('Error: Could not generate blob from the canvas.')
        // Fallback to sharing text only (example: Twitter)
        const fallbackText = '#justmakethings'
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fallbackText)}`
        window.open(twitterUrl, '_blank')
        return
      }

      // 5. Create a File from the Blob
      const file = new File([blob], 'card.png', { type: 'image/png' })

      // 6. Prepare share data
      const text = '#justmakethings'
      const shareData: ShareData = {
        files: [file],
        text,
      }

      // 7. Attempt to share
      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback: if file sharing is not supported, open Twitter
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
        window.open(twitterUrl, '_blank')
      }

    } catch (error) {
      // If anything goes wrong in the process, log the error and do a fallback
      console.error('An error occurred while generating or sharing the image:', error)
      const fallbackText = '#justmakethings'
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fallbackText)}`
      window.open(twitterUrl, '_blank')
    }
  }, [])

  return (
    <div className="min-h-screen p-4 sm:p-8 md:p-12 lg:p-20 font-[family:var(--font-geist-sans)]">
      <Analytics />
      <main className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-8 color-selector">
          <ColorSelector 
            colors={popularColors} 
            onColorSelect={handleColorSelect}
            selectedColor={selectedElement === 'text' ? textColor : backgroundColor}
            onCustomColorChange={handleColorSelect}
          />
        </div>

        <div ref={cardRef} className="mb-8 flex justify-center shadow-[0_0_20px_rgba(255,255,255,0.25)]">
          <Card 
            textColor={textColor} 
            backgroundColor={backgroundColor}
            isSelected={selectedElement}
            onSelect={handleElementSelect}
          />
        </div>

        <div className="flex justify-center space-x-4">
          <Button onClick={handleDownload} variant="default">
            Download Card
          </Button>
          <Button onClick={handleShare} variant="default">
            Share on Twitter
          </Button>
        </div>
        
        <div className='flex text-xs justify-center space-x-4'>
          <Button 
            onClick={()=>{
              window.open('https://v0.dev/', '_blank')
            }} variant="outline">
            <span className='mr-1'>made with</span><svg fill="currentColor" viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="size-6"><path d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z"></path><path d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z"></path></svg>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}