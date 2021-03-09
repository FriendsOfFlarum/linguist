export default function (operation, booleans) {
    return booleans.reduce((a, b) => {
        if (a === 'start') {
            return b;
        }

        if (operation === 'or') {
            return a || b;
        }

        return a && b;
    }, 'start');
}
