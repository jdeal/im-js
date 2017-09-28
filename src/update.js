import {updateKey} from './$traverse';
import {curry2} from './utils/curry';
import arrayify from './utils/arrayify';
import {undefinedIfNone} from './$none';
import {traverseEach} from './traverse';
import {unwrap} from './utils/data';

// update is a traverse that has no state or result function.
const update = (path, obj) => path == null ?
  obj :
  undefinedIfNone(unwrap(traverseEach(updateKey, undefined, undefined, arrayify(path), obj, 0)));

export default curry2(update);
