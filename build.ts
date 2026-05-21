import { Glob, $ } from 'bun';

const glob = new Glob('src/**/*.{ts,tsx}');
const entrypoints = Array.from(glob.scanSync('.'));

await Bun.build({
  entrypoints,
  outdir: './dist',
  root: './src',
  target: 'bun',
  sourcemap: 'external',
});

await $`npx tsc --emitDeclarationOnly --declaration --declarationMap --outDir dist`;

console.log(`✅ Built ${entrypoints.length} files to ./dist`);
