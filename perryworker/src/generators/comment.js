import Promise from 'bluebird';
import controllers from '../mongo/controllers';
import UserGenerators from './user';

const CommentGenerators = {
  /**
    @param {Object} spec - model details
    @param {String} spec.model - model which the comment belongs to. issue or pullrequest
    @param {ObjectId} spec.id - object relation
    @param {Object} githubComment - github comment payload
  */
  saveComment: Promise.coroutine(function* (spec, githubComment) {
    const { id, bodyText } = githubComment;
    let author = yield UserGenerators.saveUser(githubComment.author);

    const commentPayload = {
      githubId: id,
      bodyText,
      author,
      model: spec.model,
      modelId: spec.id
    };

    let comment = yield controllers.comment.save(commentPayload);
    return comment;
  }),
  /**
    TODO add javadoc
  */
  saveComments: Promise.coroutine(function* (model, githubComments) {
    let commentsPromises = githubComments.map( githubComment =>
      this.saveComment(model, githubComment)
    );

    let comments = yield Promise.all(commentsPromises);
    return comments;
  })
};

export default CommentGenerators;
