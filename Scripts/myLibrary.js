let randomNumber = (min, max) => {
    return Math.floor(Math.random()*(max-min)+min);
}

const squaresSum = (num1, num2, sum) => {
    // Calculate the ratio of num2 to num1
    const ratio = num2 / num1;
  
    // Solve for newNum1 using the equation derived from the conditions
    const newNum1 = Math.sqrt(sum / (1 + ratio * ratio));
  
    // Calculate newNum2 using the ratio and newNum1
    const newNum2 = newNum1 * ratio;
  
    // Return the result as an array
    return [newNum1, newNum2];
  };