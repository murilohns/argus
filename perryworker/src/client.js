import chalk from 'chalk';
import Promise from 'bluebird';

import requests from './requests';
import Worker from './worker';
import controllers from './mongo/controllers';
import Mongo from './mongo/connection';
import Helpers from './mongo/helper';
import Generators from './generators';
import asciiPerry from '../ascii';
import Sieve from './sieve';

console.log(asciiPerry);
console.log(chalk.green('PerryWorker started running...'));
Worker([
  {
    promise: requests.repositories.find({ organization: 'pagarme' }),
    callback: Promise.coroutine(function* (response) {
      const apiOrganization = response.data.organization;

      return yield Generators.organization.saveOrganization(apiOrganization, apiOrganization.repositories.nodes);
    })
  },
  {
    promise: requests.issues.findFromOrganization('pagarme', ['OPEN']),
    callback: Promise.coroutine(function* (response) {
      let organization = response.data.organization;

      return yield Generators.organization.saveOrganization(organization, organization.repositories.nodes);
    })
  },
  {
    promise: requests.issues.findFromOrganization('pagarme', ['CLOSED']),
    callback: Promise.coroutine(function* (response) {
      let organization = response.data.organization;

      return yield Generators.organization.saveOrganization(organization, organization.repositories.nodes);
    })
  },
  {
    promise: requests.pullrequests.fromOrganization('pagarme'),
    callback: Promise.coroutine(function* (response) {
      let organization = response.data.organization;

      return yield Generators.organization.saveOrganization(organization, organization.repositories.nodes);
    })
  },
  {
    promise: requests.issues.findRelated('pagarme'),
    callback: (issues, callback) => {

      return issues.map(Promise.coroutine(function* (githubIssue) {
        const githubRepositoryOwner = githubIssue.repository.owner;

        let mongoRepositoryOwner = null;
        if( githubRepositoryOwner.__typename === 'Organization' ) {
          mongoRepositoryOwner = yield Generators.organization.saveOrganization(
            githubRepositoryOwner
          );
        } else if( githubRepositoryOwner.__typename === 'User' ) {
          mongoRepositoryOwner = yield Generators.user.saveUser(
            githubRepositoryOwner
          );
        }

        mongoRepositoryOwner = {
          model: githubRepositoryOwner.__typename,
          id: mongoRepositoryOwner._id
        };

        let repository = yield Generators.repository.saveRepository(
          mongoRepositoryOwner, githubIssue.repository
        );

        return yield Generators.issue.saveIssue( repository, githubIssue );
      }));

    }
  }
]).run(() => {
  console.log(chalk.yellow('Perryworker stopped running.'));
  Mongo.connection.close();
});
