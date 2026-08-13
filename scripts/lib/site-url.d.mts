// Type declaration for scripts/lib/site-url.mjs (shared postbuild helper).
// node scripts can import the .mjs directly; tsx-run .ts scripts need this
// so `tsc -p tsconfig.scripts.json` (strict, allowJs:false) resolves types.
export declare function resolveSiteUrl(): string;