const { findUserByUsername } = require("../../integration/userDAO");
const pool = require("../../db");
const User = require("../../model/User");

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

  // Close the database connection to prevent open handles
  afterAll(async () => {
    await pool.end();
  });
});
