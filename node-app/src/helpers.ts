import { TManifestOperation, TOperationRequestType } from '@aidbox/node-server-sdk';

export type TOperation<T extends TOperationRequestType = any> = TManifestOperation<T>;

//============ Deep merge =============

interface IObject {
  [key: string]: any;
}

type TUnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

const isObject = (obj: any) => {
  if (typeof obj === 'object' && obj !== null) {
    if (typeof Object.getPrototypeOf === 'function') {
      const prototype = Object.getPrototypeOf(obj);
      return prototype === Object.prototype || prototype === null;
    }

    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  return false;
};

export const mergeDeep = <T extends IObject[]>(...objects: T): TUnionToIntersection<T[number]> =>
  objects.reduce((result, current) => {
    Object.keys(current).forEach((key) => {
      if (Array.isArray(result[key]) && Array.isArray(current[key])) {
        result[key] = Array.from(new Set(result[key].concat(current[key])));
      } else if (isObject(result[key]) && isObject(current[key])) {
        result[key] = mergeDeep(result[key], current[key]);
      } else {
        result[key] = current[key];
      }
    });

    return result;
  }, {}) as any;

// const a = {a: 1, b: 2};
// const b = {a: 3, c: 4};

// const c = {s: {a, b}}
// const m = mergeDeep(c, {s: {a: {new: 'a'}}})
// console.log('merge result:', m)

//============================================
