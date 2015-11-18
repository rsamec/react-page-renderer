import transformToPages from './transformToPages.js';
import GraphicPrimitive from './graphicUtil.js';

export default function(schema, pageOptions){
    var pageOptions =pageOptions || {};
    var pageHeight = pageOptions.height || GraphicPrimitive.DefaultPageSize[1];
    var pageMargin = pageOptions.margin || {};
    if (pageMargin.top !== undefined) pageHeight -=pageMargin.top;
    if (pageMargin.bottom !== undefined) pageHeight -=pageMargin.bottom;

    return transformToPages(schema,GraphicPrimitive.pointToPixel(pageHeight));

}
