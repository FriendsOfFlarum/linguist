export default function booleanCheck(
    operation: string,
    booleans: boolean[],
): boolean {
    return booleans.reduce<boolean | "start">((a, b) => {
        if (a === "start") {
            return b;
        }

        if (operation === "or") {
            return a || b;
        }

        return a && b;
    }, "start") as boolean;
}
