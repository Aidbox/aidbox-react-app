function match(o: Record<string, any>, pattern: Record<string, any>) {
  try {
    return Object.keys(pattern).reduce((acc, k) => acc && o[k] === pattern[k], true);
  } catch (e) {
    return false;
  }
}

/*
  See https://clojuredocs.org/clojure.core/get-in
*/
export const getIn = (obj: Record<string, any>, path: any, defaultValue?: any) => {
  const result = path.reduce(
    (o: any, k: any) => {
      if (o == null) {
        return null;
      }
      if (typeof k === 'string' && typeof o === 'object') {
        return o[k];
      }
      if (typeof k === 'number' && Array.isArray(o)) {
        return o[k];
      }
      if (typeof k === 'object' && Array.isArray(o)) {
        return o.filter((el) => match(el, k));
      }
      if (typeof k === 'function' && Array.isArray(o)) {
        return o.filter(k);
      }
      return null;
    },
    obj,
    path,
  );
  return result || defaultValue;
};

export function deepEqual(object1: Record<string, any>, object2: Record<string, any>) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
      return false;
    }
  }

  return true;
}

function isObject(object: any) {
  return object != null && typeof object === 'object';
}

export function deepMerge(...objects: any[]) {
  function deepMergeInner(target: any, source: any) {
    Object.keys(source).forEach((key) => {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        target[key] = targetValue.concat(sourceValue);
      } else if (isObject(targetValue) && isObject(sourceValue)) {
        target[key] = deepMergeInner(Object.assign({}, targetValue), sourceValue);
      } else {
        target[key] = sourceValue;
      }
    });

    return target;
  }

  if (objects.length < 2) {
    throw new Error('deepMerge: this function expects at least 2 objects to be provided');
  }

  if (objects.some((object) => !isObject(object))) {
    throw new Error('deepMerge: all values should be of type "object"');
  }

  const target = objects.shift();
  let source;

  while ((source = objects.shift())) {
    deepMergeInner(target, source);
  }

  return target;
}

export const formatName = (name: any) => {
  const firstName = getIn(name, ['given', 0]);
  const lastName = getIn(name, ['family']);
  return `${firstName} ${lastName}`;
};
