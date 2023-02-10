import { useEffect, useState } from "react";
import { GithubUser } from "../types/GithubUser";
import PaginateResult from "./PaginateResult";
import ResultTable from "./ResultTable";

const GithubCommonFollowers = () => {
  const [username1, setUsername1] = useState("");
  const [username2, setUsername2] = useState("");

  const [username1Followers, setUsername1Followers] = useState<GithubUser[]>();
  const [username2Followers, setUsername2Followers] = useState<GithubUser[]>();
  const [commonList, setCommonList] = useState<GithubUser[]>([]);
  const [pageNum, setPageNum] = useState(0);
  const [errorText, setErrorText] = useState("");

  const [initLoad, setinitload] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  function fetchFollowersAPi(
    term: String,
    page = 1,
    previousResponse: unknown[] = [],
    setFollowers: React.Dispatch<React.SetStateAction<GithubUser[] | undefined>>
  ) {
    fetch(
      `https://api.github.com/users/${term}/followers?per_page=50&page=${page}`
    ) // Append the page number to the base URL
      .then((response) => {
        if (response.status === 404) {
          setErrorText(`Username ${term} not found`);
          setIsLoading(false);
        } else if (!response.ok) {
          setErrorText(`There is issue on handeling request`);
          setIsLoading(false);
        } else {
          return response.json();
        }
      })
      .then((newResponse) => {
        const response: GithubUser[] = [...previousResponse, ...newResponse]; // Combine the two arrays

        if (newResponse.length !== 0) {
          page++;

          return fetchFollowersAPi(term, page, response, setFollowers);
        }

        setFollowers(response);
      })
      .catch((err) => {
        console.log("err" + err.message);
      });
  }

  function findCommonFollowers() {
    fetchFollowersAPi(username1, 1, [], setUsername1Followers);
    fetchFollowersAPi(username2, 1, [], setUsername2Followers);
  }
  useEffect(() => {
    setCommonList(
      username1Followers?.filter((u1) =>
        username2Followers?.some((u2) => u1.login === u2.login)
      ) ?? []
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username2Followers]);
  useEffect(() => {
    setErrorText(
      commonList.length !== 0 || initLoad
        ? ""
        : "There is no mutual follower between these users"
    );
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commonList]);

  async function handleSubmit(event: any) {
    event.preventDefault();
    setIsLoading(true);
    setinitload(false);
    findCommonFollowers();
  }

  return (
    <>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 ">
        <div className="mx-auto ">
          <div className="bg-gray-100 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="py-3 text-lg font-medium leading-6 text-gray-900">
                GitHub Mutual Followers Finder
              </h3>

              <div className="w-full sm:max-w-xs">
                <label htmlFor="search" className="sr-only">
                  GitHub Mutual Followers Finder
                </label>
                <form onSubmit={handleSubmit}>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="username1"
                      id="username1"
                      className="block w-full my-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder=" GitHub username"
                      value={username1}
                      onChange={(e) => setUsername1(e.target.value)}
                    />
                    <input
                      type="text"
                      name="username2"
                      id="username2"
                      className="block w-full my-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder=" GitHub username"
                      value={username2}
                      onChange={(e) => setUsername2(e.target.value)}
                    />
                  </div>

                  <div>
                    <>
                    {isLoading? <button
                      type="submit"
                      className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Loading data, please wait
                    </button>:<button
                      type="submit"
                      className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Search
                    </button>}
                    </>
                    
                  </div>
                </form>
              </div>
            </div>
            <hr className="" />
            {commonList?.length ? (
              <>
                <ResultTable
                  searchResult={commonList.slice(
                    pageNum * 10,
                    (pageNum + 1) * 10
                  )}
                />
                <PaginateResult
                  searchResult={commonList}
                  setPageNum={setPageNum}
                  pageNum={pageNum}
                />
              </>
            ) : (
              <div className="bg-gray-100">
                <div className="px-4 py-16 mx-auto max-w-7xl sm:py-24 sm:px-6 lg:px-8">
                  <div className="text-center">
                    <p
                      className={`mt-1 text-4xl font-bold tracking-tight ${
                        errorText === "" ? "text-gray-900" : "text-red-600"
                      } text-2xl`}
                    >
                      {errorText}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default GithubCommonFollowers;
