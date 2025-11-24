const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.join(__dirname, '../src');
const EN_DICT_PATH = path.join(__dirname, '../src/dictionaries/en.json');
const DE_DICT_PATH = path.join(__dirname, '../src/dictionaries/de.json');

// Load dictionaries
const enDict = JSON.parse(fs.readFileSync(EN_DICT_PATH, 'utf8'));
const deDict = JSON.parse(fs.readFileSync(DE_DICT_PATH, 'utf8'));

// Helper to flatten dictionary keys
function flattenKeys(obj, prefix = '') {
    let keys = [];
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            keys = keys.concat(flattenKeys(obj[key], prefix + key + '.'));
        } else {
            keys.push(prefix + key);
        }
    }
    return keys;
}

const definedKeys = new Set(flattenKeys(enDict));
const deDefinedKeys = new Set(flattenKeys(deDict));

// Regex to find usage of dictionary keys (e.g., dict.auth.login.title)
const KEY_USAGE_REGEX = /dict\.([a-zA-Z0-9_.]+)/g;

// Regex to find potential hardcoded text in JSX
const HARDCODED_TEXT_REGEX = />([^<>{}\n]+)</g;
const ATTRIBUTE_TEXT_REGEX = /(placeholder|title|alt|label)="([^"{}]+)"/g;

const usedKeys = new Set();
const missingKeys = new Set();
const hardcodedCandidates = [];

// Helper to check if a key exists in a dictionary object (nested)
function keyExists(obj, keyPath) {
    const parts = keyPath.split('.');
    let current = obj;
    for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
            current = current[part];
        } else {
            return false;
        }
    }
    return true;
}

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    });
}

function scanFile(filePath) {
    if (!filePath.match(/\.(ts|tsx|js|jsx)$/)) return;

    const content = fs.readFileSync(filePath, 'utf8');

    // Find key usages
    let match;
    while ((match = KEY_USAGE_REGEX.exec(content)) !== null) {
        const fullKey = match[1];
        // Remove trailing dots or invalid chars if regex overmatched
        const cleanKey = fullKey.replace(/\.$/, '');
        usedKeys.add(cleanKey);

        if (!keyExists(enDict, cleanKey)) {
            missingKeys.add(cleanKey);
        }
    }

    // Find hardcoded text candidates (only in .tsx/.jsx files)
    if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
        // Reset regex state
        let textMatch;
        while ((textMatch = HARDCODED_TEXT_REGEX.exec(content)) !== null) {
            const text = textMatch[1].trim();
            if (text && !text.match(/^[0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)) {
                // Filter out numbers and symbols only
                hardcodedCandidates.push({ file: filePath, line: 0, text: text, type: 'content' });
            }
        }

        let attrMatch;
        while ((attrMatch = ATTRIBUTE_TEXT_REGEX.exec(content)) !== null) {
            const text = attrMatch[2].trim();
            if (text) {
                hardcodedCandidates.push({ file: filePath, line: 0, text: text, type: 'attribute', attr: attrMatch[1] });
            }
        }
    }
}

// Main execution
walkDir(SRC_DIR, scanFile);

console.log('--- Audit Report ---');
console.log(`Total unique keys used: ${usedKeys.size}`);
console.log(`Missing keys in EN dictionary: ${missingKeys.size}`);

if (missingKeys.size > 0) {
    console.log('\nMissing Keys (EN):');
    missingKeys.forEach(k => console.log(`  - ${k}`));
}

// Check for keys missing in DE but present in EN (and used)
const missingInDe = [];
usedKeys.forEach(key => {
    if (keyExists(enDict, key) && !keyExists(deDict, key)) {
        missingInDe.push(key);
    }
});

console.log(`\nKeys missing in DE dictionary (but present in EN and used): ${missingInDe.length}`);
if (missingInDe.length > 0) {
    missingInDe.forEach(k => console.log(`  - ${k}`));
}

console.log(`\nPotential Hardcoded Text Candidates: ${hardcodedCandidates.length}`);
// Limit output for hardcoded text to avoid spamming
if (hardcodedCandidates.length > 0) {
    console.log('(Showing first 50)');
    hardcodedCandidates.slice(0, 50).forEach(c => {
        const relPath = path.relative(process.cwd(), c.file);
        if (c.type === 'content') {
            console.log(`  - [${relPath}] Text: "${c.text}"`);
        } else {
            console.log(`  - [${relPath}] Attr (${c.attr}): "${c.text}"`);
        }
    });
}
