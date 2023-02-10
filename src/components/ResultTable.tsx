/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-redundant-roles */
import { GithubUser } from "../types/GithubUser";


const ResultTable=(props:{searchResult?:GithubUser[]}): JSX.Element =>{
    const { searchResult } = props;
return(
    <>
 
    <ul role="list" className="grid grid-cols-1 gap-6 px-4 py-8 bg-gray-100 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {searchResult?.map((githubUser,index) => (
        <li
          key={index}
          className="flex flex-col col-span-1 text-center bg-white divide-y divide-gray-200 rounded-lg shadow"
        >
          <div className="flex flex-col flex-1 p-8">
            <img className="flex-shrink-0 w-auto mx-auto rounded-md h-52" src={githubUser.avatar_url} alt={githubUser.login} />
           
            <dl className="flex flex-col justify-between flex-grow mt-1">
              <dt className="sr-only">Title</dt>
              <h3 className="mt-6 text-sm font-medium text-gray-900">{githubUser.login}</h3>
          
            
            </dl>
          </div>
          <div>
          <div className="flex -mt-px bg-gray-200 divide-x divide-gray-200 hover:bg-gray-800">
              <div className="flex flex-1 w-0">
                <a
                  href={githubUser.html_url} 
                  className="relative inline-flex items-center justify-center flex-1 w-0 py-4 -mr-px text-sm font-medium text-gray-700 border border-transparent rounded-bl-lg hover:text-gray-100"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                
                  <span className="ml-3">Profile</span>
                </a>
              </div>
           
            </div>
          </div>
        </li>
      ))}
    </ul>
    </>
)
}
export default ResultTable;