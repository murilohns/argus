import Promise from 'bluebird';
import controllers from '../mongo/controllers';
import UserGenerators from './user';
import CommentGenerators from './comment';

const PullRequestGenerators = {
  /**
    @param {Object} repository - Repository stored on Mongo Database
    @param {Object} githubPullRequest - PullRequest received from Github API
  */
  savePullRequest: Promise.coroutine(function* (repository, githubPullRequest) {
    const { id, title, createdAt, url, bodyText, comments, commits } = githubPullRequest;

    let author = yield UserGenerators.saveUser(githubPullRequest.author);

    const pullRequestPayload = {
      githubId: id,
      title,
      createdAt,
      url,
      bodyText,
      author,
      commentsCount: comments.totalCount,
      commitsCount: commits.totalCount,
      repositoryId: repository._id
    };

    let pullRequest = yield controllers.pullrequest.save(pullRequestPayload);

    let commentsDocuments = yield CommentGenerators.saveComments({ model: 'pullrequest', id: pullRequest._id }, comments.nodes );

    return pullRequest;
  }),
  /**
    @param {Object} repository - Repository stored on Mongo Database
    @param {Object[]} githubPullRequests - PullRequests received from Github API
  */
  savePullRequests: Promise.coroutine(function* (repository, githubPullRequests) {
    let pullRequestsPromises = githubPullRequests.map(
      pullRequest => this.savePullRequest(repository, pullRequest)
    );

    let pullRequests = yield Promise.all(pullRequestsPromises);

    return pullRequests;
  })
};

export default PullRequestGenerators;
