addCustomAssertions(QUnit.assert);

function addCustomAssertions(assert) {
  Object.assign(assert, {
    isFunction: assertIsFunction,
    includes: assertIncludes,
    attrIncludes: attributesInclude,
  });
}

function assertIsFunction(func, message = 'is a function') {
  const result = {
    result: func instanceof Function,
    actual: func,
    expected: typeof (() => {}),
    message,
  };
  this.pushResult(result);
}

function assertIncludes(target, search, message) {
  let result;
  let actual;
  if (Array.isArray(search)) {
    actual = search.filter(value => target.includes(value));
    result = actual.length === search.length;
  } else {
    result = target.includes(search);
    actual = target;
  }
  const resultObj = {
    result,
    actual,
    expected: search,
    message,
  };
  this.pushResult(resultObj);
}

function attributesInclude(element, expected, message) {
  const actual = {};
  const result = Object.keys(expected).every(attrEqual);

  function attrEqual(attr) {
    let passes = true;
    const expectedVal = expected[attr];
    const actualVal = element.getAttribute(attr);
    if (!actualVal) {
      passes = false;
    } else {
      actual[attr] = actualVal;
    }
    if (actualVal != expectedVal) { // eslint-disable-line eqeqeq
      passes = false;
    }
    return passes;
  }
  this.pushResult({
    result,
    expected,
    actual,
    message,
  });
}
