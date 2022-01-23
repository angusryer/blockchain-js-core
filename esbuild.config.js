require('esbuild').build({
    entryPoints: ['index.ts'],
    bundle: true,
    minify: false,
    outfile: './dist/main.js',
    loader: { ".ts": 'ts' }

}).catch(() => process.exit(1));