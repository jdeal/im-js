import test from 'ava';

import 'babel-core/register';

import {
  set,
  $eachValue,
  $eachKey,
  $eachPair,
  $none,
  $slice,
  $default
} from 'qim/src';

test('set to value', t => {
  t.deepEqual(
    set(['x'], 2, {x: 1}),
    {x: 2}
  );
});

test('remove key', t => {
  t.deepEqual(
    set(['x'], $none, {x: 1, y: 2}),
    {y: 2}
  );
});

test('remove item', t => {
  t.deepEqual(
    set([0], $none, ['a', 'b']),
    ['b']
  );
});

test('remove all keys', t => {
  t.deepEqual(
    set([$eachValue], $none, {x: 1, y: 2}),
    {}
  );
});

test('remove all items', t => {
  t.deepEqual(
    set([$eachValue], $none, ['a', 'b']),
    []
  );
});

test('remove all keys with $none', t => {
  t.deepEqual(
    set([$eachKey], $none, {x: 1, y: 2}),
    {}
  );
});

test('remove all pairs from array with $none', t => {
  t.deepEqual(
    set([$eachPair], $none, ['a', 'b']),
    []
  );
});

test('remove all pairs from object with $none', t => {
  t.deepEqual(
    set([$eachPair], $none, {x: 1, y: 2}),
    {}
  );
});

test('replace slice', t => {
  t.deepEqual(
    set([$slice(0, 2)], ['x', 'y'], ['a', 'b', 'c', 'd']),
    ['x', 'y', 'c', 'd']
  );
});

test('stop if path is invalid', t => {
  t.throws(() => {
    set(['x', 'y'], 0, {});
  });
});

test('fill in path with $default', t => {
  t.deepEqual(
    set(['x', $default({}), 'y'], 0, {}),
    {x: {y: 0}}
  );
  t.deepEqual(
    set(['x', $default([]), 0], 1, {}),
    {x: [1]}
  );
});
