import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('panel stylesheet', () => {
    it('declares the tailwind layer order before any layer so load order cannot demote components', () => {
        const css = readFileSync('src/styles/panel.css', 'utf8');
        expect(css.startsWith('@layer theme, base, components, utilities;')).toBe(true);
    });
});
