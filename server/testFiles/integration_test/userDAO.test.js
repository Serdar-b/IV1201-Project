const { findUserByUsername, findUserByUsernameOrEmail, createUser } = require("../../integration/userDAO");
const pool = require("../../db");
const User = require("../../model/User");


let isPoolClosed = false;

describe("createUser", () => {
  let newUser;

  beforeAll(() => {
    newUser = {
      name: "Test",
      surname: "User",
      pnr: "1234567890",
      email: "testuser@example.com",
      password: "securepassword",
      username: "testuser",
    };
  });

  afterAll(async () => {
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
    const result = await createUser(newUser);

    expect(result.success).toBeTruthy();
    expect(result.user).not.toBeNull();
    expect(result.user.name).toBe(newUser.name);
  });
});

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

describe("findUserByUsernameOrEmail", () => {
  it("should return a User object when the user is found by name or by email", async () => {
    const user = await findUserByUsernameOrEmail("ArmandTodd");

    expect(user).not.toBeNull();
    expect(user).toBeInstanceOf(User);
    expect(user.getName).toBe("Armand");
  });

  it("should return a null object when the user is not found by name or by email", async () => {
    const user = await findUserByUsernameOrEmail("User1");

    expect(user).toBeNull();
  });
});

afterAll(async () => {
  if (!isPoolClosed) {
    await pool.end();
    isPoolClosed = true;
  }
});
