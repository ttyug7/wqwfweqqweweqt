"use strict";exports.__esModule=true;exports.writeAppTypeDeclarations=writeAppTypeDeclarations;var _fs=require("fs");var _os=_interopRequireDefault(require("os"));var _path=_interopRequireDefault(require("path"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}async function writeAppTypeDeclarations(baseDir,imageImportsEnabled){// Reference `next` types
const appTypeDeclarations=_path.default.join(baseDir,'next-env.d.ts');await _fs.promises.writeFile(appTypeDeclarations,'/// <reference types="next" />'+_os.default.EOL+'/// <reference types="next/types/global" />'+_os.default.EOL+(imageImportsEnabled?'/// <reference types="next/image-types/global" />'+_os.default.EOL:'')+_os.default.EOL+'// NOTE: This file should not be edited'+_os.default.EOL+'// see https://nextjs.org/docs/basic-features/typescript for more information.'+_os.default.EOL);}
//# sourceMappingURL=writeAppTypeDeclarations.js.map