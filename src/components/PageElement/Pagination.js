const Pagination = ({postsPerPage, totalPosts , Paginate, currentPage}) => {
    let pageNumbers = [];

    for(let i = 1; i <= Math.ceil(totalPosts/postsPerPage); i++) {//ceil  round to the smallest number
        pageNumbers.push(i);
    }
    const right = ">>"
    const left = "<<"
    let lastPage = totalPosts/postsPerPage
    lastPage = parseInt(lastPage, 10)+1;
    return(
        <nav className="mt-1 mr-2 float-right">
{pageNumbers.length != 0?
            <ul  className='pagination'>
                <li style={{marginleft: "left"}} className="page-item mr-1">
                        <a onClick={() => Paginate(1)}   className='page-link'> {left} </a>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} style={{marginleft: "left"}} className="page-item">
                        {currentPage == number
                        ?<a onClick={() => Paginate(number)}  className='page-link' style={{backgroundColor: "#EAEAEA"}}> {number}</a>
                        :<a onClick={() => Paginate(number)}  className='page-link'> {number}</a>
                        }
                    </li>
                ))}
                    <li style={{marginleft: "left"}} className="page-item ml-1">
                        <a onClick={() => Paginate(lastPage)}   className='page-link'> {right} </a>
                    </li>
            </ul>
:null}
        </nav>
    )
}
export default Pagination