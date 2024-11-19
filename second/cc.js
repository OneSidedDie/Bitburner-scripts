/** @param {NS} ns */
export async function main(ns) {
  ns.tail();
  ns.disableLog('sleep', 'disableLog');
  const solved = ["Unique Paths in a Grid II", "Unique Paths in a Grid I", "Compression I: RLE Compression", "Spiralize Matrix", "Algorithmic Stock Trader I", "Algorithmic Stock Trader II", "Merge Overlapping Intervals", "Array Jumping Game", , "Array Jumping Game II", "Encryption I: Caesar Cipher", "Subarray with Maximum Sum", "Total Ways to Sum", "Find Largest Prime Factor", "Minimum Path Sum in a Triangle"];
  const hosts = ns.read('hostNames.txt').split(',');
  while (true) {
    const contracts = lookForWork(ns, hosts);
    let result;
    let answer;
    for (const cct of contracts) {
      if (!solved.includes(cct.type)) {
        continue;
      }
      switch (cct.type) {
        case "Find Largest Prime Factor":
          answer = findLargestPrimeFactor(cct.data);
          break;
        case "Subarray with Maximum Sum":
          answer = subarrayWithMaximumSum(cct.data);
          break;
        case "Total Ways to Sum":
          answer = totalWaysToSum(cct.data);
          break;
        case "Total Ways to Sum II":
          break;
        case "Spiralize Matrix":
          answer = spiralizeMatrix(cct.data);
          break;
        case "Array Jumping Game":
          answer = arrayJumpingGame(cct.data);
          break;
        case "Array Jumping Game II":
          answer = arrayJumpingGameII(cct.data);
          break;
        case "Merge Overlapping Intervals":
          answer = mergeOverlappingIntervals(cct.data);
          break;
        case "Generate IP Addresses":
          break;
        case "Algorithmic Stock Trader I":
          answer = algorithmicStockTraderI(cct.data);
          break;
        case "Algorithmic Stock Trader II":
          answer = algorithmicStockTraderII(cct.data);
          break;
        case "Algorithmic Stock Trader III":
          break;
        case "Algorithmic Stock Trader IV":
          break;
        case "Minimum Path Sum in a Triangle":
          answer = minimumPathSumInATriangle(cct.data);
          break;
        case "Unique Paths in a Grid I":
          answer = uniquePathsInAGridI(cct.data);
          break;
        case "Unique Paths in a Grid II":
          answer = uniquePathsInAGridII(cct.data);
          break;
        case "Shortest Path in a Grid":
          break;
        case "Sanitize Parentheses in Expression":
          break;
        case "Find All Valid Math Expressions":
          break;
        case "HammingCodes: Integer to Encoded Binary":
          break;
        case "HammingCodes: Encoded Binary to Integer":
          break;
        case "Proper 2-Coloring of a Graph":
          break;
        case "Compression I: RLE Compression":
          answer = compressionI(cct.data);
          break;
        case "Compression II: LZ Decompression":
          break;
        case "Compression III: LZ Compression":
          break;
        case "Encryption I: Caesar Cipher":
          answer = encryptionICaesarCipher(cct.data);
          break;
        case "Encryption II: Vigenère Cipher":
          answer = encryptionIIVigenereCipher(cct.data);
          break;
        default:
          ns.tprint('New contract type found! ', cct.type, ' ', cct.filename, ' ', cct.host);
          ns.tprint('You should probably update your cc.js script.');
          ns.exit();
      }

      result = cct.submit(answer);

      if (result === '') {
        ns.tprint(cct.display());
        ns.tprint(`Could not solve ${cct.filename}.`)
        ns.exit();
      } else {
        ns.tprint(result);
      }

    }
    await ns.sleep(600000);
    ns.clearLog();
  }
}
/** @param {NS} ns
 * @param {string[]} hosts - Array with names of all available servers.
 * @param {object[]} contracts - Array of CodingContract objects.
 * @return {object[]} contracts - Updated array of CodingContract objects.
 */
export function lookForWork(ns, hosts, contracts = []) {
  for (const host of hosts) {
    const files = ns.ls(host, '.cct');
    if (files.length === 0) {
      continue;
    } for (const file of files) {
      if (contracts.find(({ filename }) => filename === file) === undefined) {
        const type = ns.codingcontract.getContractType(file, host);
        const data = ns.codingcontract.getData(file, host);
        const cct = new CodingContract(ns, file, type, host, data);
        contracts.push(cct);
        ns.print(cct.display());
      }
    }
  }

  return contracts;
}

function uniquePathsInAGridI(data) {
  const rows = data[0] - 1;
  const cols = data[1] - 1;
  if (rows < 0 || cols < 0) {
    return '';
  } else if (rows == 1 || cols == 1) {
    return rows + cols;
  } else if (rows == 0 || cols == 0) {
    return Math.max(rows, cols);
  }
  const total = rows + cols;
  const result = factorialize(total) / (factorialize(rows) * factorialize(cols));
  return result;
}

function compressionI(data) {
  const runs = [];
  let count = 1;
  for (const i in data) {
    const next = Number(i) + 1;
    if (count === 9 || data[i] !== data[next]) {
      runs.push(`${count}${data[i]}`)
      count = 1;
    } else if (data[i] === data[next]) {
      count++
    }
  }
  return runs.join("");
}

function spiralizeMatrix(data) {
  const max = data.length * data[0].length;
  const answer = [...data[0]];
  let round = 0;

  //edge case 1 row
  if (data.length === 1) {
    return answer;
  }

  loop:
  // @ignore-infinite
  while (true) {

    round++;
    //Down
    for (let row = round; row <= data.length - round; row++) {
      const col = data[0].length - round;
      answer.push(data[row][col]);
      if (answer.length >= max) { break loop };
    }

    //Left
    for (let col = data[0].length - 1 - round; col >= round - 1; col--) {
      const row = data.length - round;
      answer.push(data[row][col])
      if (answer.length >= max) { break loop };
    }

    //Up
    for (let row = data.length - 1 - round; row >= round; row--) {
      const col = round - 1;
      answer.push(data[row][col]);
      if (answer.length >= max) { break loop };
    }


    //Right
    for (let col = round; col <= data[0].length - round - 1; col++) {
      const row = round;
      answer.push(data[row][col]);
      if (answer.length >= max) { break loop };
    }
  }

  return answer;
}

function algorithmicStockTraderI(data) {
  const highest = Math.max(...data);
  const lowest = Math.min(...data);
  let best = 0;
  if (data.indexOf(lowest) < data.indexOf(highest)) {
    return highest - lowest;
  }

  for (let i = 0, j = data.length - 1; i < j; i++) {
    for (let k = i + 1; k < j + 1; k++) {
      if (data[k] - data[i] > best) {
        best = data[k] - data[i];
      }
    }
  }
  return best;
}


function algorithmicStockTraderII(data) {
  let isPeak = false;
  let profit = 0;
  let start = true;

  for (let i = 0, j = data.length; i < j; i++) {

    //Check last day of trading and sell if we can.
    if (i === j - 1 && !isPeak && !start) {
      profit += data[i];
      break;
    }

    if (data[i] > data[i + 1]) {
      if (!isPeak) {
        isPeak = true;
        if (start) {
          start = false;
          continue;
        }

        //sell
        profit += data[i];
      }
    } else if (data[i] === data[i + 1]) { //Find the next peak or valley.  It's flat here.
      continue;
    } else if (data[i] < data[i + 1]) { //Starts in a valley

      if (isPeak || start) {

        //buy
        profit -= data[i];
        isPeak = false;
      }

      if (start) {
        start = false;
      }

    }
  }
  return profit;
}


function mergeOverlappingIntervals(data) {
  const sorted = [...data];
  sorted.sort((a, b) => a[0] - b[0]);
  const answer = [sorted[0]];
  let step = 0;
  for (const index in sorted) {
    const i = Number(index);
    if (i === sorted.length) {
      break;
    }


    if (answer[step][1] >= sorted[i][0]) {
      const first = Math.min(answer[step][0], sorted[i][0]);
      const second = Math.max(answer[step][1], sorted[i][1]);
      answer[step] = [first, second];
    } else {
      step++;
      answer[step] = sorted[i];
    }
  }
  return answer;
}


function arrayJumpingGameII(data) {
  const reduced = arrayJumpingGame(data, true);
  let index = 0;
  let jumpsMade = 0;
  if (reduced === 0) {
    return 0;
  } else if (reduced[0] >= reduced.length - 1) {
    return 1;
  }

  while (index < reduced.length) {
    let jump = reduced[index];
    let section = reduced.slice(index + 1, index + jump + 1);
    let best = 0;
    let bestIndex = 0;

    for (let j = 0; j <= section.length; j++) {
      if (section[j] === 0) {
        continue;
      } else {
        if (section[j] + j >= best) {
          bestIndex = j;
          best = section[j] + j;
        }
      }
    }

    index += bestIndex + 1;
    jumpsMade++;

    if (index + section[bestIndex] >= reduced.length - 1) {
      jumpsMade++;
      break;
    }
  }

  return jumpsMade;
}

function arrayJumpingGame(data, ii = false) {
  const copy = [...data];
  let cull = 0;
  if (!data.includes(0) || data[0] + 1 >= data.length) {
    if (ii) {
      return copy;
    }
    return 1;
  } else if (data[0] === 0) {
    return 0;
  }


  //predict and remove unviable jumps. Loop until no more changes
  do {
    cull = 0;
    if (copy.reduce((a, b) => a + b, 0) === 0) {
      break;
    }
    for (const index in copy) {
      const i = Number(index);
      const jump = copy[i] + 1;
      const canJumpTo = copy.slice(i + 1, i + jump);
      const testJump = canJumpTo.reduce((a, b) => a + b, 0);

      if (copy[i] === 0) {
        if (i === 0) {
          return 0;
        }
        continue;
      }

      if (i + jump >= copy.length) {
        if (ii) {
          return copy;
        }
        return 1;

      }

      if (testJump === 0) {
        copy[i] = 0;
        cull++;;
        break;
      }
    }

  } while (cull > 0);

  return 0;

}

function encryptionICaesarCipher(data) {

  const alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  const text = data[0];
  const shift = data[1] % 26;
  let answer = '';

  if (shift === 0) {
    return text;
  }

  for (const letter of text) {

    if (letter === ' ') {

      answer += ' ';

    } else {

      const aIndex = alpha.indexOf(letter);
      let position = aIndex - shift;

      if (position < 0) {

        position = 26 - Math.abs(position);

      }

      answer += alpha[position];

    }
  }

  return answer;

}


function totalWaysToSum(data) {
  const n = data;
  var a = new Array(n + 1);
  a[0] = 1n;

  for (let i = 1; i <= n; i++) {
    a[i] = 0n;
    for (let k = 1, s = 1; s <= i;) {
      a[i] += (k & 1 ? a[i - s] : -a[i - s])
      k > 0 ? (s += k, k = -k) : (k = -k + 1, s = k * (3 * k - 1) / 2)
    }
  }

  return Number(a[n]) - 1;
}


function subarrayWithMaximumSum(data = []) {
  let sums = [];

  if (data.length === undefined) {
    return data;
  }

  for (let i = 0, j = data.length; i < j; i++) {
    for (let k = 0; k < j + 1; k++) {
      const look = Math.min(i + k, j) + 1;
      const subArray = data.slice(i, look);
      const sum = subArray.reduce((a, b) => {
        return a + b
      }, 0);
      sums.push(sum);
    }
  }
  return Math.max(...sums);
}

function findLargestPrimeFactor(data) {
  for (let i = 1; i < data; i++) {
    const guess = data / i;
    if (isPrime(guess)) {
      return guess;
    }
  }
  return 0;
}


function uniquePathsInAGridII(data) {
  const copy = [];
  const row = [];
  const downs = data.length - 1;
  const rights = data[0].length - 1;

  for (let i = 0; i <= rights; i++) {
    row.push(0);
  }
  for (let i = 0; i <= downs; i++) {
    copy[i] = [...row];
  }

  copy[downs][rights] = 1;

  for (let i = downs; i >= 0; i--) {
    for (let j = rights; j >= 0; j--) {
      let peekD = 0;
      let peekR = 0;
      if ((i === downs && j === rights) || data[i][j] === 1) {
        continue;
      }
      if (i !== downs) {
        peekD = copy[i + 1][j];
      }
      if (j !== rights) {
        peekR = copy[i][j + 1];
      }
      copy[i][j] = peekD + peekR;
    }
  }

  return copy[0][0];
}


function minimumPathSumInATriangle(data = []) {
  const depth = data.length;
  const mins = data[depth - 1].slice();
  for (let i = depth - 2; i > -1; --i) {
    for (let k = 0; k < data[i].length; ++k) {
      const test1 = mins[k] + data[i][k];
      const test2 = mins[k + 1] + data[i][k];
      mins[k] = Math.min(test1, test2);
    }
  }
  return mins[0];
}


function isPrime(num) {
  if (!Number.isInteger(num)) {
    return false;
  }
  for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
}

function factorialize(num) {
  if (num < 0) {
    return -1;
  } else if (num === 0) {
    return 1;
  } else {
    return (num * factorialize(num - 1));
  }
}


class CodingContract {
  #ns;
  #tries;
  #filename;
  #host;
  #data;
  #type;
  /**
   * Create instance of a coding contract.
   * @param {NS} ns
   * @param {string} filename - Filename of the contract
   * @param {string} type - Name describing the type of problem posed by the Coding Contract.
   * @param {string} host - Hostname of the server containing the contract.
   * @param {any} data - The specified contract’s data, data type depends on contract type.
   * @param {number} tries - How many attempts are remaining for the contract.
   */
  constructor(ns, filename, type, host, data, tries = 10) {
    this.#ns = ns;
    this.#type = type;
    this.#filename = filename;
    this.#host = host;
    this.#data = data;
    this.#tries = tries;
  }

  /** Submits and attempt at the coding contract and returns the result (Success text on success and empty string on failure)
   * @param {string | number | any []} answer - Attempted solution for the contract.
   */
  submit(answer) {
    this.#tries--;
    const result = this.#ns.codingcontract.attempt(answer, this.#filename, this.#host);
    return result;
  }

  /** @return {object} Returns object with basic data of the Coding Contract. */
  display() {
    return { 'host': this.#host, 'filename': this.#filename, 'type': this.#type };
  }

  /** @return {any} data - The specified contract’s data, data type depends on contract type. */
  get data() {
    return this.#data;
  }

  /** @return {number} tries - How many attempts are remaining for the contract. */
  get triesLeft() {
    return this.#tries;
  }

  /** @return {string} Name describing the type of problem posed by the Coding Contract. */
  get type() {
    return this.#type;
  }

  /** @return {string} filename - Filename of the contract */
  get filename() {
    return this.#filename;
  }

  /** @return {string} host - Hostname of the server containing the contract. */
  get host() {
    return this.#host;
  }
}
