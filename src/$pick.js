import objectAssign from 'object-assign';
import copy from './utils/copy';
import $traverse from './$traverse';
import isNextNavigatorConstant from './utils/isNextNavigatorConstant';
import {isNone} from './$none';

const eachArg = (fn, args, object) => {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (Array.isArray(arg)) {
      for (let j = 0; j < arg.length; j++) {
        const subArg = arg[j];
        if (subArg in object) {
          fn(subArg);
        }
      }
    } else {
      if (arg in object) {
        fn(arg);
      }
    }
  }
};

const $pick = (...args) => $traverse({
  select: (object, next) => {
    const picked = {};
    eachArg((key) => {
      picked[key] = object[key];
    }, args, object);
    return next(picked);
  },
  update: (object, next, path, index) => {
    // Is it worth avoiding cloning if nothing changes?
    const newObject = copy(object);
    // We cheat a little and look ahead to see if `next` is going to return
    // a constant. If it is, then there's no reason to get a proper pick of
    // the object, because we know it won't be used anyway.
    // CONSIDER THIS AN EXPERIMENT. DON'T USE IT IN YOUR NAVIGATORS.
    if (isNextNavigatorConstant(path, index)) {
      // Call `next` with no args, because it's a constant.
      const newPicked = next();
      if (isNone(newPicked) || newPicked == null) {
        // Delete all picked keys.
        eachArg(key => {
          delete newObject[key];
        });
      } else {
        if (typeof newPicked !== 'object') {
          throw new Error('$pick expected next navigator to return an object. Did you forget $each?');
        }
        // Delete any removed properties.
        eachArg((key) => {
          if (!(key in newPicked)) {
            delete newObject[key];
          }
        }, args, object);
        // Mix in the new properties.
        objectAssign(newObject, newPicked);
      }
    // Otherwise, we do have to slice the array so it can be passed to `next`.
    } else {
      const pickedKeys = [];
      const picked = {};
      eachArg((key) => {
        pickedKeys.push(key);
        picked[key] = object[key];
      }, args, object);
      const newPicked = next(picked);
      if (isNone(newPicked) || newPicked == null) {
        // Delete all picked keys
        pickedKeys.forEach((key) => {
          delete newObject[key];
        });
      } else {
        if (typeof newPicked !== 'object') {
          throw new Error('$pick expected next navigator to return an object. Did you forget $each?');
        }
        // Delete any removed properties.
        pickedKeys.forEach((key) => {
          if (!(key in newPicked)) {
            delete newObject[key];
          }
        });
        // Mix in the new properties.
        objectAssign(newObject, newPicked);
      }
    }
    return newObject;
  }
});

export default $pick;
