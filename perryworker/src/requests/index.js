import repositories from './repositories.js';
import issues from './issues.js';
import pullrequests from './pullrequests';

export default {
  repositories: repositories(),
  issues: issues(),
  pullrequests: pullrequests()
}
