/**
 * Represents a user of the system.
 */
class User {
    /**
   * Constructs a new User instance.
   * @param {Object} params - The user parameters.
   * @param {number} params.person_id - The unique identifier for the user.
   * @param {string} params.name - The user's first name.
   * @param {string} params.surname - The user's surname.
   * @param {string} params.pnr - The personal identification number of the user.
   * @param {string} params.email - The user's email address.
   * @param {string} params.password - The user's password (hashed).
   * @param {number} params.role_id - The role identifier of the user.
   * @param {string} params.username - The username of the user.
   */
  constructor({
    person_id,
    name,
    surname,
    pnr,
    email,
    password,
    role_id,
    username,
  }) {
    this.person_id = person_id;
    this.name = name;
    this.surname = surname;
    this.pnr = pnr;
    this.email = email;
    this.password = password;
    this.role_id = role_id;
    this.username = username;
  }

  /**
   * Gets the person ID.
   * @returns {number} The user's person ID.
   */
  get getPerson_id() {
    return this.person_id;
  }

  /**
   * Sets the username of the user.
   * @param {string} user_name - The new username.
   */
  set setUserName(user_name) {
    this.username = user_name;
  }

  /**
   * Gets the username of the user.
   * @returns {string} The username.
   */
  get getUserName() {
    return this.username;
  }

  /**
   * Sets the name of the user.
   * @param {string} name - The new name.
   */
  set setName(name) {
    this.name = name;
  }

  /**
   * Gets the name of the user.
   * @returns {string} The name.
   */
  get getName() {
    return this.name;
  }

  /**
   * Gets the role ID of the user.
   * @returns {number} The role ID.
   */
  get getRoleId() {
    return this.role_id;
  }

  /**
   * Sets the role ID of the user.
   * @param {number} role_id - The new role ID.
   */
  set setRoleId(role_id) {
    this.role_id = role_id;
  }
}

module.exports = User;
