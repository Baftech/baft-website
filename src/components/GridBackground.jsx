import { useRef, useEffect } from 'react'

export const GridBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, dpr, animationId


    const gridSize = 123   
    const speed = 4

    let progress1 = 0 
    let progress2 = 0 
    let progress3 = 0  

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

     
      for (let x = 0; x <= W; x += gridSize) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)' 
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, H)
        ctx.stroke()
      }

      
      for (let y = 0; y <= H; y += gridSize) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)' 
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
        ctx.stroke()
      }
    }



    function drawFadingLine(x, y, dx, dy, segments = 8, totalLength = 150) {
      const segmentLength = totalLength / segments
      
      for (let i = 0; i < segments; i++) {
        const startX = x + dx * segmentLength * i
        const startY = y + dy * segmentLength * i
        const endX = x + dx * segmentLength * (i + 1)
        const endY = y + dy * segmentLength * (i + 1)
        
      
        const opacity = (1 - i / segments) * 0.5 
        ctx.strokeStyle = `rgba(255,255,255,${opacity})`
        ctx.lineWidth = 1.2 * (1 - i / segments * 0.5) 
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

      const verticalX = Math.round(gridSize * 2.5 / gridSize) * gridSize
      const y1 = H - (progress1 % (H + 150))
      drawFadingLine(verticalX, y1, 0, -1, 8, 200) 

      const horizontalY = Math.round(gridSize * 1.5 / gridSize) * gridSize
      const x2 = W - (progress2 % (W + 150))
      drawFadingLine(x2, horizontalY, -1, 0, 8, 200) 

      const verticalXRight = Math.round(gridSize * 10 / gridSize) * gridSize
      const y3 = (progress3 % (H + 150)) - 150
      drawFadingLine(verticalXRight, y3, 0, 1, 8, 200) 

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
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  )
}