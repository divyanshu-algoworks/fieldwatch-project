import { isArray } from 'Helpers/array';
import { isObject } from 'Helpers/object';
export function toFormData(data, key, formData = new FormData()) {
  if (isArray(data)) {
    for (const item of data) {
      formData = toFormData(item, `${key}[]`, formData);
    }
  } else if (isObject(data)) {
    for (const dataKey in data) {
      formData = toFormData(data[dataKey], key ? `${key}[${dataKey}]` : dataKey, formData);
    }
  } else {
    formData.append(key, data);
  }
  return formData;
}
