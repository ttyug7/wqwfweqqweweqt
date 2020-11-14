"use strict";exports.__esModule=true;exports.collectPlugins=exports.getPluginId=exports.VALID_MIDDLEWARE=void 0;var _findUp=_interopRequireDefault(require("next/dist/compiled/find-up"));var _fs=require("fs");var _path=_interopRequireDefault(require("path"));var _index=_interopRequireDefault(require("next/dist/compiled/resolve/index.js"));var _utils=require("../../next-server/lib/utils");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const{version}=require('next/package.json');// currently supported middleware
const VALID_MIDDLEWARE=['document-head-tags-server','on-init-client','on-init-server','on-error-client','on-error-server','babel-preset-build'];exports.VALID_MIDDLEWARE=VALID_MIDDLEWARE;const exitWithError=error=>{console.error(error);process.exit(1);};async function collectPluginMeta(env,pluginPackagePath,pluginName,requiredVersion){const pkgDir=_path.default.dirname(pluginPackagePath);const pluginPackageJson=require(pluginPackagePath);const pluginMetaData=pluginPackageJson.nextjs;if(pluginPackageJson.version!==requiredVersion){exitWithError(`Next.js plugin versions must match the Next.js version being used, received ${pluginName}@${pluginPackageJson.version} need ${requiredVersion}`);}if(!pluginMetaData){exitWithError(`Next.js plugins need to have a "nextjs" key in package.json for ${pluginName}`);}if(!pluginMetaData.name){exitWithError(`Next.js plugins need to have a "nextjs.name" key in package.json for ${pluginName}`);}// TODO: add err.sh explaining requirements
let middleware=[];try{middleware=(await _fs.promises.readdir(_path.default.join(pkgDir,'src'),{withFileTypes:true})).filter(dirent=>dirent.isFile()).map(file=>file.name);}catch(err){if(err.code!=='ENOENT'){console.error(err);}exitWithError(`Failed to read src/ directory for Next.js plugin: ${pluginName}`);}// remove the extension from the middleware
middleware=middleware.map(item=>{const parts=item.split('.');parts.pop();return parts.join('.');});const invalidMiddleware=[];for(const item of middleware){if(!VALID_MIDDLEWARE.includes(item)){invalidMiddleware.push(item);}}if(invalidMiddleware.length>0){console.error(`Next.js Plugin: ${pluginName} listed invalid middleware ${invalidMiddleware.join(', ')}`);}// TODO: investigate requiring plugins' env be prefixed
// somehow to prevent collision
if(!Array.isArray(pluginMetaData['required-env'])){exitWithError('Next.js plugins need to have a "nextjs.required-env" key in package.json');}const missingEnvFields=[];for(const field of pluginMetaData['required-env']){if(typeof env[field]==='undefined'){missingEnvFields.push(field);}}if(missingEnvFields.length>0){exitWithError(`Next.js Plugin: ${pluginName} required env ${missingEnvFields.join(', ')} but was missing in your \`next.config.js\``);}return{middleware,directory:pkgDir.replace(/\\/g,'/'),requiredEnv:pluginMetaData['required-env'],version:pluginPackageJson.version,pluginName:pluginMetaData.name,pkgName:pluginPackageJson.name};}// clean package name so it can be used as variable
const getPluginId=pkg=>{pkg=pkg.replace(/\W/g,'');if(pkg.match(/^[0-9]/)){pkg=`_${pkg}`;}return pkg;};exports.getPluginId=getPluginId;async function _collectPlugins(dir,env,pluginsConfig){let nextPluginNames=[];const skippedPluginNames=[];const hasPluginConfig=Array.isArray(pluginsConfig);const nextPluginConfigNames=hasPluginConfig?pluginsConfig.map(config=>typeof config==='string'?config:config.name):null;const rootPackageJsonPath=await(0,_findUp.default)('package.json',{cwd:dir});if(!rootPackageJsonPath&&!nextPluginConfigNames){console.log('Failed to load plugins, no package.json');return[];}if(rootPackageJsonPath){const rootPackageJson=require(rootPackageJsonPath);let dependencies=[];if(rootPackageJson.dependencies){dependencies=dependencies.concat(Object.keys(rootPackageJson.dependencies));}if(rootPackageJson.devDependencies){dependencies=dependencies.concat(Object.keys(rootPackageJson.devDependencies));}// find packages with the naming convention
// @next/plugin-[name]
const filteredDeps=dependencies.filter(name=>{return name.match(/^@next\/plugin/);});if(nextPluginConfigNames){for(const dep of filteredDeps){if(!nextPluginConfigNames.includes(dep)){skippedPluginNames.push(dep);}}nextPluginNames=nextPluginConfigNames;}else{nextPluginNames=filteredDeps;}}const nextPluginMetaData=await Promise.all(nextPluginNames.map(name=>collectPluginMeta(env,_index.default.sync(_path.default.join(name,'package.json'),{basedir:dir,preserveSymlinks:true}),name,version)));for(const plugin of nextPluginMetaData){// Add plugin config from `next.config.js`
if(hasPluginConfig){const curPlugin=pluginsConfig.find(config=>config&&typeof config==='object'&&config.name===plugin.pkgName);if(curPlugin&&typeof curPlugin==='object'){plugin.config=curPlugin.config;}}console.log(`Loaded plugin: ${plugin.pkgName}${plugin.version?`@${plugin.version}`:''}`);}if(skippedPluginNames.length){console.log(`Plugins config used skipped loading: ${skippedPluginNames.join(', ')}`);}console.log();return nextPluginMetaData;}// only execute it once between server/client configs
// since the plugins need to match
const collectPlugins=(0,_utils.execOnce)(_collectPlugins);exports.collectPlugins=collectPlugins;
//# sourceMappingURL=collect-plugins.js.map