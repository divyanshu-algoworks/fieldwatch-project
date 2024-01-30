import isObject from './isObject';

function processObjectForModel(obj) {
  if(obj==null || obj== undefined){
    obj={};
  }
  const props = Object.getOwnPropertyNames(obj);
  return props.reduce((res, prop) => {
    if (obj[prop] === undefined) {
      return { ...res, [prop]: '', };
    }

    if (isObject(obj[prop])) {
      return {
        ...res,
        [prop]: processObjectForModel(obj[prop]),
      };
    }

    return {
      ...res,
      [prop]: obj[prop],
    };

  }, {});
}

export default processObjectForModel;
