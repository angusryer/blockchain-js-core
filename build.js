require('esbuild').build({
    entryPoints: ['core.ts'],
    bundle: true,
    outfile: './dist/core.js',
    loader: 'ts'
}).catch(() => process.exit(1));