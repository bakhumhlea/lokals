const DEFAULT_VALUE = {
  ACCOUNT_TYPE: {
    STANDARD: 'standard',
  },
  TOKEN: {
    BEARER: "Bearer",
    EXPIRES_IN: "1d",
  },
  ERRORS: {
    EMAIL: {
      EXISTED: "Email already existed",
      NOT_REGISTERED: (email) => `${email} has never been registered`,
    },
    PASSWORD: {
      INCORRECT: "Incorrect password",
    },
    PROFILE: {
      NOT_EXISTED: (id) => `Profile ID:${id} is not existed`,
      NOT_FOUND: "User profile is not found"
    }
  }
}

module.exports = DEFAULT_VALUE;