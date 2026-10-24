import type { ErrorContent } from './types';

export const errors: Record<string, ErrorContent> = {
    '401': {
        title: 'Sign in required',
        description:
            'This page needs an authenticated session. Return home or contact support if you reached this by mistake.',
    },
    '403': {
        title: 'Access denied',
        description: 'You do not have permission to view this page.',
    },
    '404': {
        title: 'Page not found',
        description: 'That URL is not on this site. Check the address, or use the links below.',
    },
    '419': {
        title: 'Session expired',
        description: 'Your session timed out for security. Refresh the page and try again.',
    },
    '429': {
        title: 'Too many requests',
        description: 'You hit a rate limit. Wait a moment, then try again.',
    },
    '500': {
        title: 'Server error',
        description: 'Something failed while loading this page. Try again in a few minutes.',
    },
    '503': {
        title: 'Service unavailable',
        description:
            'The site is temporarily unavailable for maintenance or capacity. Try again shortly.',
    },
    default: {
        title: 'Something went wrong',
        description: 'An unexpected error occurred. Try again, or email if it keeps happening.',
    },
};

export function errorFor(status: number): ErrorContent {
    return errors[String(status)] ?? errors.default;
}
