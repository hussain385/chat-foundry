import { defineConfig } from 'tsup';

export default defineConfig({
  // Headless core plus the optional web and React Native UIs
  entry: { index: 'src/index.ts', ui: 'src/ui/index.ts', native: 'src/native/index.ts' },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  // Share one copy of the core (and its session store) between both entries
  splitting: true,
  external: ['react', 'react-dom', 'react-native'],
});
