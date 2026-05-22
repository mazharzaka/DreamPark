const fs = require('fs');

const file = 'd:/bit68/DreamPark/my-app/src/components/BookingFlow.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix closing parenthesis for arrow functions
content = content.replace(/dispatch\((set[A-Za-z]+)\(([^)]+)\)\)\)}/g, 'dispatch($1($2))}');

fs.writeFileSync(file, content);
console.log("Fixed arrow parens");
