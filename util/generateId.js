import { v4 as uuidv4 } from 'uuid';

export default function generateId(prefix) {
  if (!prefix) {
    throw new TypeError('must specify prefix');
  }
  return prefix + '_' + uuidv4().replace(/-/g, '');
}
