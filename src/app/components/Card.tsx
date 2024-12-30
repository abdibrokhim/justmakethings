import React, { useState, useEffect, useRef } from 'react'

interface CardProps {
  textColor: string
  backgroundColor: string
  isSelected: 'text' | 'background' | null
  onSelect: (element: 'text' | 'background') => void
  onTextChange: (text: string) => void
  initialText: string
  maxLength: number
}

const Card: React.FC<CardProps> = ({
  textColor,
  backgroundColor,
  isSelected,
  onSelect,
  onTextChange,
  initialText,
  maxLength,
}) => {
  // If `initialText` is empty, use a default placeholder
  const [text, setText] = useState(
    initialText.trim().length > 0 ? initialText : 'just make things'
  )
  const textRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (isSelected === 'text' && textRef.current) {
      textRef.current.focus()

      // Move cursor to the end of the text
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(textRef.current)
      range.collapse(false) // move cursor to end
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }, [isSelected])

  const handleTextChange = (e: React.FormEvent<HTMLHeadingElement>) => {
    let newText = e.currentTarget.textContent || ''

    // If text is empty, revert to default
    if (newText.trim().length === 0) {
      newText = 'just make things'
    }

    // Enforce max length
    if (newText.length <= maxLength) {
      setText(newText)
      onTextChange(newText)
    } else {
      // Prevent further input if max length is reached
      e.preventDefault()
      // Truncate to maxLength
      const truncatedText = newText.slice(0, maxLength)
      setText(truncatedText)
      onTextChange(truncatedText)

      // Set the truncated text back to the element
      e.currentTarget.textContent = truncatedText

      // Move cursor to the end again
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(e.currentTarget)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }

  return (
    <div
      className={`w-full aspect-video max-w-[960px] flex items-center justify-center transition-all duration-300 cursor-pointer ${
        isSelected === 'background' ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
      }`}
      style={{ backgroundColor }}
      onClick={() => onSelect('background')}
    >
      <h1
        ref={textRef}
        contentEditable={isSelected === 'text'}
        onInput={handleTextChange}
        className={`text-4xl sm:text-5xl md:text-6xl font-bold transition-all duration-300 text-center outline-none ${
          isSelected === 'text' ? 'ring-4 ring-blue-500 ring-opacity-50 px-4 py-2' : ''
        }`}
        style={{ color: textColor }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect('text')
        }}
        suppressContentEditableWarning={true}
      >
        {text}
      </h1>
    </div>
  )
}

export default Card