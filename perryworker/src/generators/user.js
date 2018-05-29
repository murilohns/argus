import Promise from 'bluebird';
import controllers from '../mongo/controllers';

const UserGenerators = {
  /**
    @param {Object} githubUser - User received from Github API
  */
  saveUser: Promise.coroutine(function* (githubUser) {
    const { login, avatarUrl, url } = githubUser;

    const payload = {
      login,
      avatarUrl,
      url
    };

    let user = yield controllers.user.save(payload);
    return user;
  }),
  /**
    @param {Object[]} - Users received from Github API
  */
  saveUsers: Promise.coroutine(function* (githubUsers) {
    let usersPromises = githubUsers.map( user =>
      this.saveUser(user)
    );

    let mongoUsers = yield Promise.all(usersPromises);
    return mongoUsers;
  })
};

export default UserGenerators;
