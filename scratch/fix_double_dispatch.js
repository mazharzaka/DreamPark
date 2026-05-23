const fs = require('fs');

const file = 'd:/bit68/DreamPark/my-app/src/components/BookingFlow.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix double dispatches
content = content.replace(/dispatch\(dispatch\(/g, 'dispatch(');

// Wait, the double dispatch caused `dispatch(dispatch(setGeneratedPass({...` which is missing a closing parenthesis at the end of the block.
// Let's check `dispatch(dispatch(setStep(3)));` -> this will become `dispatch(setStep(3));` which is fine.
// What about `dispatch(dispatch(setGeneratedPass({...}));`? Wait, line 214 is `}));` but we need `}));` or `}));`?
// If it was `dispatch(dispatch(setGeneratedPass({ ... }));` and we replace `dispatch(dispatch(` with `dispatch(`, we get `dispatch(setGeneratedPass({ ... }));` which has balanced parenthesis!
// Wait! Line 214 has `}));` but `dispatch(dispatch(` means it opened TWO parenthesis. It closed with TWO `))` at the end? Yes! So if we remove one opening parenthesis, we must remove one closing parenthesis!
// Let's verify line 214: it says `}));`
// Oh, `dispatch(dispatch(setGeneratedPass({` has 3 opening parentheses.
// Line 214 has `}));` which has 2 closing parentheses. So it was missing a closing parenthesis!!
// If we replace `dispatch(dispatch(` with `dispatch(`, we will have 2 opening parentheses and 2 closing parentheses. So it WILL BE BALANCED!

fs.writeFileSync(file, content);
console.log("Fixed double dispatch");
