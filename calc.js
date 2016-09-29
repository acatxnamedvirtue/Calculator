window.calcHistory = "0";
window.current = "0";

function handleClick(e) {
  e.preventDefault();
  var prevEquals = false;
  var keypress = e.currentTarget.id;

  //handle previous equals
  if(window.calcHistory.includes("=")) {
    prevEquals = true;
    window.calcHistory = window.calcHistory.slice(window.calcHistory.indexOf("=") + 1);
  }

  //handle digit limit
  if((window.current.length === 8 || window.calcHistory.length === 24) && keypress !== "-" && keypress !== "+" && keypress !== "/" && keypress !== "X" && keypress !== "CE" && keypress !== "AC") {
    window.current = "0";
    window.calcHistory = "Digit Limit Met";
    updateCalc();
    return;
  }

  //handle AC
  if(keypress === "AC") {
    resetCalc();
  }

  //handle CE
  if(keypress === "CE") {
    if (window.calcHistory[window.calcHistory.length - 1] === "-" ||
        window.calcHistory[window.calcHistory.length - 1] === "+" ||
        window.calcHistory[window.calcHistory.length - 1] === "/" ||
        window.calcHistory[window.calcHistory.length - 1] === "X") {
      window.current = "0";
      window.calcHistory = window.calcHistory.slice(0,window.calcHistory.length - 1);
    } else if(window.calcHistory.includes("+") ||
              window.calcHistory.includes("-") ||
              window.calcHistory.includes("/") ||
              window.calcHistory.includes("X")) {
      var lastOperation;
      for(var i = 0; i < calcHistory.length; i++) {
        if(calcHistory[i] === "-" || calcHistory[i] === "+" || calcHistory[i] === "/" || calcHistory[i] === "X") {
          lastOperation = i;
        }
      }
      window.calcHistory = window.calcHistory.slice(0, lastOperation + 1);
      window.current = "0";
    } else {
      resetCalc();
    }
  }

  //handle zero
  if(keypress === "zero") {
    if(window.current !== "0") {
      window.calcHistory += "0";
      window.current += "0";
    }
  }

  //handle 1-9
  if(keypress >= "1" && keypress <= "9") {
    //handle leading 0;
    if(window.current === "0" && window.calcHistory === "0") {
      window.current = keypress;
      window.calcHistory = keypress;
    } else if(window.current === "-" || window.current === "+" || window.current === "/" || window.current === "X") {
      window.current = keypress;
      window.calcHistory += keypress;
    } else if(window.current === "0" && window.calcHistory !== "0") {
      window.current = keypress;
      window.calcHistory += keypress;
    } else {
      window.current += keypress;
      window.calcHistory += keypress;
    }
  }

  //handle +,-,/,X
  if(keypress === "+" || keypress === "-" || keypress === "/" || keypress === "X") {
    //prevent multiple operations, e.g 3++5
    if(window.calcHistory[window.calcHistory.length - 1] === "+" ||
       window.calcHistory[window.calcHistory.length - 1] === "-" ||
       window.calcHistory[window.calcHistory.length - 1] === "/" ||
       window.calcHistory[window.calcHistory.length - 1] === "X") {
      window.current = keypress;
      window.calcHistory = window.calcHistory.slice(0, window.calcHistory.length - 1) + keypress;
    } else {
      window.current = keypress;
      window.calcHistory += keypress;
    }
  }

  // handle period
  if(keypress === ".") {
    if(!window.current.includes(".")) {
      if(window.current === "+" || window.current === "-" || window.current === "X" || window.current === "*") {
        window.current = "0.";
        window.calcHistory += "0.";
      } else {
        window.calcHistory += ".";
        window.current += ".";
      }
    }
  }

  // handle equals
  if(keypress === "equals" && !prevEquals && (window.calcHistory.includes("-") || window.calcHistory.includes("+") || window.calcHistory.includes("/") || window.calcHistory.includes("X"))) {
    if(window.calcHistory[window.calcHistory.length - 1] !== "+" && window.calcHistory[window.calcHistory.length - 1] !== "-" && window.calcHistory[window.calcHistory.length - 1] !== "X" && window.calcHistory[window.calcHistory.length - 1] !== "/") {
      equals();
    }
  }

  updateCalc();
}

function updateCalc() {
  $('.history').text(window.calcHistory);
  $('.current').text(window.current);
}

function resetCalc() {
  window.calcHistory = "0";
  window.current = "0";
  updateCalc();
}

function equals() {
  var total = "";
  var operand1 = "";
  var operand2 = "";
  var current = "";
  var operation = "";
  var nextOperation = "";

  for(var i = 0; i <= window.calcHistory.length; i++) {
    if(operand1 !== "" && operand2 !== "" && operation !== "") {
      if(total === "") { total = parseFloat(operand1); }
      switch (operation) {
        case "-":
          total -= parseFloat(operand2);
          break;
        case "+":
          total += parseFloat(operand2);
          break;
        case "/":
          total /= parseFloat(operand2);
          break;
        case "X":
          total *= parseFloat(operand2);
          break;
      }

      operation = nextOperation;
      nextOperation = "";
      operand2 = "";
      current += window.calcHistory[i];
      if(i === window.calcHistory.length - 1) {operand2 = current;}
    } else if((window.calcHistory[i] === "-" || window.calcHistory[i] === "+" || window.calcHistory[i] === "/" || window.calcHistory[i] === "X") && i !== 0) {
      if(operation === "") {
        operation = window.calcHistory[i];
      } else {
        nextOperation = window.calcHistory[i];
      }
      if(operand1 === "") {
        operand1 = current;
      } else if(operand2 === "") {
        operand2 = current;
      }
      current = "";
    } else {
      current += window.calcHistory[i];
      if(i === window.calcHistory.length - 1) { operand2 = current; }
    }
  }

  if(total.toString().length >= 8){
    total = total.toFixed(7);
  }

  window.current = total;
  window.calcHistory += "=" + total;
}
