const DEFAULT_VALUE = {
  ACCOUNT_TYPE: {
    STANDARD: 'standard',
  },
  TOKEN: {
    BEARER: "Bearer",
    EXPIRES_IN: "1d",
  },
  REQUEST: {
    GOOGLEMAPS: {
      PLACE: {
        FIELDS: ['formatted_address', 'geometry', 'name', 'type', 'opening_hours', 'place_id']
      }
    }
  },
  VALUE: {
    DAYS_IN_MS: 86400000,
  },
  ERRORS: {
    EMAIL: {
      EXISTED: "Email already existed",
      NOT_FOUND: (email) => `${email} has never been registered`,
      INVALID: "Email is invalid"
    },
    LOGIN: {
      INVALID_CREDENTIAL: "Incorrect email or password",
      REQUIRED: (credential) => `${credential} is required`
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