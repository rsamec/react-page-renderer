import standardPageSizes from './standardPageSizes';

class GraphicPrimitive {
	
	static get DPI() {return 96;}
	
	static pointToPixel (point) {
		if (point === undefined) return;
		var convertedPoint =(point / 72) * GraphicPrimitive.DPI;
		return Math.round(convertedPoint,3);
		//return parseFloat(convertedPoint.toFixed(3));
	};

	//default margin for A4 format
	static get DefaultMargin() {return 21.6;}

	//get page size for A4 format in points
	static get DefaultPageSize() {return [standardPageSizes.A4[0],standardPageSizes.A4[1]];}
	
	//get page size for A4 format in pixels
	static get DefaultPageSizeInPx() { return [GraphicPrimitive.pointToPixel(standardPageSizes.A4[0]), GraphicPrimitive.pointToPixel(standardPageSizes.A4[1])];}

	static get PageSizes() {return standardPageSizes;}
};

export default GraphicPrimitive
