const { test } = QUnit;

QUnit.module("openTriviaDB");
test( "openTriviaDB", assert => {
  assert.ok(openTriviaDB, "exists" );
  assert.ok(typeof openTriviaDB === 'object', "is an object")
});
