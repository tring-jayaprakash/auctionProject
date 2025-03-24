"use strict";
function greet(name, age) {
    return `Hello, ${name}. ${age ? "Your age is " + age : ""}`;
}
console.log(greet("Alice"));
console.log(greet("Bob", 30));
