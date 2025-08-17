import { useRef, useEffect } from 'react'

export const GridBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, dpr, animationId

    // Increased grid size to match Figma design
    const gridSize = 100 // Was 100, now larger for more spacing
    const speed = 10 // Slightly slower animation

    let progress1 = 0 
    let progress2 = 0 
    let progress3 = 0 // For the new top-right light 

    function resize() {
      dpr = window.devicePixelRatio || 1
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    function drawGrid() {
      ctx.clearRect(0, 0, W, H)

      // Vertical lines with fade effect from top to bottom
      for (let x = 0; x <= W; x += gridSize) {
        // Create gradient for each vertical line
        const gradient = ctx.createLinearGradient(0, 0, 0, H)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)') // More visible at top
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.08)') // Start fading
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.02)') // Almost invisible at bottom
        
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, H)
        ctx.stroke()
      }

      // Horizontal lines with fade effect based on their position
      for (let y = 0; y <= H; y += gridSize) {
        // Calculate fade factor based on vertical position
        const fadeProgress = y / H // 0 at top, 1 at bottom
        const opacity = 0.25 * (1 - fadeProgress * 0.9) // Start at 0.25, fade to 0.025
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
        ctx.stroke()
      }
    }

    function drawSharpLine(x, y, dx, dy, length = 120) {
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.lineWidth = 1.2
      ctx.shadowBlur = 3
      ctx.shadowColor = 'rgba(255,255,255,0.2)'
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + dx * length, y + dy * length)
      ctx.stroke()

      ctx.shadowBlur = 0
      ctx.shadowColor = 'transparent'
    }

    // New function for fading tail effect
    function drawFadingLine(x, y, dx, dy, segments = 8, totalLength = 150) {
      const segmentLength = totalLength / segments
      
      for (let i = 0; i < segments; i++) {
        const startX = x + dx * segmentLength * i
        const startY = y + dy * segmentLength * i
        const endX = x + dx * segmentLength * (i + 1)
        const endY = y + dy * segmentLength * (i + 1)
        
        // Fade from bright to transparent
        const opacity = (1 - i / segments) * 0.5 // Max opacity of 0.5, fading to 0
        ctx.strokeStyle = `rgba(255,255,255,${opacity})`
        ctx.lineWidth = 1.2 * (1 - i / segments * 0.5) // Also fade the width slightly
        ctx.shadowBlur = 3 * (1 - i / segments)
        ctx.shadowColor = `rgba(255,255,255,${opacity * 0.3})`
        
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
      
      ctx.shadowBlur = 0
      ctx.shadowColor = 'transparent'
    }

    function animate() {
      drawGrid()

      // First animated light - vertical line moving up with fading tail
      const verticalX = Math.round(gridSize * 2.5 / gridSize) * gridSize
      const y1 = H - (progress1 % (H + 150))
      drawFadingLine(verticalX, y1, 0, -1, 8, 200) // Fading upward tail

      // Second animated light - horizontal line moving left with fading tail
      const horizontalY = Math.round(gridSize * 1.5 / gridSize) * gridSize
      const x2 = W - (progress2 % (W + 150))
      drawFadingLine(x2, horizontalY, -1, 0, 8, 200) // Fading leftward tail

      // Third animated light - vertical line coming from top right with fading tail
      const verticalXRight = Math.round(gridSize * 8 / gridSize) * gridSize
      const y3 = (progress3 % (H + 150)) - 150
      drawFadingLine(verticalXRight, y3, 0, 1, 8, 200) // Fading downward tail

      progress1 += speed
      progress2 += speed
      progress3 += speed * 1.2

      animationId = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', resize)
    resize()
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
      {/* Blue tint overlay */}
      <div 
        className="absolute inset-0 bg-blue-900/20 pointer-events-none"
        style={{ 
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(147, 197, 253, 0.05) 100%)',
          zIndex: 1
        }}
      />
      {/* Grid canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 2 }}
      />
    </div>
  )
}