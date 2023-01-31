/* eslint-disable */
import ReactPaginate from "react-paginate";

import { Row, Col } from 'reactstrap';
import { useParams } from "react-router-dom";


const PaginationWrapper = ({ paginate, callback }) =>
{

    const params = useParams();


    return (<>

        {
            paginate.data &&
            <Row>
                <Col className="small">
                    {Boolean(paginate.data.length) && <div className="my-2 ms-1"> Showing {paginate?.from} to {paginate.to} of {paginate.total} entries</div>}
                </Col>
                <Col>

                    {(paginate && Boolean(paginate.data.length)) &&
                        <ReactPaginate
                            previousLabel={""}
                            nextLabel={""}
                            pageCount={paginate && paginate.last_page !== 0 ? paginate.last_page : 0}
                            activeClassName="active"
                            onPageChange={({ selected }) => callback({ page: selected + 1 })}
                            pageClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            nextClassName={"page-item next"}
                            previousClassName={"page-item prev"}
                            previousLinkClassName={"page-link"}
                            pageLinkClassName={"page-link"}
                            containerClassName={
                                "pagination react-paginate justify-content-end my-2 pe-1"
                            }
                        />}

                </Col>
            </Row>

        }
    </>);
}

export default PaginationWrapper;