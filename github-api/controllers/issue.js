require('dotenv').config();

const {
  Issue,
  Repository,
  User,
  Comment,
  Supporter
} = require('../database/models');

const octokit = require('@octokit/rest')();
octokit.authenticate({
  type: 'token',
  token: process.env.GITHUB_API_TOKEN
});

const slack = require('../helpers/slack');

const find = async query => {
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
};

const findOne = async query => {
  let issue = await Issue.findOne(query);
  return issue;
};

const update = async (query, update) => {
  let issue = await Issue.findOneAndUpdate(query, update);
  issue = await Issue.findOne(query);
  return issue;
};

const assign = async (params) => {
  const { number } = params.issue;
  const { action } = params;
  const { full_name } = params.repository;

  if (action != 'opened') {
    return {
      message: 'Already assigned issue',
      status: 400
    };
  }

  const owner = full_name.split('/')[0];
  const repo = full_name.split('/')[1];
  const nextAssignSupporter = await Supporter.findOne({}).sort('-last_assign_date');

  const assignees = [nextAssignSupporter.user];

  try {
    octokit.issues.addAssigneesToIssue({owner, repo, number, assignees})
      .then((result) => {
        const issue = result.data;
        const slackData = {
          channel: nextAssignSupporter.slack_id,
          issue: issue,
          text: `Parabéns, essa <${issue.html_url}|issue> é sua!`,
          attachments: [
            {
              text: issue.body,
              title: issue.title,
              title_link: issue.html_url,
              author_name: issue.user.login,
              author_icon: issue.user.avatar_url,
              color: '#43FF2F',
              fields: [
                {
                  title: 'Assignees',
                  value: nextAssignSupporter.user,
                  short: false
                }
              ]
            }
          ]
        };

        slack.sendMessage(slackData)
          .then( res => console.log(res))
          .catch( err => console.log(err));
      });

    return {
      message: `Assigned Issue to ${nextAssignSupporter}`,
      status: 200
    };
  } catch (err) {
    console.log(JSON.stringify(err));
  }
};

module.exports = {
  find,
  findOne,
  update,
  assign
};
