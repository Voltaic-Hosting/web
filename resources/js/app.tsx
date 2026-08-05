import '@fontsource-variable/dm-sans';
import '@fontsource-variable/jetbrains-mono';
import '../css/app.css';
import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Voltaic Hosting';

createInertiaApp({
    title: (title) => title || appName,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ) as Promise<ResolvedComponent>,
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#b45309',
    },
});
