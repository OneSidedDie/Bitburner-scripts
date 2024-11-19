/** @param {NS} ns */
export async function main(ns) {
  ns.tail();
  let success = 0;
  let extra;
  ns.disableLog('codingcontract.attempt');
  const j = 100000;
  for (let i = 0; i < j; i++) {
    const filename = ns.codingcontract.createDummyContract('Array Jumping Game II');
    const data = ns.codingcontract.getData(filename, 'home');
    const answer = arrayJumpingGameII(data);
    const result = ns.codingcontract.attempt(answer, filename, 'home');
    //ns.print(answer);
    //ns.print(result);
    if (result === '') {
      ns.print(`${answer} ${filename}`);
      ns.print('-------------------------------------');
      ns.print(data);
      ns.print('-------------------------------------');
      ns.print(extra);
      ns.print('-------------------------------------');
      continue;
    }
    success++;
  }
  ns.print(success, "/", j);
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
