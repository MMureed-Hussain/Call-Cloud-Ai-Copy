/* eslint-disable */

import Pagination from "react-js-pagination";

import { Row, Col } from 'reactstrap';
import { useParams } from "react-router-dom";


const PaginationWrapper = ({ paginate, callback, query }) =>
{

    const params = useParams();


    return (<>

        {
            paginate.data &&
            <Row>
                <Col className="small">
                    {paginate.data && <div> Showing {paginate.from} to {paginate.to} of {paginate.total} entries</div>}
                </Col>
                <Col>
                    <div className='d-flex justify-content-end'>
                        <Pagination
                            innerClass="pagination react-paginate justify-content-end my-2 pe-1"
                            activePage={paginate.data ? paginate.current_page : 1}
                            itemsCountPerPage={paginate.data ? paginate.per_page : 0}
                            totalItemsCount={paginate.data ? paginate.total : 0}
                            onChange={(pageNumber) => callback(pageNumber)}
                            pageRangeDisplayed={8}
                            itemClass="page-item"
                            linkClass="page-link"
                            firstPageText={<i className="fa fa-angles-left"></i>}
                            lastPageText={<i className="fa fa-angles-right"></i>}
                            prevPageText={<i className="fa fa-angle-left"></i>}
                            nextPageText={<i className="fa fa-angle-right"></i>}
                        />
                    </div>
                </Col>
            </Row>

        }
    </>);
}

export default PaginationWrapper;