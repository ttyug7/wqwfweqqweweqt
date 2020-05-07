"use strict";exports.__esModule=true;exports.verifyTypeScriptSetup=verifyTypeScriptSetup;var _chalk=_interopRequireDefault(require("next/dist/compiled/chalk"));var _fs=_interopRequireDefault(require("fs"));var _os=_interopRequireDefault(require("os"));var _path=_interopRequireDefault(require("path"));var _fileExists=require("./file-exists");var _recursiveReaddir=require("./recursive-readdir");var _resolveRequest=require("./resolve-request");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _getRequireWildcardCache(){if(typeof WeakMap!=="function")return null;var cache=new WeakMap();_getRequireWildcardCache=function(){return cache;};return cache;}function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}if(obj===null||typeof obj!=="object"&&typeof obj!=="function"){return{default:obj};}var cache=_getRequireWildcardCache();if(cache&&cache.has(obj)){return cache.get(obj);}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc);}else{newObj[key]=obj[key];}}}newObj.default=obj;if(cache){cache.set(obj,newObj);}return newObj;}function writeJson(fileName,object){return _fs.default.promises.writeFile(fileName,JSON.stringify(object,null,2).replace(/\n/g,_os.default.EOL)+_os.default.EOL);}async function hasTypeScript(dir){const typescriptFiles=await(0,_recursiveReaddir.recursiveReadDir)(dir,/.*\.(ts|tsx)$/,/(node_modules|.*\.d\.ts)/);return typescriptFiles.length>0;}async function checkDependencies({dir,isYarn}){const requiredPackages=[{file:'typescript',pkg:'typescript'},{file:'@types/react/index.d.ts',pkg:'@types/react'},{file:'@types/node/index.d.ts',pkg:'@types/node'}];let resolutions=new Map();const missingPackages=requiredPackages.filter(p=>{try{resolutions.set(p.pkg,(0,_resolveRequest.resolveRequest)(p.file,`${dir}/`));return false;}catch(_){return true;}});if(missingPackages.length<1){return resolutions.get('typescript');}const packagesHuman=missingPackages.map((p,index,{length})=>(index>0?index===length-1?length>2?', and ':' and ':', ':'')+p.pkg).join('');const packagesCli=missingPackages.map(p=>p.pkg).join(' ');console.error(_chalk.default.bold.red(`It looks like you're trying to use TypeScript but do not have the required package(s) installed.`));console.error();console.error(_chalk.default.bold(`Please install ${_chalk.default.bold(packagesHuman)} by running:`));console.error();console.error(`\t${_chalk.default.bold.cyan((isYarn?'yarn add --dev':'npm install --save-dev')+' '+packagesCli)}`);console.error();console.error(_chalk.default.bold('If you are not trying to use TypeScript, please remove the '+_chalk.default.cyan('tsconfig.json')+' file from your package root (and any TypeScript files).'));console.error();process.exit(1);}async function verifyTypeScriptSetup(dir,pagesDir){const tsConfigPath=_path.default.join(dir,'tsconfig.json');const yarnLockFile=_path.default.join(dir,'yarn.lock');const hasTsConfig=await(0,_fileExists.fileExists)(tsConfigPath);const isYarn=await(0,_fileExists.fileExists)(yarnLockFile);let firstTimeSetup=false;if(hasTsConfig){const tsConfig=await _fs.default.promises.readFile(tsConfigPath,'utf8').then(val=>val.trim());firstTimeSetup=tsConfig===''||tsConfig==='{}';}else{const hasTypeScriptFiles=await hasTypeScript(pagesDir);if(hasTypeScriptFiles){firstTimeSetup=true;}else{return;}}const tsPath=await checkDependencies({dir,isYarn});const ts=await Promise.resolve().then(()=>_interopRequireWildcard(require(`${tsPath}`)));const compilerOptions={// These are suggested values and will be set when not present in the
// tsconfig.json
// 'parsedValue' matches the output value from ts.parseJsonConfigFileContent()
target:{parsedValue:ts.ScriptTarget.ES5,suggested:'es5'},lib:{suggested:['dom','dom.iterable','esnext']},allowJs:{suggested:true},skipLibCheck:{suggested:true},strict:{suggested:false},forceConsistentCasingInFileNames:{suggested:true},noEmit:{suggested:true},// These values are required and cannot be changed by the user
// Keep this in sync with the webpack config
esModuleInterop:{value:true,reason:'requirement for babel'},module:{parsedValue:ts.ModuleKind.ESNext,value:'esnext',reason:'for dynamic import() support'},moduleResolution:{parsedValue:ts.ModuleResolutionKind.NodeJs,value:'node',reason:'to match webpack resolution'},resolveJsonModule:{value:true},isolatedModules:{value:true,reason:'requirement for babel'},jsx:{parsedValue:ts.JsxEmit.Preserve,value:'preserve'}};const formatDiagnosticHost={getCanonicalFileName:fileName=>fileName,getCurrentDirectory:ts.sys.getCurrentDirectory,getNewLine:()=>_os.default.EOL};if(firstTimeSetup){console.log(_chalk.default.yellow(`We detected TypeScript in your project and created a ${_chalk.default.bold('tsconfig.json')} file for you.`));console.log();await writeJson(tsConfigPath,{});}const messages=[];let appTsConfig;let parsedTsConfig;let parsedCompilerOptions;try{var _result$errors;const{config:readTsConfig,error}=ts.readConfigFile(tsConfigPath,ts.sys.readFile);if(error){throw new Error(ts.formatDiagnostic(error,formatDiagnosticHost));}appTsConfig=readTsConfig;// Get TS to parse and resolve any "extends"
// Calling this function also mutates the tsconfig, adding in "include" and
// "exclude", but the compilerOptions remain untouched
parsedTsConfig=JSON.parse(JSON.stringify(readTsConfig));const result=ts.parseJsonConfigFileContent(parsedTsConfig,ts.sys,_path.default.dirname(tsConfigPath));if(result.errors){result.errors=result.errors.filter(({code})=>// No inputs were found in config file
code!==18003);}if((_result$errors=result.errors)===null||_result$errors===void 0?void 0:_result$errors.length){throw new Error(ts.formatDiagnostic(result.errors[0],formatDiagnosticHost));}parsedCompilerOptions=result.options;}catch(e){if(e&&e.name==='SyntaxError'){console.error(_chalk.default.red.bold('Could not parse',_chalk.default.cyan('tsconfig.json')+'.','Please make sure it contains syntactically correct JSON.'));}console.info((e===null||e===void 0?void 0:e.message)?`${e.message}`:'');process.exit(1);return;}if(appTsConfig.compilerOptions==null){appTsConfig.compilerOptions={};firstTimeSetup=true;}for(const option of Object.keys(compilerOptions)){const{parsedValue,value,suggested,reason}=compilerOptions[option];const valueToCheck=parsedValue===undefined?value:parsedValue;const coloredOption=_chalk.default.cyan('compilerOptions.'+option);if(suggested!=null){if(parsedCompilerOptions[option]===undefined){appTsConfig.compilerOptions[option]=suggested;messages.push(`${coloredOption} to be ${_chalk.default.bold('suggested')} value: ${_chalk.default.cyan.bold(suggested)} (this can be changed)`);}}else if(parsedCompilerOptions[option]!==valueToCheck){appTsConfig.compilerOptions[option]=value;messages.push(`${coloredOption} ${_chalk.default.bold(valueToCheck==null?'must not':'must')} be ${valueToCheck==null?'set':_chalk.default.cyan.bold(value)}`+(reason!=null?` (${reason})`:''));}}// tsconfig will have the merged "include" and "exclude" by this point
if(parsedTsConfig.exclude==null){appTsConfig.exclude=['node_modules'];}if(parsedTsConfig.include==null){appTsConfig.include=['next-env.d.ts','**/*.ts','**/*.tsx'];}if(messages.length>0){if(firstTimeSetup){console.info(_chalk.default.bold('Your',_chalk.default.cyan('tsconfig.json'),'has been populated with default values.'));console.info();}else{console.warn(_chalk.default.bold('The following changes are being made to your',_chalk.default.cyan('tsconfig.json'),'file:'));messages.forEach(message=>{console.warn('  - '+message);});console.warn();}await writeJson(tsConfigPath,appTsConfig);}// Reference `next` types
const appTypeDeclarations=_path.default.join(dir,'next-env.d.ts');if(!_fs.default.existsSync(appTypeDeclarations)){_fs.default.writeFileSync(appTypeDeclarations,'/// <reference types="next" />'+_os.default.EOL+'/// <reference types="next/types/global" />'+_os.default.EOL);}}