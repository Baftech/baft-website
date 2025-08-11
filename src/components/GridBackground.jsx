import { useRef, useEffect } from 'react'

export const GridBackground=() =>{
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, dpr, animationId

 
    const gridSize = 100
    const speed = 3

    let progress1 = 0 
    let progress2 = 0 

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
    for (let y = 0; y <= H; y += gridSize) {
      const gradient = ctx.createRadialGradient(
        x + gridSize / 2,
        y + gridSize / 2,
        0,
        x + gridSize / 2,
        y + gridSize / 2,
        gridSize / 1.5
      )
      gradient.addColorStop(0, 'rgba(255,255,255,0.01)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, gridSize, gridSize)
    }
  }

  for (let x = 0; x <= W; x += gridSize) {
    const distanceFromCenter = Math.abs(x - W / 2)
    const alpha = Math.max(0.05, 0.3 - distanceFromCenter / (W / 2))
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
    ctx.stroke()
  }

  for (let y = 0; y <= H; y += gridSize) {
    const distanceFromCenter = Math.abs(y - H / 2)
    const alpha = Math.max(0.05, 0.3 - distanceFromCenter / (H / 2))
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }
}



    function drawSharpLine(x, y, dx, dy, length = 100) {
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'
      ctx.lineWidth = 1.5
      ctx.shadowBlur = 6
      ctx.shadowColor = 'rgba(255,255,255,0.5)'
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + dx * length, y + dy * length)
      ctx.stroke()


      ctx.shadowBlur = 0
      ctx.shadowColor = 'transparent'
    }

    function animate() {
      drawGrid()

      
      const verticalX = gridSize * 2
      const y1 = H - (progress1 % (H + 100))
      drawSharpLine(verticalX, y1, 0, -1) 

     
      const horizontalY = gridSize * 1
      const x2 = W - (progress2 % (W + 100))
      drawSharpLine(x2, horizontalY, -1, 0)

      progress1 += speed
      progress2 += speed

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