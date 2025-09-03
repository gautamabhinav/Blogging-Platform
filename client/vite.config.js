// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// // export default defineConfig({
// //   // plugins: [react()],
// //   plugins:[
// //     react() // Ensure react plugin is included after tailwindcss  
// //   ],
// // })


// // import { defineConfig } from 'vite';
// // import react from '@vitejs/plugin-react';

// // export default defineConfig({
// //   plugins: [react()],
// // });

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [
//     react({
//       jsxRuntime: 'automatic', // enables JSX
//       babel: {
//         presets: [],
//         plugins: [],
//       },
//     }),
//   ],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5014',
//         changeOrigin: true,
//         secure: false,
//         // Optional: remove '/api' prefix if needed
//         // rewrite: path => path.replace(/^\/api/, '')
//       }
//     }
//   }
// });



// // vite.config.js
// // import { defineConfig } from 'vite';
// // import react from '@vitejs/plugin-react';

// // export default defineConfig({
// //   plugins: [react()],
  
// // });



// ------------------------------------------------------------------------

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   // plugins: [react()],
//   plugins:[
//     react() // Ensure react plugin is included after tailwindcss  
//   ],
// })


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic', // enables JSX
      babel: {
        presets: [],
        plugins: [],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5014',
        changeOrigin: true,
        secure: false,
        // Optional: remove '/api' prefix if needed
        // rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
});



// vite.config.js
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
  
// });
