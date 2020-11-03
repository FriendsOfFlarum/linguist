/* global m */

const HIGHLIGHT_DELIMITER = '<fof-highlight>';

// Takes a string and highlight a keyword with a span with mithril template
// The output will be an array if a keyword is given
export default function (string, highlight) {
    if (!highlight) {
        return string;
    }

    const lowercaseHighliht = highlight.toLowerCase();

    // Regex to match the highlighted work in a case-insensitive manner
    const regex = new RegExp(lowercaseHighliht.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    return string
        .replace(regex, HIGHLIGHT_DELIMITER + '$&' + HIGHLIGHT_DELIMITER)
        .split(HIGHLIGHT_DELIMITER)
        .map(text => {
            if (text.toLowerCase() === lowercaseHighliht) {
                return m('span.FoF-Linguist-Highlight', text);
            }

            return text;
        });
}
