import React from 'react'

interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
}

// Acrylic card component
const glassBase =
  'rounded-2xl border border-white/10 bg-black/20 shadow-[0_4px_16px_rgba(0,0,0,0.2)]'

const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', onClick, disabled }) => {
  const classes = `${glassBase} ${className}`

  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${classes} transition duration-150 hover:bg-black/10 active:scale-[0.98] disabled:opacity-50`}
      >
        {children}
      </button>
    )
  }

  return <div className={classes}>{children}</div>
}

export default GlassPanel
