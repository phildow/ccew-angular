
// Instructions
// cd into the correct directory and run this file with `node higher-order.js`
// You will see a number of failing tests.
// Complete each of the problems by filling in the provided variables and functions
// with the correct values to get the tests to pass.



// 1.
// Create a select function that works as a higher order function. 
// It takes two parameters: a data parameter that is an array, and 
// a callback parameter that is a function.
//
// Select loops through the items in the data parameter, calling the
// callback for each one. In this respects it is like the map function
//
// The callback function takes a single paramter, the item currently being
// looped through, and it returns either true or false. If the callback
// returns true, then select adds the current item to a local array. If it 
// returns false, it does not.

// When select is finished looping through each item in data, it returns
// the local array, which now contains some of the items from data, namely,
// those for which the callback function returns true.

// 1, 1, 2, 3, 5, 8, 13, 21

function select() {
  
}

// Example usage
// young ends up as an array which contains two items: [16, 21]

var ages = [16,21,30,45,60,75];
var young = select(ages, function(item) {
  return (item <= 25);
});


// 2.
// Create a reject function that works as a higher order function.
// It is the opposite of select. Like select it takes data and callback
// arguments, but now only return those items that the callback function
// returns false for.

function reject() {
  
}

// Example usage
// old ends up as an array which contains four items: [30, 45, 60, 75]

var ages = [16,21,30,45,60,75];
var old = reject(ages, function(item) {
  return (item <= 25);
});


// 3.
// Create a find function that works as a higher order function.
// Find takes two parameters: a data parameter that is an array,
// and a callback parameter that is a function.
//
// Find should return the first item it encouters for which calling
// the callback with it returns true.
//
// If the callback never returns true for any of the items in the data
// array, it should return undefined.

function find() {
  
}

// Example usage
// firstEven ends up as the first even number in the array: 26
// the % operator (or 'mod operator') returns the remainder after 
// dividing the left hand side by the right hand

var nums = [1,89,45,26,57,34];
var firstEven = find(nums, function(item) {
  return (item % 2 == 0);
});






// ==================================================
// TESTS

var tofilter = [0,1,2,3,4,5,6,7,8,9,10];
var filtered = select(tofilter, function(item) {
  return (item % 2 == 0);
});

if (typeof filtered == 'object' && filtered[0] == 0 && filtered[1] == 2 && filtered[2] == 4 &&
  filtered[3] == 6 && filtered[4] == 8 && filtered[5] == 10) {
  console.log("test 1 passed");
} else {
  console.log("test 1 failed *");
}


var toreject = [0,1,2,3,4,5,6,7,8,9,10];
var rejected = reject(toreject, function(item) {
  return (item % 2 == 0);
});

if (typeof rejected == 'object' && rejected[0] == 1 && rejected[1] == 3 && rejected[2] == 5 &&
  rejected[3] == 7 && rejected[4] == 9) {
  console.log("test 2 passed");
} else {
  console.log("test 2 failed *");
}


var testnums = [6,34,56,77,68,91,23];
var firstOdd = find(testnums, function(item) {
  return (item % 2 == 1);
});

if (firstOdd == 77) {
  console.log("test 3 passed");
} else {
  console.log("test 3 failed *");
}

