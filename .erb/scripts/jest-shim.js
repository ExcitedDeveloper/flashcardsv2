// mosesoak @ https://stackoverflow.com/questions/57712235/referenceerror-textencoder-is-not-defined-when-running-react-scripts-test
import { TextEncoder } from 'util'

global.TextEncoder = TextEncoder
