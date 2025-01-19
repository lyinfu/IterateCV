/**
 * stripExtension:
 * Remove file extension (like .md) from the filename if present.
 *
 * @param {string} filename - e.g. "ABC10 Name 1.md"
 * @returns {string} filename without extension, e.g. "ABC10 Name 1"
 */
function stripExtension(filename) {
    const lastDot = filename.lastIndexOf('.');
    // If there's no dot or it's the first character, just return the original name
    if (lastDot <= 0) return filename;
    return filename.substring(0, lastDot);
}

/**
 * parseFilename:
 * Split the filename into tokens (digits and non-digits).
 * Then find the numeric token indicated by digitPos (e.g. 0 = first digit, -1 = last digit).
 *
 * @param {string} filename - e.g. "ABC10 Name 1.md"
 * @param {number} digitPos - 0=first digit, 1=second digit, -1=last digit, etc.
 * @returns {{ prefix: string, numeric: number }}
 *
 * Example:
 *   parseFilename("ABC10 Name 9", 0) => { prefix: "ABC", numeric: 10 }
 *   parseFilename("ABC10 Name 9", -1) => { prefix: "ABC10 Name ", numeric: 9 }
 */
function parseFilename(filename, digitPos = 0) {
    const base = stripExtension(filename);
    // Split into digit or non-digit tokens: ["ABC", "10", " Name ", "9"]
    const tokens = base.match(/\D+|\d+/g) || [base];

    // Identify all digit tokens
    let digitIndices = [];
    for (let i = 0; i < tokens.length; i++) {
        if (/^\d+$/.test(tokens[i])) {
            digitIndices.push(i);
        }
    }

    // If there is no digit token, return prefix=full base, numeric=NaN
    if (digitIndices.length === 0) {
        return { prefix: base, numeric: NaN };
    }

    // Handle negative index (Python-style)
    if (digitPos < 0) {
        digitPos = digitIndices.length + digitPos;
    }
    // Bound check
    if (digitPos < 0 || digitPos >= digitIndices.length) {
        throw new Error(`pos out of range: ${pos} (total numeric tokens: ${digitIndices.length})`);
    }

    // The target digit token index in the tokens array
    const targetIndex = digitIndices[digitPos];

    // prefix is the concatenation of all tokens before the targetIndex
    const prefix = tokens.slice(0, targetIndex).join('');
    // numeric is the integer value of the target digit token
    const numericValue = parseInt(tokens[targetIndex], 10);

    return {
        prefix,
        numeric: numericValue
    };
}

/**
 * slipbox:
 * Main function to create a new slipbox note in the same folder, incrementing
 * the chosen numeric token (identified by pos).
 *
 * @param {object} tp - Templater object passed in by Obsidian
 * @param {number} pos - which digit to operate on; 0=first digit, -1=last digit, etc.
 * @param {boolean} copy - whether to copy the content of the current note into the new one
 */
async function slipbox(tp, pos = 0, copy = false) {
    // 1) Gather current file info
    let activeFilePath = tp.file.path(true);
    let activeFileName = activeFilePath.split('/').pop();
    let activeFolderPath = tp.file.folder(true);

    // 2) Parse filename -> prefix and numeric
    let { prefix, numeric } = parseFilename(activeFileName, pos);

    // 3) Find all existing notes in the same folder that share the same prefix
    let existingNotes = app.vault.getMarkdownFiles().filter(file => {
        if (!file.path.startsWith(activeFolderPath)) return false;

        let { prefix: pf, numeric: nm } = parseFilename(file.name, pos);
        return pf === prefix; // only notes with the same prefix
    });

    // 4) Extract all existing numeric values, compute max
    let allIDs = existingNotes.map(file => {
        let parsed = parseFilename(file.name, pos);
        return parsed.numeric;
    }).filter(n => !isNaN(n));

    let maxID = Math.max(...allIDs);
    if (!isFinite(maxID)) {
        maxID = 0;
    }

    // 5) Next available ID
    let newID = maxID + 1;

    // 6) Construct the new file name: prefix + newID
    let newNoteName = prefix + newID;
    let newNotePath = `${activeFolderPath}/${newNoteName}.md`;

    // 7) Create and open the new note
    await app.vault.create(newNotePath, "");
    let newNoteFile = app.vault.getAbstractFileByPath(newNotePath);
    await app.workspace.getLeaf('tab').openFile(newNoteFile);

    // 8) (Optional) Copy existing content
    if (copy) {
        await app.vault.append(newNoteFile, tp.file.content);
    }
}

// Export the slipbox function so it can be used in your templates
module.exports = slipbox;
