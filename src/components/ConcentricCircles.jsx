import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';

// const pulse = keyframes`
//   0% { transform: scale(0.5); opacity: 1; }
//   100% { transform: scale(1.5); opacity: 0; }
// `;

function ConcentricCircles() {
  return (
    <Box className="overflow-hidden"
       sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 900,
    height: 900,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transform: "translate(-50%, -50%)",
    opacity: 0.2, // shifts back by half width & height
  }}
    >
       <Box className="overflow-hidden"
        sx={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          border: '2px solid gray',
          transform: 'rotate(0deg)',
          
        }}
      />

      <Box className="overflow-hidden"
        sx={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          border: '2px solid gray',
          
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          borderTop: '2px solid transparent',
          border: '2px solid gray',
          
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          border: '2px solid gray',
          
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          border: '2px solid gray',
          
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: '2px solid gray',
          
        }}
      />
    </Box>
  );
}

export default ConcentricCircles;