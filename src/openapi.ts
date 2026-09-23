const successProperties = {
  success: { type: "boolean", const: true },
  message: { type: "string" },
} as const;

const invalidRequestResponse = {
  description: "Invalid request body",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ValidationError" },
    },
  },
} as const;

const unauthorizedResponse = {
  description: "Authentication required",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/Error" },
    },
  },
} as const;

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "UNFOLD API",
    version: "0.1.0",
    description: "Backend API for authentication, emotional check-ins, mind entries, and small wins.",
  },
  servers: [{ url: "/", description: "Current server" }],
  tags: [
    { name: "System" },
    { name: "Auth" },
    { name: "Emotional Check-ins" },
    { name: "Mind Entries" },
    { name: "Small Wins" },
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["System"],
        summary: "Check API health",
        responses: {
          "200": {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/EmptySuccess" },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register an account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Account created and session cookie set",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserSuccess" },
              },
            },
          },
          "400": invalidRequestResponse,
          "409": {
            description: "Email already registered",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Logged in and session cookie set",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserSuccess" },
              },
            },
          },
          "400": invalidRequestResponse,
          "401": {
            description: "Invalid email or password",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Log out",
        responses: {
          "200": {
            description: "Session cookie cleared",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/EmptySuccess" },
              },
            },
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get the current user",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Current user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserSuccess" },
              },
            },
          },
          "401": unauthorizedResponse,
        },
      },
    },
    "/api/emotional-check-ins": {
      post: {
        tags: ["Emotional Check-ins"],
        summary: "Create an emotional check-in",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateEmotionalCheckInInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Emotional check-in created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/EmotionalCheckInSuccess" },
              },
            },
          },
          "400": invalidRequestResponse,
          "401": unauthorizedResponse,
        },
      },
      get: {
        tags: ["Emotional Check-ins"],
        summary: "List the current user's emotional check-ins",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Emotional check-ins ordered newest first",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/EmotionalCheckInListSuccess" },
              },
            },
          },
          "401": unauthorizedResponse,
        },
      },
    },
    "/api/mind-entries": {
      post: {
        tags: ["Mind Entries"],
        summary: "Create a mind entry",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateMindEntryInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Mind entry created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MindEntrySuccess" },
              },
            },
          },
          "400": invalidRequestResponse,
          "401": unauthorizedResponse,
        },
      },
      get: {
        tags: ["Mind Entries"],
        summary: "List the current user's mind entries",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Mind entries ordered newest first",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MindEntryListSuccess" },
              },
            },
          },
          "401": unauthorizedResponse,
        },
      },
    },
    "/api/small-wins": {
      post: {
        tags: ["Small Wins"],
        summary: "Create a small win",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateSmallWinInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Small win created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SmallWinSuccess" },
              },
            },
          },
          "400": invalidRequestResponse,
          "401": unauthorizedResponse,
        },
      },
      get: {
        tags: ["Small Wins"],
        summary: "List the current user's small wins",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Small wins ordered by date",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SmallWinListSuccess" },
              },
            },
          },
          "401": unauthorizedResponse,
        },
      },
    },
  },
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "unfold_session",
        description: "HTTP-only session cookie set by register or login.",
      },
    },
    schemas: {
      Error: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: { type: "boolean", const: false },
          message: { type: "string" },
          data: { type: "null" },
        },
      },
      ValidationError: {
        type: "object",
        required: ["success", "message", "data", "errors"],
        properties: {
          success: { type: "boolean", const: false },
          message: { type: "string", example: "Invalid request" },
          data: { type: "null" },
          errors: {
            type: "object",
            additionalProperties: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
      EmptySuccess: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          ...successProperties,
          data: { type: "null" },
        },
      },
      RegisterInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 100, example: "Sofyan" },
          email: { type: "string", format: "email", maxLength: 150, example: "sofyan@example.com" },
          password: { type: "string", format: "password", minLength: 8, maxLength: 128 },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", maxLength: 150, example: "sofyan@example.com" },
          password: { type: "string", format: "password", minLength: 1, maxLength: 128 },
        },
      },
      User: {
        type: "object",
        required: ["id", "name", "email", "role", "createdAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", example: "user" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      UserSuccess: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          ...successProperties,
          data: { $ref: "#/components/schemas/User" },
        },
      },
      CreateEmotionalCheckInInput: {
        type: "object",
        required: ["emotion", "intensity"],
        properties: {
          emotion: {
            type: "string",
            enum: ["happy", "calm", "anxious", "tired", "sad", "empty", "angry", "overwhelmed"],
          },
          intensity: { type: "integer", minimum: 1, maximum: 5, example: 4 },
          triggerNote: { type: "string", minLength: 1, maxLength: 1000 },
        },
      },
      EmotionalCheckIn: {
        type: "object",
        required: ["id", "userId", "emotion", "intensity", "triggerNote", "createdAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          emotion: { type: "string" },
          intensity: { type: "integer" },
          triggerNote: { type: ["string", "null"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      EmotionalCheckInSuccess: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          ...successProperties,
          data: { $ref: "#/components/schemas/EmotionalCheckIn" },
        },
      },
      EmotionalCheckInListSuccess: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          ...successProperties,
          data: { type: "array", items: { $ref: "#/components/schemas/EmotionalCheckIn" } },
        },
      },
      CreateMindEntryInput: {
        type: "object",
        required: ["content"],
        properties: {
          content: { type: "string", minLength: 1, maxLength: 10_000 },
          isSaved: { type: "boolean", default: true },
        },
      },
      MindEntry: {
        type: "object",
        required: ["id", "userId", "content", "isSaved", "createdAt", "updatedAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          content: { type: "string" },
          isSaved: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      MindEntrySuccess: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          ...successProperties,
          data: { $ref: "#/components/schemas/MindEntry" },
        },
      },
      MindEntryListSuccess: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          ...successProperties,
          data: { type: "array", items: { $ref: "#/components/schemas/MindEntry" } },
        },
      },
      CreateSmallWinInput: {
        type: "object",
        required: ["title", "winDate"],
        properties: {
          title: { type: "string", minLength: 1, maxLength: 150 },
          description: { type: "string", minLength: 1, maxLength: 2000 },
          category: { type: "string", minLength: 1, maxLength: 50 },
          winDate: { type: "string", format: "date", example: "2026-09-23" },
        },
      },
      SmallWin: {
        type: "object",
        required: ["id", "userId", "title", "description", "category", "winDate", "createdAt", "updatedAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          title: { type: "string" },
          description: { type: ["string", "null"] },
          category: { type: ["string", "null"] },
          winDate: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      SmallWinSuccess: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          ...successProperties,
          data: { $ref: "#/components/schemas/SmallWin" },
        },
      },
      SmallWinListSuccess: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          ...successProperties,
          data: { type: "array", items: { $ref: "#/components/schemas/SmallWin" } },
        },
      },
    },
  },
} as const;
