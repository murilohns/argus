import Promise from 'bluebird';
import controllers from '../mongo/controllers';
import UserGenerators from './user';
import CommentGenerators from './comment';

const IssueGenerators = {
  /**
    @param {Object} repository - Repository stored on Mongo Database
    @param {Object} githubIssue - Issue received from Github API
  */
  saveIssue: Promise.coroutine(function* (repository, githubIssue) {
    const { id, title, bodyText, state, url, createdAt, comments } = githubIssue;

    let author = yield UserGenerators.saveUser(githubIssue.author);
    let assignees = yield UserGenerators.saveUsers(githubIssue.assignees.nodes);

    const issuePayload = {
      githubId: id,
      title,
      bodyText,
      state,
      url,
      createdAt,
      authorId: author._id,
      assignees: assignees.map( assignee => {
        if(assignee) {
          return assignee._id;
        }
      }),
      repositoryId: repository._id,
      commentsCount: comments.totalCount
    };

    let issue = yield controllers.issue.save(issuePayload);

    let commentsDocuments = yield CommentGenerators.saveComments({ name: 'issue', id: issue._id }, comments.nodes);

    return issue;
  }),
  /**
    @param {Object} repository - Repository stored on Mongo Database
    @param {Object[]} githubIssues - Issues received from Github API
  */
  saveIssues: Promise.coroutine(function* (repository, githubIssues) {
    let issuesPromises = githubIssues.map(
      issue => this.saveIssue(repository, issue)
    );

    let issues = yield Promise.all(issuesPromises);

    return issues;
  })
};

export default IssueGenerators;
