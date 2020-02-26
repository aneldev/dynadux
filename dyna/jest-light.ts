let HIDE_SUCCESS_VALIDATION = true;

export const jasmine = {
  DEFAULT_TIMEOUT_INTERVAL: 2000, // todo: timeout interval is not checked
};

// init section

let _mockJest: any = null;

const clearTest = () => {
  _mockJest = {
    errors: 0,
    passed: 0,
    descriptions: []
  };
};
clearTest();

export const describe = (description: string, cbDefineIts: () => void) => {
  _mockJest.descriptions.push({
    description,
    its: []
  });

  cbDefineIts();
  startTests();
};

describe.skip = (
  description: string,
  run?: (() => void) | ((done: () => void) => void),
) =>
  describe(description, () => console.log('               --> skipped'));

export const it = (
  description: string,
  cbTest: (
    (() => void)
    | ((done: () => void) => void)
    | (() => Promise<void>)
    ),
) => {
  _mockJest.descriptions[_mockJest.descriptions.length - 1].its.push({
    description,
    cbTest
  });
  startTests();
};

it.skip = (
  description: string,
  run?: (() => void) | ((done: () => void) => void),
) =>
  it(description, () => console.log('          --> skipped'));

export const expect = (expectValue: any) => {
  return comparisons(expectValue);
};

export const fail = (error: any) => {
  console.log(`        FAILED, by error`, error);
  _mockJest.errors++;
};

// start and functions section

const comparisons = (expectValue: any, not = false) => {
  return {
    get not() {
      return comparisons(expectValue, true)
    },
    toBe: (toBeValue: any) => {
      let result = expectValue === toBeValue;
      if (not) result = !result;
      if (result) {
        if (!HIDE_SUCCESS_VALIDATION) console.log(`        Success, equal value [${expectValue} === ${toBeValue}]`);
        _mockJest.passed++;
      }
      else {
        console.log(`        FAILED, ${not ? "not " : ""}expected [${toBeValue}] but received [${expectValue}]`);
        _mockJest.errors++;
      }
    }
  }
};

let startTimer: any = null;

function startTests() {
  if (startTimer) clearTimeout(startTimer);
  startTimer = setTimeout(executeTests, 100);
}

function executeTests() {
  let descriptions = [].concat(_mockJest.descriptions);

  const processTheNextDescription = () => {
    let description = descriptions.shift();
    if (description) {
      executeADescription(description, () => {
        processTheNextDescription();
      });
    }
    else {
      finished();
    }
  };

  // start
  processTheNextDescription();
}

function executeADescription(description: any, cbCompleted: () => void) {
  console.log('Description::: Start:', description.description);
  let its = [].concat(description.its);

  executeIts(its, () => {
    console.log('Description::: Finished:', description.description);
    console.log('');
    cbCompleted();
  });
}

interface IIt {
  description: string;
  cbTest: (
    ((done?: () => void) => void)
    |
    (() => Promise<void>)
    );
}

function executeIts(its: IIt[], cbCompleted: () => void) {
  let it = its.shift();
  if (!it) {
    cbCompleted();
    return;
  }

  console.log('    it:::', it.description);
  if (it.cbTest.length === 0) {
    it.cbTest();
    executeIts(its, cbCompleted);
  }
  else {
    it.cbTest(() => {
      executeIts(its, cbCompleted);
    });
  }
}

function exit(code: number) {
  if (typeof process !== 'undefined' && typeof process.exit !== 'undefined') {
    process.exit(code);
  }
}

function finished() {
  let report = 'All TEST finished, results:' + ' ' + 'errors:' + ' ' + _mockJest.errors + ' ' + 'passed:' + ' ' + _mockJest.passed;
  console.log('');
  if (_mockJest.errors) {
    console.log(' xx   xx ');
    console.log('  xx xx  ');
    console.log('   xxx   ');
    console.log('  xx xx  ');
    console.log(' xx   xx ' + report);
    exit(100);
  }
  else {
    console.log('      vv');
    console.log('     vv');
    console.log('vv  vv');
    console.log(' vvvv');
    console.log('  vv      ' + report);
    exit(0);
  }
}
