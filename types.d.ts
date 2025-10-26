import { connection } from "mongoose";

//this file is used to declare types


// .d.ts files are TypeScript declaration files
// They don’t contain executable cod
// They are only used to declare types, interfaces, or global variables.
// Purpose in your project:
// You want to declare a global Mongoose connection variable that TypeScript recognizes.
// By putting it in types.d.ts, you can access global.mongoose in any file without TypeScript errors.

declare global{    //In Node.js, global is like window in the browser.
  var mongoose:{
    connection:Connection | null;
    promise:Promise<Connection> | null;
  }
}

export {};