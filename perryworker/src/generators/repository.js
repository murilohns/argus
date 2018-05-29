import Promise from 'bluebird';
import controllers from '../mongo/controllers';
import Sieve from '../sieve';
import blacklist from '../blacklist.json';
import IssueGenerators from './issue';
import PullRequestGenerators from './pullrequest';

const RepositoryGenerators = {
  /**
    @param {Object} organization - Organization stored on Mongo Database
    @param {Object} githubRepository - Repository received from Github API
  */
  saveRepository: Promise.coroutine(function* (owner, githubRepository) {
    const { id, name, url, issues, pullRequests } = githubRepository;

    let has = Sieve({
                blacklist: blacklist.repositories,
                itemsToFilter: [ name ]
              }).mitigate();

    if( has.length === 0 ) {
      return;
    }

    const primaryLanguage = githubRepository.primaryLanguage ?
      githubRepository.primaryLanguage.name : '';

    const payload = {
      githubId: id,
      name,
      ownerModel: owner.model,
      ownerId: owner.id,
      primaryLanguage,
      url
    };

    let repository = yield controllers.repository.save(payload);

    if( issues ) {
      yield IssueGenerators.saveIssues(repository, issues.nodes);
    }

    if( pullRequests ) {
      yield PullRequestGenerators.savePullRequests(repository, pullRequests.nodes);
    }

    return repository;
  }),
  /**
    @param {Object} organization - Organization stored on Mongo Database
    @param {Object[]} githubRepositories - Repositories received from Github API
  */
  saveRepositories: Promise.coroutine(function* (owner, githubRepositories) {
    let repositoriesPromises = githubRepositories.map(
      githubRepository => this.saveRepository(owner, githubRepository)
    );

    let repositories = yield Promise.all(repositoriesPromises);
    return repositories;
  })
};

export default RepositoryGenerators;
