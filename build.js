import { createBundle } from 'dts-buddy';

//Generate the type definitions from the source code
createBundle({
    project: "./tsconfig.json",

    modules: {
        "blurhash-gradients": "src/index.js"
    },

    output: 'types/index.d.ts'
});