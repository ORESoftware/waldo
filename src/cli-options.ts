export const options = [
  {
    name: 'version',
    type: 'bool',
    help: 'Print tool version and exit.'
  },
  {
    names: ['help', 'h'],
    type: 'bool',
    help: 'Print this help and exit.'
  },
  {
    names: ['verbose', 'v'],
    type: 'arrayOfBool',
    help: 'Verbose output. Use multiple times for more verbose.'
  },
  {
    names: ['match', 'm'],
    type: 'arrayOfString',
    help: 'Files must match at least one of these.',
    default: [] as Array<string>
  },
  {
    names: ['not-match', 'n'],
    type: 'arrayOfString',
    help: 'Regex that files cannot match',
    default: [] as Array<string>
  },
  {
    names: ['path', 'p'],
    type: 'string',
    help: 'Root path to search in.',
    default: ''
  },
  {
    names: ['files', 'f'],
    type: 'bool',
    help: 'List files.',
    default: null
  },
  {
    names: ['dirs', 'd'],
    type: 'bool',
    help: 'List dirs.',
    default: null
  },
  {
    names: ['absolute', 'abs'],
    type: 'bool',
    help: 'Show absolute paths.',
    default: true
  },
  {
    names: ['relative', 'rel'],
    type: 'bool',
    help: 'Show relative paths.',
    default: true
  }
];
