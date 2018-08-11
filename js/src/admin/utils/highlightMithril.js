const HIGHLIGHT_DELIMITER = '<flagrow-highlight>';

// Takes a string and highlight a keyword with a span with mithril template
// The output will be an array if a keyword is given
export default function (string, highlight) {
    if (!highlight) {
        return string;
    }

    return string
        .replace(highlight, HIGHLIGHT_DELIMITER + highlight + HIGHLIGHT_DELIMITER, string)
        .split(HIGHLIGHT_DELIMITER)
        .map(text => {
            if (text === highlight) {
                return m('span.Flagrow-Linguist-Highlight', text);
            }

            return text;
        });
}
