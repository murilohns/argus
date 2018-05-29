import Promise from 'bluebird';
import controllers from '../mongo/controllers';
import RepositoryGenerators from './repository';

const OrganizationGenerators = {
  saveOrganization: Promise.coroutine(function* (githubOrganization, githubRepositories) {
    const { id, name, login } = githubOrganization;

    let organization = yield controllers.organization.save({ githubId: id, name, login });

    if( githubRepositories ) {
      yield RepositoryGenerators.saveRepositories({
        model: 'Organization',
        id: organization._id
      }, githubRepositories);
    }

    return organization;
  })
}

export default OrganizationGenerators;
