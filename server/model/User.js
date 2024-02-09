
//here we save the users data as object
class User {
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

  get getPerson_id() {
    return this.person_id;
  }

  set setUserName(user_name) {
    this.username = user_name;
  }
  get getUserName() {
    return this.username;
  }

  set setName(name) {
    this.name = name;
  }

  get getName() {
    return this.name;
  }
}

module.exports = User;
