export function stripEmptyValues<T extends Record<string, any>>(object: T): T {
    return Object.fromEntries(
        Object.entries(object).filter(([_, value]) => value !== ""),
    ) as T;
}
