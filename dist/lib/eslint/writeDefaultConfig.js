"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.writeDefaultConfig = writeDefaultConfig;
var _fs = require("fs");
var _chalk = _interopRequireDefault(require("chalk"));
var _os = _interopRequireDefault(require("os"));
var _path = _interopRequireDefault(require("path"));
var CommentJson = _interopRequireWildcard(require("next/dist/compiled/comment-json"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
async function writeDefaultConfig(eslintrcFile, pkgJsonPath, packageJsonConfig) {
    const defaultConfig = {
        extends: 'next'
    };
    if (eslintrcFile) {
        const content = await _fs.promises.readFile(eslintrcFile, {
            encoding: 'utf8'
        }).then((txt)=>txt.trim().replace(/\n/g, '')
        , ()=>null
        );
        if (content === '' || content === '{}' || content === '---' || content === 'module.exports = {}') {
            const ext = _path.default.extname(eslintrcFile);
            let newFileContent;
            if (ext === '.yaml' || ext === '.yml') {
                newFileContent = "extends: 'next'";
            } else {
                newFileContent = CommentJson.stringify(defaultConfig, null, 2);
                if (ext === '.js') {
                    newFileContent = 'module.exports = ' + newFileContent;
                }
            }
            await _fs.promises.writeFile(eslintrcFile, newFileContent + _os.default.EOL);
            console.log(_chalk.default.green(`We detected an empty ESLint configuration file (${_chalk.default.bold(_path.default.basename(eslintrcFile))}) and updated it for you to include the base Next.js ESLint configuration.`));
        }
    } else if (packageJsonConfig === null || packageJsonConfig === void 0 ? void 0 : packageJsonConfig.eslintConfig) {
        // Creates .eslintrc only if package.json's eslintConfig field is empty
        if (Object.entries(packageJsonConfig === null || packageJsonConfig === void 0 ? void 0 : packageJsonConfig.eslintConfig).length === 0) {
            packageJsonConfig.eslintConfig = defaultConfig;
            if (pkgJsonPath) await _fs.promises.writeFile(pkgJsonPath, CommentJson.stringify(packageJsonConfig, null, 2) + _os.default.EOL);
            console.log(_chalk.default.green(`We detected an empty ${_chalk.default.bold('eslintConfig')} field in package.json and updated it for you to include the base Next.js ESLint configuration.`));
        }
    } else {
        await _fs.promises.writeFile('.eslintrc.json', CommentJson.stringify(defaultConfig, null, 2) + _os.default.EOL);
        console.log(_chalk.default.green(`We created the ${_chalk.default.bold('.eslintrc.json')} file for you and included the base Next.js ESLint configuration.`));
    }
}

//# sourceMappingURL=writeDefaultConfig.js.map