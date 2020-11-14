"use strict";exports.__esModule=true;exports.eventCliSession=eventCliSession;var _findUp=_interopRequireDefault(require("next/dist/compiled/find-up"));var _path=_interopRequireDefault(require("path"));var _constants=require("../../next-server/lib/constants");var _config=require("../../next-server/server/config");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const EVENT_VERSION='NEXT_CLI_SESSION_STARTED';function hasBabelConfig(dir){try{var _res$options,_res$options$presets,_res$options2,_res$options2$plugins;const noopFile=_path.default.join(dir,'noop.js');const res=require('next/dist/compiled/babel/core').loadPartialConfig({cwd:dir,filename:noopFile,sourceFileName:noopFile});const isForTooling=((_res$options=res.options)==null?void 0:(_res$options$presets=_res$options.presets)==null?void 0:_res$options$presets.every(e=>{var _e$file;return(e==null?void 0:(_e$file=e.file)==null?void 0:_e$file.request)==='next/babel';}))&&((_res$options2=res.options)==null?void 0:(_res$options2$plugins=_res$options2.plugins)==null?void 0:_res$options2$plugins.length)===0;return res.hasFilesystemConfig()&&!isForTooling;}catch(_unused){return false;}}function getNextConfig(phase,dir){try{const configurationPath=_findUp.default.sync(_constants.CONFIG_FILE,{cwd:dir});if(configurationPath){// This should've already been loaded, and thus should be cached / won't
// be re-evaluated.
const configurationModule=require(configurationPath);// Re-normalize the configuration.
return(0,_config.normalizeConfig)(phase,configurationModule.default||configurationModule);}}catch(_unused2){// ignored
}return null;}function eventCliSession(phase,dir,event){var _userConfiguration$ta;// This should be an invariant, if it fails our build tooling is broken.
if(typeof "10.0.2-canary.14"!=='string'){return[];}const userConfiguration=getNextConfig(phase,dir);const{images,i18n}=userConfiguration||{};const payload={nextVersion:"10.0.2-canary.14",nodeVersion:process.version,cliCommand:event.cliCommand,isSrcDir:event.isSrcDir,hasNowJson:event.hasNowJson,isCustomServer:event.isCustomServer,hasNextConfig:!!userConfiguration,buildTarget:(_userConfiguration$ta=userConfiguration==null?void 0:userConfiguration.target)!=null?_userConfiguration$ta:'default',hasWebpackConfig:typeof(userConfiguration==null?void 0:userConfiguration.webpack)==='function',hasBabelConfig:hasBabelConfig(dir),imageEnabled:!!images,basePathEnabled:!!(userConfiguration==null?void 0:userConfiguration.basePath),i18nEnabled:!!i18n,locales:(i18n==null?void 0:i18n.locales)?i18n.locales.join(','):null,localeDomainsCount:(i18n==null?void 0:i18n.domains)?i18n.domains.length:null,localeDetectionEnabled:!i18n?null:i18n.localeDetection!==false,imageDomainsCount:(images==null?void 0:images.domains)?images.domains.length:null,imageSizes:(images==null?void 0:images.sizes)?images.sizes.join(','):null,imageLoader:images==null?void 0:images.loader,trailingSlashEnabled:!!(userConfiguration==null?void 0:userConfiguration.trailingSlash),reactStrictMode:!!(userConfiguration==null?void 0:userConfiguration.reactStrictMode)};return[{eventName:EVENT_VERSION,payload}];}
//# sourceMappingURL=version.js.map