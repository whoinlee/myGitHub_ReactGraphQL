import { useEffect, useState } from 'react';
//-- Components
import RepoInfo from './components/RepoInfo';
import SearchBox from './components/SearchBox';
import NavButtons from "./components/NavButtons";
//
import github from './data/db';
import query from './data/Query';
/* -- in the db.js
const github = {
    baseURL: "https://api.github.com/graphql",
    username: [username],
    headers: {
        "Content-Type": "application/json",
        Authorization: "bearer [access token]"
    }
};
*/


function App() {
  const [userName, setUserName] = useState("");
  const [repoList, setRepoList] = useState(null);
  const [pageCount, setPageCount] = useState(10);
  const [queryString, setQueryString] = useState("react");
  const [totalCount, setTotalCount] = useState(null);
  //
  let [startCursor, setStartCursor] = useState(null);
  let [endCursor, setEndCursor] = useState(null);
  let [hasPreviousPage, setHasPreviousPage] = useState(false);
  let [hasNextPage, setHasNextPage] = useState(true);
  let [paginationKeyword, setPaginationKeyword] = useState("first");
  let [paginationString, setPaginationString] = useState("");

  useEffect(() => {
    const queryText = JSON.stringify(query(pageCount, queryString, paginationKeyword, paginationString));
    const fetchData = async() => {
      try{
        console.log("App :: fetchData called ==========> how many times??");
        const res = await fetch(github.baseURL, {
          method: "POST",
          headers: github.headers,
          body: queryText,
        });
        const data = (await res.json()).data;

        const viewer = data.viewer;
        const search = data.search;
        setUserName(viewer.name);
        setRepoList(search.edges);
        
        const total = search.repositoryCount;
        const start = search.pageInfo?.startCursor;
        const end = search.pageInfo?.endCursor;
        const next = search.pageInfo?.hasNextPage;
        const prev = search.pageInfo?.hasPreviousPage;
        setTotalCount(total);
        setStartCursor(start);
        setEndCursor(end);
        setHasNextPage(next);
        setHasPreviousPage(prev);
      } catch (e) {
        console.log("App :: e.message is " + e.message);
      }
    };//fetchData
    fetchData();
  }, [pageCount, queryString, paginationString, paginationKeyword]);

  return (
    <div className="App container mt-5">
      <h1 className="text-primary">
        <i className="bi bi-diagram-2-fill" /> Repos
      </h1>
      <p>Hey there, {userName}</p>
      <SearchBox
        totalCount={totalCount}
        pageCount={pageCount}
        queryString={queryString}
        onTotalChange={(myNumber) => {
          setPageCount(myNumber);
        }}
        onQueryChange={(myString) => {
          setQueryString(myString);
        }}
      />
      <NavButtons
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        previous={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString);
        }}
      />
      {repoList && (
        <ul className="list-group list-group-flush">
          {repoList.map(repo => 
           <RepoInfo repo={repo.node} key={repo.node.id}/>
          )}
        </ul>
      )}
      <NavButtons
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        previous={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString);
        }}
      />
    </div>
  );
};

export default App;
