const githubQuery = {
    query: `
    {
        viewer {
          name
        }
        search(query: "user:whoinlee sort:updated-desc", type: REPOSITORY, first: 10) {
          nodes {
            ... on Repository {
              name
              id
              description
              url
              viewerSubscription
              licenseInfo {
                spdxId
              }
            }
          }
        }
    }
    `
  };

  
//#1.
    // {
    //   viewer {
    //     name
    //   }
    // }

//#2.
    // {
    //     viewer {
    //     name
    //     repositories(first: 10) {
    //         nodes {
    //         name
    //         description
    //         id
    //         url
    //         }
    //     }
    //     }
    // }

//#3.
    // {
    //     viewer {
    //       name
    //       repositories(first: 10) {
    //         nodes {
    //           name
    //           description
    //           id
    //           url
    //         }
    //       }
    //     }
    // }


  export default githubQuery;