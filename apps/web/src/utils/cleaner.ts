export function stripEmptyValues<T extends Record<string, any>>(object: T): T {
    // TODO: remove the key === "id" part here. Currently put it here as a quick fix for sending data to the server.
    return Object.fromEntries(
        Object.entries(object).filter(
            ([key, value]) => value !== "" && key !== "id",
        ),
    ) as T;
}
