export default (camelCaseWord: string) =>
	camelCaseWord
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, (camelCaseWithSpaces) => camelCaseWithSpaces.toUpperCase());
