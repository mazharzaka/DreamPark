const fs = require('fs');
const file = 'd:/bit68/DreamPark/my-app/src/components/BookingFlow.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/color: selectedTicket\?\.color \|\| "#b5161e"\r?\n\s+\}\);/, 'color: selectedTicket?.color || "#b5161e"\n        }));');

fs.writeFileSync(file, content);
console.log("Fixed parens with regex");
