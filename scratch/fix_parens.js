const fs = require('fs');

const file = 'd:/bit68/DreamPark/my-app/src/components/BookingFlow.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find dispatch(setXYZ(... where the closing parens of setXYZ has been matched, but dispatch parens hasn't
// A simple way is to use regex matching dispatch(set[A-Za-z]+\([^;]+;
// Basically, we added dispatch( without the closing parenthesis at the end of the statement or expression.
// Let's replace dispatch(setXYZ(something); with dispatch(setXYZ(something));
// Also replace dispatch(setXYZ(something)} with dispatch(setXYZ(something))}
// Also replace dispatch(setXYZ(something), with dispatch(setXYZ(something)),
// Let's do it generally:
content = content.replace(/dispatch\((set[A-Za-z]+)\(([^)]+)\)\s*;/g, 'dispatch($1($2));');

// But some might have multiple parens like dispatch(setSelectedTicketId(ticket.id || ticket._id || ""));
// Let's use string manipulation instead of simple regex to be safe.
const lines = content.split('\n');
const fixedLines = lines.map(line => {
  // if the line has `dispatch(` and not `));` where it should, let's fix it.
  // Actually, a safer way to fix the exact replacements we made:
  // We replaced:
  // setSelectedCategory(cat); -> dispatch(setSelectedCategory(cat); -> should be dispatch(setSelectedCategory(cat));
  
  if (line.includes('dispatch(set')) {
    // Count opening and closing parenthesis
    const openCount = (line.match(/\(/g) || []).length;
    const closeCount = (line.match(/\)/g) || []).length;
    if (openCount > closeCount) {
      // Find where we can insert the missing closing parenthesis
      // Usually right before the semicolon, or right before '}'
      if (line.endsWith(';')) {
        return line.slice(0, -1) + ');';
      } else if (line.endsWith('}')) {
        return line.slice(0, -1) + ')}';
      } else {
        return line + ')';
      }
    }
  }
  return line;
});

fs.writeFileSync(file, fixedLines.join('\n'));
console.log("Fixed parenthesis");
