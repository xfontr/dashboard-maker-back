export default {
	success: {
		ok: 200,
		created: 201,
		deletedWithResponse: 200,
		updatedWithResponse: 200,
	},

	error: {
		badRequest: 400,
		unauthorized: 401,
		notFound: 404,
		conflict: 409,

		internalServerError: 500,
	},
};
