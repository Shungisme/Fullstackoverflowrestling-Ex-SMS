export function toQueryString(params: Record<string, any>): string {
    return Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) =>
            Array.isArray(value)
                ? value
                    .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
                    .join("&")
                : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
        )
        .join("&");
}
