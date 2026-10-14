// Хэш кода преподавателя для common/teacher.js: node tools/teacher-hash.mjs новый-код
import {sha256} from '../common/teacher.js';
const code = process.argv[2];
if (!code) {
  console.error('Укажите код: node tools/teacher-hash.mjs новый-код');
  process.exit(1);
}
console.log(sha256(code));
