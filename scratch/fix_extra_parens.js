const fs = require('fs');

const file = 'd:/bit68/DreamPark/my-app/src/components/BookingFlow.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix extra parenthesis at the end of lines
content = content.replace(/\)\)\);/g, '));');

// And just in case without semicolon
content = content.replace(/\)\)\)\n/g, '))\n');

fs.writeFileSync(file, content);
console.log("Fixed extra parens");
