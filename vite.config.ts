import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from "autoprefixer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css:{
    postcss:{
      plugins:[
        autoprefixer({
          overrideBrowserslist:['> 0.2%', 'last 5 versions', 'not dead',  'not op_mini all']
        })
      ]
    }
  }
})
