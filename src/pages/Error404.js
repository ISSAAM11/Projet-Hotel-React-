
const ErrorPage = () =>{

    return(

        <div class="">

        <section class="content-header">
        <div class="container-fluid">
        <div class="row mb-2">
        <div class="col-sm-6">
        </div>
        <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
        </ol>
        </div>
        </div>
        </div>
        </section>
        
        <section class="content "   style={{paddingTop: '150px'}}>
        <div class="error-page">
        <h2 class="headline "> 404</h2>
        <div class="error-content">
        <h3><i class="fas fa-exclamation-triangle text-warning"></i> Oops! Page not found.</h3>
        <p>
         We could not find the page you were looking for.
        Meanwhile, you may <a href="home/hotels">return to home page</a> or try using the search form.
        </p>
        <form class="search-form">
        <div class="input-group">
        <div class="input-group-append">
        </div>
        </div>
        
        </form>
        </div>
        
        </div>
        
        </section>
        
        </div>
        

    )
}
export default ErrorPage;