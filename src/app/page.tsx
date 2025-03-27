'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { Button } from "./components/ui/button"
import Card from './components/Card'
import ColorSelector from './components/ColorSelector'
import Footer from './components/Footer'
import { Analytics } from "@vercel/analytics/react"
import Ads from './components/Ads'

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
  ],
  cyberpunk: [
    '#00010D',
    '#010326',
    '#2D0140',
    '#660273',
    '#A305A6'
  ]
}

const MAX_TEXT_LENGTH = 30

export default function Home() {
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [backgroundColor, setBackgroundColor] = useState('#0B0E11')
  const [selectedElement, setSelectedElement] = useState<'text' | 'background' | null>(null)
  const [cardText, setCardText] = useState('just make things')
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

  const handleTextChange = (newText: string) => {
    setCardText(newText)
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

  return (
    <div className="h-screen p-4 sm:p-8 font-[family:var(--font-geist-sans)]">
      <Analytics />
      <main className="max-w-4xl mx-auto space-y-8">
        <Ads />

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
            onTextChange={handleTextChange}
            initialText={cardText}
            maxLength={MAX_TEXT_LENGTH}
          />
        </div>

        <div className="flex justify-center space-x-8">
          <Button onClick={handleDownload} variant="default" size="sm" className='text-sm'>
            Download Card
          </Button>
          <Button onClick={() => {
            const text = `try yaps.chat - one-time end-to-end encrypted anonymous chats`;
            window.open(`https://x.com/intent/post?text=${encodeURIComponent(text)}`, '_blank');
          }} variant="default" size="sm" className='text-sm'>
            Share on Twitter
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}