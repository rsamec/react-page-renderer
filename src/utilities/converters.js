
//export function dateConverter() {
//	this.parse = function (input, dateFormat) {
//		if (!!!input) return undefined;
//		if (input.length < 8) return undefined;
//		var date = moment(input, dateFormat);
//		if (date.isValid()) return date.toDate();
//		return undefined;
//	}
//	this.format = function (input,dateFormat) {
//		if (!!!input) return undefined;
//		return moment(input).format(dateFormat);
//	}
//}

export class numberConverter {
	parse (input) {
		if (!!!input) return undefined;
		var num = parseInt(input,10);
		if (!isNaN(num)) return num;
		num = parseFloat(input);
		if (!isNaN(num)) return num;
		return undefined;
	}
	format (input,format) {
		if (!!!input) return undefined;
		return input;
	}
}
