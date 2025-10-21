export const locales = ['de', 'en'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'de';

export function getLocale(request: Request): Locale {
    // Check if locale is stored in cookie
    const cookieLocale = getCookieLocale(request);
    if (cookieLocale && locales.includes(cookieLocale as Locale)) {
        return cookieLocale as Locale;
    }

    // Use Accept-Language header
    const headers = new Headers(request.headers);
    const acceptLanguage = headers.get('accept-language') ?? '';

    // Simple locale matching without external dependencies
    const preferredLocale = matchLocale(acceptLanguage, locales, defaultLocale);
    return preferredLocale;
}

// Simple locale matching function
function matchLocale(acceptLanguage: string, supportedLocales: readonly string[], defaultLocale: string): Locale {
    if (!acceptLanguage) {
        return defaultLocale as Locale;
    }

    // Parse Accept-Language header
    const languages = acceptLanguage
        .split(',')
        .map(lang => {
            const [locale, q = '1'] = lang.trim().split(';q=');
            return {
                locale: locale.toLowerCase(),
                quality: parseFloat(q)
            };
        })
        .sort((a, b) => b.quality - a.quality);

    // Find best match
    for (const { locale } of languages) {
        // Exact match
        if (supportedLocales.includes(locale)) {
            return locale as Locale;
        }

        // Language code match (e.g., 'de-DE' matches 'de')
        const languageCode = locale.split('-')[0];
        if (supportedLocales.includes(languageCode)) {
            return languageCode as Locale;
        }
    }

    return defaultLocale as Locale;
}

function getCookieLocale(request: Request): string | null {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
    }, {} as Record<string, string>);

    return cookies['locale'] || null;
}

export function getLocalizedPath(pathname: string, locale: Locale): string {
    // Remove existing locale from path
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');

    // Add new locale (except for default locale)
    if (locale === defaultLocale) {
        return pathWithoutLocale || '/';
    }

    return `/${locale}${pathWithoutLocale}`;
}

export function getPathnameWithoutLocale(pathname: string): string {
    return pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
}

export function getLocaleFromPathname(pathname: string): Locale {
    const segments = pathname.split('/');
    const potentialLocale = segments[1];

    if (potentialLocale && locales.includes(potentialLocale as Locale)) {
        return potentialLocale as Locale;
    }

    return defaultLocale;
}