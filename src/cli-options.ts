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
    names: ['must-match', 'M'],
    type: 'arrayOfString',
    help: 'Files must match at least one of these.',
    default: [] as Array<string>
  },
  {
    names: ['M:f'],
    type: 'arrayOfString',
    help: 'Files must match at least one of these.',
    default: [] as Array<string>
  },
  {
    names: ['M:d'],
    type: 'arrayOfString',
    help: 'Files must match at least one of these.',
    default: [] as Array<string>
  },
  {
    names: ['match', 'm'],
    type: 'arrayOfString',
    help: 'Files/dirs must match at least one of these.',
    default: [] as Array<string>
  },
  {
    names: ['m:f'],
    type: 'arrayOfString',
    help: 'Files must match at least one of these.',
    default: [] as Array<string>
  },
  {
    names: ['m:d'],
    type: 'arrayOfString',
    help: 'Dirs must match at least one of these.',
    default: [] as Array<string>
  },
  {
    names: ['not-match', 'n'],
    type: 'arrayOfString',
    help: 'Regex that files/dirs cannot match',
    default: [] as Array<string>
  },
  {
    names: ['n:f'],
    type: 'arrayOfString',
    help: 'Regex that files cannot match',
    default: [] as Array<string>
  },
  {
    names: ['n:d'],
    type: 'arrayOfString',
    help: 'Regex that folders cannot match',
    default: [] as Array<string>
  },
  {
    names: ['path', 'p'],
    type: 'arrayOfString',
    help: 'Root path(s) to search in.',
    default: ''
  },
  {
    names: ['ordered'],
    type: 'bool',
    help: 'Get ordered output.',
    default: false
  },
  {
    names: ['files', 'f'],
    type: 'bool',
    help: 'Do not print files.',
    default: false
  },
  {
    names: ['dirs', 'd'],
    type: 'bool',
    help: 'Do not print dirs.',
    default: false
  },
  {
    names: ['symlinks', 's'],
    type: 'bool',
    help: 'Do not print symlinks.',
    default: false
  },
  {
    names: ['follow-symlinks'],
    type: 'bool',
    help: 'Follow symlinks.',
    default: false
  },
  {
    names: ['absolute', 'abs'],
    type: 'bool',
    help: 'Show absolute paths.',
    default: false
  }
];


export interface CliOptions {
  absolute: boolean,
  follow_symlinks: boolean,
  symlinks: boolean,
  files: boolean,
  dirs: boolean,
  path: Array<string>,
  ordered: boolean,
  match: Array<string>,
  not_match: Array<string>,
  must_match: Array<string>,
  _args: Array<string>
}
