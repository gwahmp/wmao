import { defineConfig } from 'vite';

export default defineConfig({

    server: {

        allowedHosts: [

            'test.wikimint.com'
        ]
    }
});