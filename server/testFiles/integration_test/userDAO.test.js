const { findUserByUsername, findUserByUsernameOrEmail, createUser, logFailedAttempt } = require("../../integration/userDAO");
const pool = require("../../db");
const User = require("../../model/User");

let isPoolClosed = false;

/**
 * Test suite for createUser function.
 * 
 * Checks if the createUser function can successfully create a new user with valid data.
 */
describe("createUser", () => {
  let newUser;
  let client;

  // Setup a new user object and database client before all tests
  beforeAll(async () => {
    newUser = {
      name: "Test",
      surname: "User",
      pnr: "1234567890",
      email: "testuser@example.com",
      password: "securepassword",
      username: "testuser",
    };
    client = await pool.connect();
  });

 // Cleanup by releasing the client and optionally deleting the user from the database after all tests
  afterAll(async () => {
    client.release();
    if (!isPoolClosed) {
      try {
        const deleteUserQuery = "DELETE FROM public.person WHERE username = $1";
        await pool.query(deleteUserQuery, [newUser.username]);
      } catch (error) {
        console.error("Cleanup failed:", error);
      }
    }
  });

  it("should successfully create a new user with valid data", async () => {
    await client.query('BEGIN');
    const result = await createUser(client, newUser);

    expect(result.success).toBeTruthy();
    expect(result.user).not.toBeNull();
    expect(result.user.name).toBe(newUser.name);

    await client.query('ROLLBACK'); 
  });
});

/**
 * Test suite for findUserByUsername function in the userDAO.
 * 
 * This suite checks if the function can find an existing user by username and handle non-existing users.
 */
describe("findUserByUsername", () => {
  it("should return a User object when the user is found", async () => {
    const user = await findUserByUsername("ArmandTodd");

    expect(user).not.toBeNull();
    expect(user).toBeInstanceOf(User);
    expect(user.getName).toBe("Armand");
  });

  it("should return a null object when the user is not found", async () => {
    const user = await findUserByUsername("User1");

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

    const user = await findUserByUsernameOrEmail("ArmandTodd", "armand@example.com");

    expect(user).not.toBeNull();
    expect(user).toBeInstanceOf(User);
    expect(user.getName).toBe("Armand");
  });

  it("should return a null object when the user is not found by name or by email", async () => {
   
    const user = await findUserByUsernameOrEmail("User1", "user1@example.com");

    expect(user).toBeNull();
  });
});

// Clean up by closing the pool after all tests if it has not been closed already
afterAll(async () => {
  if (!isPoolClosed) {
    await pool.end();
    isPoolClosed = true;
  }
});

