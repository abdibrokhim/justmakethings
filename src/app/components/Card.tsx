import React from 'react'

interface CardProps {
  textColor: string
  backgroundColor: string
  isSelected: 'text' | 'background' | null
  onSelect: (element: 'text' | 'background') => void
}

const Card: React.FC<CardProps> = ({ textColor, backgroundColor, isSelected, onSelect }) => {
  return (
    <div
      className={`w-full aspect-video max-w-[960px] flex items-center justify-center transition-all duration-300 cursor-pointer ${
        isSelected === 'background' ? 'ring-4 ring-[hsl(var(--teal-700))] ring-opacity-100' : ''
      }`}
      style={{ backgroundColor }}
      onClick={() => onSelect('background')}
    >
      <h1 
        className={`text-4xl sm:text-5xl md:text-6xl font-bold transition-all duration-300 ${
          isSelected === 'text' ? 'ring-4 ring-[hsl(var(--teal-700))] ring-opacity-100 px-4 py-2' : ''
        }`}
        style={{
            color: textColor,
            wordSpacing: '0.1em'
          }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect('text');
        }}
      >
        just make things
      </h1>
    </div>
  )
}

export default Card

