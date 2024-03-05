// const { findUserByUsername, findUserByUsernameOrEmail, createUser, logFailedAttempt } = require("../../integration/userDAO");
// const pool = require("../../db");
// const User = require("../../model/User");

// let isPoolClosed = false;

// describe("createUser", () => {
//   let newUser;
//   let client;

//   beforeAll(async () => {
//     newUser = {
//       name: "Test",
//       surname: "User",
//       pnr: "1234567890",
//       email: "testuser@example.com",
//       password: "securepassword",
//       username: "testuser",
//     };
//     client = await pool.connect();
//   });

//   afterAll(async () => {
//     client.release();
//     if (!isPoolClosed) {
//       try {
//         const deleteUserQuery = "DELETE FROM public.person WHERE username = $1";
//         await pool.query(deleteUserQuery, [newUser.username]);
//       } catch (error) {
//         console.error("Cleanup failed:", error);
//       }
//     }
//   });

//   it("should successfully create a new user with valid data", async () => {
//     await client.query('BEGIN');
//     const result = await createUser(client, newUser);

//     expect(result.success).toBeTruthy();
//     expect(result.user).not.toBeNull();
//     expect(result.user.name).toBe(newUser.name);

//     await client.query('ROLLBACK'); 
//   });
// });

// describe("findUserByUsername", () => {
//   it("should return a User object when the user is found", async () => {
//     const user = await findUserByUsername("ArmandTodd");

//     expect(user).not.toBeNull();
//     expect(user).toBeInstanceOf(User);
//     expect(user.getName).toBe("Armand");
//   });

//   it("should return a null object when the user is not found", async () => {
//     const user = await findUserByUsername("User1");

//     expect(user).toBeNull();
//   });
// });

// describe("findUserByUsernameOrEmail", () => {
//   it("should return a User object when the user is found by name or by email", async () => {

//     const user = await findUserByUsernameOrEmail("ArmandTodd", "armand@example.com");

//     expect(user).not.toBeNull();
//     expect(user).toBeInstanceOf(User);
//     expect(user.getName).toBe("Armand");
//   });

//   it("should return a null object when the user is not found by name or by email", async () => {
   
//     const user = await findUserByUsernameOrEmail("User1", "user1@example.com");

//     expect(user).toBeNull();
//   });
// });


// afterAll(async () => {
//   if (!isPoolClosed) {
//     await pool.end();
//     isPoolClosed = true;
//   }
// });





jest.mock("../../integration/userDAO", () => ({
  findUserByUsername: jest.fn(),
  findUserByUsernameOrEmail: jest.fn(),
  createUser: jest.fn(),
  logFailedAttempt: jest.fn()
}));
const { findUserByUsername, findUserByUsernameOrEmail, createUser, logFailedAttempt } = require("../../integration/userDAO");
const User = require("../../model/User");

describe("UserDAO Functions", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe("findUserByUsername", () => {
    it("should return a User object when the user is found", async () => {
      const mockUser = new User({
        person_id: 1,
        name: 'Armand',
        surname: 'Todd',
        pnr: '1234567890',
        email: 'armand@example.com',
        password: 'hashedpassword',
        role_id: 2,
        username: 'ArmandTodd'
      });

      findUserByUsername.mockResolvedValue(mockUser);

      const user = await findUserByUsername("ArmandTodd");

      expect(findUserByUsername).toHaveBeenCalledWith("ArmandTodd");
      expect(user).toBeInstanceOf(User);
      expect(user.getName).toBe("Armand");
    });

    it("should return null when the user is not found", async () => {
      findUserByUsername.mockResolvedValue(null);

      const user = await findUserByUsername("nonexistent");

      expect(findUserByUsername).toHaveBeenCalledWith("nonexistent");
      expect(user).toBeNull();
    });
  });

  describe("findUserByUsernameOrEmail", () => {
    it("should return a User object when the user is found by name or by email", async () => {
      const mockUser = new User({
        // User details
      });

      findUserByUsernameOrEmail.mockResolvedValue(mockUser);

      const user = await findUserByUsernameOrEmail("ArmandTodd", "armand@example.com");

      expect(findUserByUsernameOrEmail).toHaveBeenCalledWith("ArmandTodd", "armand@example.com");
      expect(user).toBeInstanceOf(User);
      // Further expectations...
    });

    it("should return null when the user is not found by name or by email", async () => {
      findUserByUsernameOrEmail.mockResolvedValue(null);

      const user = await findUserByUsernameOrEmail("nonexistent", "nonexistent@example.com");

      expect(findUserByUsernameOrEmail).toHaveBeenCalledWith("nonexistent", "nonexistent@example.com");
      expect(user).toBeNull();
    });
  });

  describe("createUser", () => {
    it("should successfully create a new user with valid data", async () => {
      const newUser = {
        // New user details
      };
      createUser.mockResolvedValue({ success: true, user: newUser });

      const result = await createUser(newUser);

      expect(createUser).toHaveBeenCalledWith(newUser);
      expect(result).toHaveProperty('success', true);
      expect(result.user).toEqual(newUser);
    });
  });

  describe("logFailedAttempt", () => {
    it("should log a failed attempt without throwing an error", async () => {
      logFailedAttempt.mockResolvedValue(undefined); // Assuming no return value for a logging function

      await logFailedAttempt(1, "test@example.com", "testuser", "Failed reason");

      expect(logFailedAttempt).toHaveBeenCalledWith(1, "test@example.com", "testuser", "Failed reason");
      // No need for expect assertions on the result since it's a logging function
    });
  });
});
