// 解决 TS 对 react-globe.gl 的模块类型报错
declare module 'react-globe.gl' {
    import { ComponentType } from 'react';
    const Globe: ComponentType<any>;
    export default Globe;
}
