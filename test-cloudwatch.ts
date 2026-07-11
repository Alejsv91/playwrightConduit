import { logSelectorFailure } from './utils/cloudwatch-logger';

logSelectorFailure(
  'sample test',
  'getByRole("button", {name: "Submit"})',
  'TimeoutError: locator not found'
).then(() => console.log('Log enviado correctamente'))
 .catch((err) => console.error('Error enviando log:', err));