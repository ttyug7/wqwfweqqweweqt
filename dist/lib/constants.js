"use strict";exports.__esModule=true;exports.GSSP_COMPONENT_MEMBER_ERROR=exports.UNSTABLE_REVALIDATE_RENAME_ERROR=exports.SERVER_PROPS_EXPORT_ERROR=exports.PAGES_404_GET_INITIAL_PROPS_ERROR=exports.SERVER_PROPS_SSG_CONFLICT=exports.SERVER_PROPS_GET_INIT_PROPS_CONFLICT=exports.SSG_GET_INITIAL_PROPS_CONFLICT=exports.PUBLIC_DIR_MIDDLEWARE_CONFLICT=exports.DOT_NEXT_ALIAS=exports.PAGES_DIR_ALIAS=exports.API_ROUTE=exports.NEXT_PROJECT_ROOT_DIST_SERVER=exports.NEXT_PROJECT_ROOT_DIST_CLIENT=exports.NEXT_PROJECT_ROOT_NODE_MODULES=exports.NEXT_PROJECT_ROOT_DIST=exports.NEXT_PROJECT_ROOT=void 0;var _path=require("path");const NEXT_PROJECT_ROOT=(0,_path.join)(__dirname,'..','..');exports.NEXT_PROJECT_ROOT=NEXT_PROJECT_ROOT;const NEXT_PROJECT_ROOT_DIST=(0,_path.join)(NEXT_PROJECT_ROOT,'dist');exports.NEXT_PROJECT_ROOT_DIST=NEXT_PROJECT_ROOT_DIST;const NEXT_PROJECT_ROOT_NODE_MODULES=(0,_path.join)(NEXT_PROJECT_ROOT,'node_modules');exports.NEXT_PROJECT_ROOT_NODE_MODULES=NEXT_PROJECT_ROOT_NODE_MODULES;const NEXT_PROJECT_ROOT_DIST_CLIENT=(0,_path.join)(NEXT_PROJECT_ROOT_DIST,'client');exports.NEXT_PROJECT_ROOT_DIST_CLIENT=NEXT_PROJECT_ROOT_DIST_CLIENT;const NEXT_PROJECT_ROOT_DIST_SERVER=(0,_path.join)(NEXT_PROJECT_ROOT_DIST,'server');// Regex for API routes
exports.NEXT_PROJECT_ROOT_DIST_SERVER=NEXT_PROJECT_ROOT_DIST_SERVER;const API_ROUTE=/^\/api(?:\/|$)/;// Because on Windows absolute paths in the generated code can break because of numbers, eg 1 in the path,
// we have to use a private alias
exports.API_ROUTE=API_ROUTE;const PAGES_DIR_ALIAS='private-next-pages';exports.PAGES_DIR_ALIAS=PAGES_DIR_ALIAS;const DOT_NEXT_ALIAS='private-dot-next';exports.DOT_NEXT_ALIAS=DOT_NEXT_ALIAS;const PUBLIC_DIR_MIDDLEWARE_CONFLICT=`You can not have a '_next' folder inside of your public folder. This conflicts with the internal '/_next' route. https://err.sh/zeit/next.js/public-next-folder-conflict`;exports.PUBLIC_DIR_MIDDLEWARE_CONFLICT=PUBLIC_DIR_MIDDLEWARE_CONFLICT;const SSG_GET_INITIAL_PROPS_CONFLICT=`You can not use getInitialProps with getStaticProps. To use SSG, please remove your getInitialProps`;exports.SSG_GET_INITIAL_PROPS_CONFLICT=SSG_GET_INITIAL_PROPS_CONFLICT;const SERVER_PROPS_GET_INIT_PROPS_CONFLICT=`You can not use getInitialProps with getServerSideProps. Please remove getInitialProps.`;exports.SERVER_PROPS_GET_INIT_PROPS_CONFLICT=SERVER_PROPS_GET_INIT_PROPS_CONFLICT;const SERVER_PROPS_SSG_CONFLICT=`You can not use getStaticProps with getServerSideProps. To use SSG, please remove getServerSideProps`;exports.SERVER_PROPS_SSG_CONFLICT=SERVER_PROPS_SSG_CONFLICT;const PAGES_404_GET_INITIAL_PROPS_ERROR=`\`pages/404\` can not have getInitialProps/getServerSideProps, https://err.sh/next.js/404-get-initial-props`;exports.PAGES_404_GET_INITIAL_PROPS_ERROR=PAGES_404_GET_INITIAL_PROPS_ERROR;const SERVER_PROPS_EXPORT_ERROR=`pages with \`getServerSideProps\` can not be exported. See more info here: https://err.sh/next.js/gssp-export`;exports.SERVER_PROPS_EXPORT_ERROR=SERVER_PROPS_EXPORT_ERROR;const UNSTABLE_REVALIDATE_RENAME_ERROR='The `revalidate` property is not yet available for general use.\n'+'To try the experimental implementation, please use `unstable_revalidate` instead.\n'+"We're excited for you to try this feature—please share all feedback on the RFC:\n"+'https://nextjs.link/issg';exports.UNSTABLE_REVALIDATE_RENAME_ERROR=UNSTABLE_REVALIDATE_RENAME_ERROR;const GSSP_COMPONENT_MEMBER_ERROR=`can not be attached to a page's component and must be exported from the page. See more info here: https://err.sh/next.js/gssp-component-member`;exports.GSSP_COMPONENT_MEMBER_ERROR=GSSP_COMPONENT_MEMBER_ERROR;