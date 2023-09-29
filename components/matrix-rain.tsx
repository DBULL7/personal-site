'use client'

import React, { useEffect, useRef } from 'react';
import styles from './matrix-rain.module.css';
import { useTheme } from 'next-themes'
import {useWindowSize} from 'react-use';
import { he } from 'date-fns/locale';

const MatrixRain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme, resolvedTheme } = useTheme()
  const {width, height} = useWindowSize();

  const isDarkMode = theme === 'system' ? resolvedTheme === 'dark' : theme === 'dark'

  useEffect(() => {
    // Clear existing canvas if any
    if (containerRef.current?.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    containerRef.current?.appendChild(canvas);

    const columns = canvas.width / 14;
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    // The draw function is responsible for creating the matrix rain effect
    function draw() {
        if (!ctx) return
        // Set the fill color to semi-transparent black to create a fading trail effect
        ctx.fillStyle = isDarkMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(245, 245, 245, 0.05)';
        // Fill the entire canvas with the fill color
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set the fill color to bright green, typical for the matrix rain effect
        ctx.fillStyle = isDarkMode ? '#00FF00' : '#333333';
        // Set the font to Courier New with a size of 14px
        ctx.font = '14px Courier New';
        
        // Loop over the drops array
        for (let i = 0; i < drops.length; i++) {
          // Generate a random character from the ASCII table (from 33 to 65)
          const text = String.fromCharCode(Math.floor(Math.random() * 33) + 33);
          // Draw the character at the current position
          ctx.fillText(text, i * 14, drops[i] * 14);
          
          // If the drop has reached the bottom of the screen and a random condition is met
          // reset the drop back to the top
          // this results in the initial coordinated effect,
          // before randomness kicks and and each column is behaving on its own
          if (drops[i] * 14 > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          
          // Increment the y position of the drop for the next frame
          drops[i]++;
        }
      }

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
        // Optionally clear canvas on cleanup
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [isDarkMode, width, height]);

  return <div className={styles.matrixContainer} ref={containerRef}></div>;
};

export default MatrixRain;