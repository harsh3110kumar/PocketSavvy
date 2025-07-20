import React from 'react'

const Logo = ({ className = "" }) => {
  return (
    <h1 className={`text-2xl font-bold gradient-title ${className}`}>
      PocketSavvy
    </h1>
  )
}

export default Logo 