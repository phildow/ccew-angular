
// Instructions
// cd into the correct directory and run this file with `node objects.js`
// You will see a number of failing tests.
// Complete each of the problems by filling in the provided variables and functions
// with the correct values to get the tests to pass.


// 1.
// Create an object with a name property and a getName method. The getName
// method should return the value in the name property.

var obj1 = {
  name: "OK Coders"
};


// 2.
// Create an object with four properties: address, city, state, zip
// Add a function mailingAddress that returns a string composed of the four
// properties with the following format:
//    address
//    city, state zip
// For example:
//    419 Foobar St.
//    Oklahoma City, OK 73069
// When composing strings, use the "\n" sequence to represent a newline.
// Pay special attention to the string formatting!
// Use console.log if you need help debugging

var obj2 = {
  address: "419 Foobar St.",
  city: "Oklahoma City",
  state: "OK",
  zip: "73003"
}


// 3.
// Create an object with one property, age, and one method, canDrink.
// The canDrink method should return true if and only if the age is greater than
// or equal to 21.

var obj3 = {
  age: 19
};








// ==================================================
// TESTS

obj1.name = "Philip Dow";
if ( obj1.getName && typeof obj1.getName == 'function' && obj1.getName() == obj1.name ) {
  console.log("test 1 passed");
} else {
  console.log("test 1 failed *");
}


obj2.address = "420 Qux Street";
if ( obj2.mailingAddress && typeof obj2.mailingAddress == 'function' ) {
  var mailing = obj2.mailingAddress();
  if (mailing == "420 Qux Street\nOklahoma City, OK 73003") {
    console.log("test 2 passed");
  } else {
    console.log("test 2 failed *");
  }
} else {
  console.log("test 2 failed *");
}


if ( obj3.canDrink && typeof obj3.canDrink == 'function' && 
   (obj3.age = 18) && obj3.canDrink() == false &&
   (obj3.age = 45) && obj3.canDrink() == true ) {
  console.log("test 3 passed");
} else {
  console.log("test 3 failed *");
}
