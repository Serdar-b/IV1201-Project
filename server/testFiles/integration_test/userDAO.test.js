/**
 * Integration tests for user-related data access object (DAO) functions.
 * Utilizes the database connection pool to execute tests in the context of a database transaction,
 * ensuring tests do not affect the persistent database state.
 */

const {
  findUserByUsername,
  findUserByUsernameOrEmail,
  createUser,
  logFailedAttempt,
} = require("../../integration/userDAO");
const pool = require("../../db");
const User = require("../../model/User");

let isPoolClosed = false;
let client;

/*
 * Establishes a database connection before running tests
 */
beforeAll(async () => {
  client = await pool.connect();
});

/*
 *Releases the database connection and closes the pool after all tests are completed
 */
afterAll(async () => {
  client.release();
  if (!isPoolClosed) {
    await pool.end();
    isPoolClosed = true;
  }
});

/**
 * Test suite for createUser function.
 *
 * Checks if the createUser function can successfully create a new user with valid data.
 */
describe("createUser", () => {
  const newUser = {
    name: "Test",
    surname: "User",
    pnr: "1234567890",
    email: "testuser@example.com",
    password: "securepassword",
    username: "testuser",
  };

  it("should successfully create a new user with valid data", async () => {
    await client.query("BEGIN");
    const result = await createUser(client, newUser);
    expect(result.success).toBeTruthy();
    expect(result.user).not.toBeNull();
    expect(result.user.name).toBe(newUser.name);
    await client.query("ROLLBACK");
  });
});

/**
 * Test suite for findUserByUsername function in the userDAO.
 *
 * This suite checks if the function can find an existing user by username and handle non-existing users.
 */
describe("findUserByUsername", () => {
  it("should return a User object when the user is found", async () => {
    const user = await findUserByUsername(client, "ArmandTodd");
    expect(user).not.toBeNull();
    expect(user).toBeInstanceOf(User);
    expect(user.getName).toBe("Armand");
  });

  it("should return a null object when the user is not found", async () => {
    const user = await findUserByUsername(client, "User1");
    expect(user).toBeNull();
  });
});

/**
 * Test suite for findUserByUsernameOrEmail function in the userDAO.
 *
 * This suite checks if the function can find an existing user by either username or email.
 */

describe("findUserByUsernameOrEmail", () => {
  it("should return a User object when the user is found by name or by email", async () => {
    const user = await findUserByUsernameOrEmail(
      client,
      "ArmandTodd",
      "armand@example.com"
    );
    expect(user).not.toBeNull();
    expect(user).toBeInstanceOf(User);
    expect(user.getName).toBe("Armand");
  });

  it("should return a null object when the user is not found by name or by email", async () => {
    const user = await findUserByUsernameOrEmail(
      client,
      "User1",
      "user1@example.com"
    );
    expect(user).toBeNull();
  });
});

/**
 * Tests the logFailedAttempt DAO function to ensure it accurately logs a failed login attempt in the database.
 */
describe("logFailedAttempt", () => {
  const personId = null;
  const email = null;
  const username = "testuser";
  const reason = "Test failed login";
  const userAgent = "jest/test";
  const ipAddress = "127.0.0.1";

  afterEach(async () => {
    // Deletes test log entries to clean up after tests
    await client.query("DELETE FROM logs WHERE username = $1", [username]);
  });

  it("should insert a log entry into the database", async () => {
    await client.query("BEGIN");
    try {
      await logFailedAttempt(
        personId,
        email,
        username,
        reason,
        userAgent,
        ipAddress
      );
      const res = await client.query(
        "SELECT * FROM logs WHERE username = $1 AND reason = $2",
        [username, reason]
      );
      expect(res.rows.length).toBe(1);
      const logEntry = res.rows[0];
      expect(logEntry.username).toBe(username);
      expect(logEntry.reason).toBe(reason);
    } finally {
      await client.query("ROLLBACK");
    }
  });
});
