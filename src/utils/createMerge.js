import copy from './copy';

const createMerge = ({isDeep = false} = {}) => {
  const isShallow = !isDeep;
  const merge = (spec, object) => {
    if (spec && typeof spec === 'object' && object && typeof object === 'object') {
      let newObject = object;
      for (let key in spec) {
        if (spec.hasOwnProperty(key)) {
          const mergeValue = isShallow ? spec[key] : merge(spec[key], object[key]);
          if (newObject[key] !== mergeValue) {
            // Create a new object if we haven't done that yet.
            if (newObject === object) {
              newObject = copy(object);
            }
            newObject[key] = mergeValue;
          }
        }
      }
      return newObject;
    }
    return spec;
  };
  return merge;
};

export default createMerge;
