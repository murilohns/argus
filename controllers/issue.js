const {
  connectionManager
} = require('../database/helpers');

const {
  Issue,
  Repository,
  User,
  Comment
} = require('../database/models');

const find = connectionManager(async query => {
  query = query !== undefined? query : {};
  let count = query.count || 50;

  let issues = await Issue.find(query).sort('-createdAt').limit(count);

  let promises = issues.map( async issue => {
    issue = issue.toObject();
    issue.repository = await Repository.findOne({ _id: issue.repositoryId });
    issue.author = await User.findOne({ _id: issue.authorId });
    issue.comments = await Comment.find({ modelId: issue._id });

    let commentsPromises = issue.comments.map( async comment => {
      comment = comment.toObject();
      comment.author = await User.findOne({ _id: comment.author });
      return comment;
    });

    issue.comments = await Promise.all(commentsPromises);

    delete issue.repositoryId;
    delete issue.authorId;
    return issue;
  });

  issues = await Promise.all(promises);

  return issues;
});

const findOne = connectionManager(async query => {
  let issue = await Issue.findOne(query);
  return issue;
});

module.exports = {
  find,
  findOne
};
