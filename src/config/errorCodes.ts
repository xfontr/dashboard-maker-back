const ERROR_CODES = {
  success: {
    ok: 200,
    created: 201,
    deletedWithResponse: 200,
    updatedWithResponse: 200,
  },

  error: {
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    conflict: 409,

    internalServerError: 500,
  },
};

export default ERROR_CODES;
