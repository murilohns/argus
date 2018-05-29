export default {
  repositories: {
    findAll: `query findAllReposQuery($organization: String!) {
      organization(login: $organization) {
        id
        name
        login
        repositories(first: 50, orderBy: {field: UPDATED_AT, direction: DESC}, privacy: PUBLIC) {
          nodes {
            id
            name
            url
            primaryLanguage {
              name
            }
          }
        }
      }
    }`,
    findOne: `query findOneRepoQuery($organization: String!, $repository: String!) {
      organization(login: $organization) {
        id
        name
        login
        repository(name: $repository) {
          id
          name
          url
          primaryLanguage {
            name
          }
        }
      }
    }`
  },
  issues: {
    company: `query findAllReposQuery($organization: String!, $status: [IssueState!]) {
      organization(login: $organization) {
        id
        name
        login
        repositories(first: 30, orderBy: {field: UPDATED_AT, direction: DESC}, privacy: PUBLIC) {
          nodes {
            id
            name
            url
            primaryLanguage {
              name
            }
            issues(first: 40 orderBy: {field: UPDATED_AT, direction: DESC} states:$status) {
              totalCount,
              nodes {
                id
                title
                state
                author {
                  login
                  url
                  avatarUrl
                }
                createdAt
                url
                bodyText
                assignees(first: 3) {
                  nodes {
                    id
                    login
                    avatarUrl
                    url
                  }
                }
                comments(first: 50) {
                  totalCount
                  nodes {
                    id
                    bodyText
                    author {
                      login
                      avatarUrl
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`,
    related: `query pagarmeqlRelatedIssuesQuery($term: String!){
      search(query: $term, type: ISSUE, first: 50) {
        nodes {
          ... on Issue {
            __typename
            id
            title
            state
            createdAt
            url
            author {
              login
              avatarUrl
              url
            }
            assignees(first: 3) {
              nodes {
                id
                avatarUrl
                login
                url
              }
            }
            comments(last: 1) {
              totalCount
              nodes {
                id
                bodyText
                author {
                  login
                  avatarUrl
                  url
                }
              }
            }
            repository {
              id
              name
              url
              isPrivate
              owner {
                __typename
                ... on User {
                  id
                  avatarUrl
                  name
                  login
                  url
                }
                ... on Organization {
                  id
                  login
                  name
                }
              }
            }
          }
        }
      }
    }`
  },
  pullrequests: {
    organization: `query findAllReposQuery($organization: String!) {
      organization(login: $organization) {
        id
        name
        login
        repositories(first: 30, orderBy: {field: UPDATED_AT, direction: DESC}, privacy: PUBLIC) {
          nodes {
            id
            name
            url
            primaryLanguage {
              name
            }
            pullRequests(first: 20 orderBy: {field: UPDATED_AT, direction: DESC} states:[OPEN]) {
              totalCount
              nodes {
                id
                title
                createdAt
                url
                bodyText
                repository {
                  id
                  name
                  url
                  primaryLanguage {
                    name
                  }
                }
                author {
                  login
                  url
                  avatarUrl
                }
                comments(last: 1) {
                  totalCount
                  nodes {
                    id
                    bodyText
                    author {
                      login
                      avatarUrl
                      url
                    }
                  }
                }
                commits {
                  totalCount
                }
              }
            }
          }
        }
      }
    }`
  }
}
