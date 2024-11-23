/** @param {NS} ns */
export async function main(ns) {
  ns.clearLog();
  ns.tail();
  ns.disableLog("codingcontract.attempt");
  ns.clearLog();
  const allCC = ["Total Ways to Sum II", "Generate IP Addresses", "Shortest Path in a Grid", "Sanitize Parentheses in Expression", "Find All Valid Math Expressions", "HammingCodes: Integer to Encoded Binary", "HammingCodes: Encoded Binary to Integer", "Proper 2-Coloring of a Graph", "Compression II: LZ Decompression", "Compression III: LZ Compression"];
  let success = 0;
  let extra;
  let type = "Sanitize Parentheses in Expression";
  const j = 1;
  ns.print(type);
  const t0 = performance.now();
  let ongoing = 0;
  for (let i = 0; i < j; i++) {
    const filename = ns.codingcontract.createDummyContract(type);
    const data = '()()a()((()()a((aa)'//ns.codingcontract.getData(filename);
    const [answer, extra] = sanitizeParenthesesInExpression(data);
    const result = ns.codingcontract.attempt(answer, filename);
    //ongoing += extra ?? 0;
    if (result === '') {
      ns.print(answer, " ", filename);
      ns.print(extra);
      ns.print(data);
      //ns.exit();
      continue;
    }

    success++;
  }
  const t1 = performance.now();
  ns.print(`${success}/${j}`);
  /*  ns.print(`${j} attempts took ${t1 - t0} ms. Average ${(t1 - t0) / j}`);
    ns.print(`Test thing took %${ongoing / (t1 - t0) * 100}`);
    ns.print(t1 - t0, '/', ongoing, ' = ', (t1 - t0) / ongoing); */
}

function sanitizeParenthesesInExpression(data = '') {
  let copy = data;
  let toCull = '';
  const answer = [];
  let nOpen = 0;
  let nClose = 0;
  let openX = 0;
  let closeX = 0;

  const t0 = performance.now();

  for (let i = 0, j = copy.length; i < j; ++i) {
    const char = copy.charAt(i);

    if (char === ')') {
      ++closeX;
    } else if (char === '(') {
      break;
    }
  }

  const t1 = performance.now();

  for (let i = copy.length - 1; i >= 0; --i) {
    const char = copy.charAt(i);

    if (char === '(') {
      ++openX;
    } else if (char === ')') {
      break;
    }
  }

  const t2 = performance.now();

  //trim invalid from front and back
  if (closeX > 0) {
    for (let i = 0; i < closeX; ++i) {
      const index = getCharIndex(copy, ')', 1);
      copy = spliceSlice(copy, index);
    }
  }

  const numXopen = countOccurrences(copy, '(') - openX + 1;

  if (openX > 0) {
    for (let i = 0; i < openX; ++i) {
      const indexXOpen = getCharIndex(copy, '(', numXopen);
      copy = spliceSlice(copy, indexXOpen);
    }
  }

  const t3 = performance.now();

  nOpen = countOccurrences(copy, '(');
  nClose = countOccurrences(copy, ')');
  let maxMoves = 0;
  //see which symbol has more to remove or check for only one solve
  if (nOpen > nClose) {
    toCull = '(';
    maxMoves = nOpen;
  } else if (nOpen < nClose) {
    toCull = ')';
    maxMoves = nClose;
  } else if (isValidParentheses(copy)) {
    return [copy];
  } else {
    //TODO process equal open/close but not valid.
  }

  let numCull = Math.max(nOpen, nClose) - Math.min(nOpen, nClose);
  if (numCull === 0) {
    numCull = 2;
  }
  const followed = ['followed'];
  const instructions = intToBinaryArray(maxMoves, numCull);

  const t4 = performance.now();




  for (let i = 0, j = instructions.length; i < j; ++i) {

    let check = instructions[i];
    let newStr = '';
    let count = 0;
    const build = [];
    /* if ((toCull === '(' && instructions[0] === '1') || (toCull === ')' && instructions[instructions.length - 1] === '1')) {
       continue;
     }*/
    for (let k = 0, l = copy.length; k < l; ++k) {

      const curChar = copy.charAt(k);

      if (curChar !== toCull) {
        newStr += curChar;
        build.push(`push(${curChar}`);
      } else if (check[count] === "1") {
        ++count;
        build.push(`skip(${curChar}`);
      } else if (check[count] === "0") {
        newStr += curChar;
        build.push(`push(${curChar}`);
        ++count;
      } else {
        newStr = '';
        break;
      }
      if (count >= check.length && k >= copy.length - 1) {
        newStr += copy.slice(i + 1);
        build.push(`slice(${copy.slice(i + 1)}`);
        break;
      }
    }
    answer.push(newStr);
    if (newStr.length > 0 && !answer.includes(newStr) && isValidParentheses(newStr)) {
      answer.push(i);
      followed.push([instructions[i], build]);

    }

  }

  const t5 = performance.now();
  //return [t0, t1, t2, t3, t4, t5];
  return [answer, followed];

}

function getCharIndex(string, char, index) {
  return string.split(char, index).join(char).length;
}

function countOccurrences(string, subString) {
  return string.split(subString).length - 1;
}

function spliceSlice(str, index) {
  // We cannot pass negative indexes directly to the 2nd slicing operation.
  if (index < 0) {
    index = str.length + index;
    if (index < 0) {
      index = 0;
    }
  }

  return str.slice(0, index) + str.slice(index + 1);
}

function intToBinaryArray(totalMoves, ones = 2) {
  const result = [];
  const combos = 2 ** totalMoves;
  if (ones === 0) {
    ones = 2;
  }
  for (let i = 0, j = combos; i < j; i++) {
    const counted = countSetBits(i);
    if (counted !== ones && ones !== 0) {
      continue;
    }
    let instructions = i.toString(2);
    instructions = ("000000000000000000000000000000000" + instructions).slice(-totalMoves);
    instructions = instructions.split("");
    result.push(instructions);
  }
  return result;
}

function isValidParentheses(str) {
  const stack = [];
  const pairs = {
    "(": ")"
  };

  for (let char of str) {
    if (pairs[char]) {
      stack.push(char);
    } else if (
      char === ")"
    ) {
      if (
        pairs[stack.pop()] !==
        char
      ) {
        return false;
      }
    }
  }

  return stack.length === 0;
}

function countSetBits(n) {
  var count = 0;
  while (n) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}

/** Random number between and including min through max.
 * @param {number} max - Maximum number to roll.
 * @param {number} min - Minimum number to roll.
 * @returns {number} result - Number chosen from min (inclusive) to max (inclusive).
 */
function die(max, min = 1) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
