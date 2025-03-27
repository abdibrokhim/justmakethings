import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="row-start-3 w-full flex mx-auto justify-center items-center p-4">
        <p className="text-[10px] text-center text-[var(--text-c)] inline-flex">
          © 2025 <a
            aria-label="Welcome to YAPS WORLD"
            className="ml-1 flex items-center hover:underline hover:underline-offset-4 text-[#787B89] hover:text-[hsl(var(--teal-700))]"
            href="https://yaps.gg"
            target="_blank"
            rel="noopener noreferrer"
          >
             YAPS WORLD
          </a>.
        </p>
      </footer>

  )
}

export default Footer