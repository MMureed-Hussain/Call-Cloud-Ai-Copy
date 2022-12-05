// ** React Imports
import { useState } from 'react'
// ** Third Party Components
import { ReactSortable } from 'react-sortablejs'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardText, ListGroupItem, Button, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import { MoreVertical, Edit, Trash } from "react-feather"
import PipelineSidebar from './components/PipelineSidebar'

const listItems = [
    {
        id: '1',
        name: 'New Call',
    },
    {
        id: '2',
        name: 'Pending',
    },
    {
        id: '3',
        name: 'Rejected',
    },
    {
        id: '4',
        name: 'Repeated',
    },
    {
        id: '5',
        name: 'Urgent',
    },
]

export default () => {
    // ** State
    const [pipelines, setPipelines] = useState(listItems);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const onUpdate = () => {
        console.log("onUpdate");
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>Pipelines</CardTitle>
                    <div className="d-flex align-items-center table-header-actions">
                        <Button className="add-new-user" color="primary" onClick={toggleSidebar}>
                            Add Pipeline
                        </Button>
                    </div>
                </CardHeader>
                <CardBody>
                    <CardText>
                        Click on the row and sort up or down to sort pipelines.
                    </CardText>
                    <ReactSortable onUpdate={onUpdate} tag='ul' animation={300} className='list-group' list={pipelines} setList={setPipelines} delayOnTouchStart={true} delay={2}>
                        {pipelines.map(item => {
                            return (
                                <ListGroupItem className='draggable' key={item.name}>
                                    <div className='d-flex justify-content-between'>
                                        <h5 className='mt-0'>{item.name}</h5>
                                        <div className="d-flex">
                                            <UncontrolledDropdown>
                                                <DropdownToggle className="pe-1" tag="span">
                                                    <MoreVertical size={15} />
                                                </DropdownToggle>
                                                <DropdownMenu end>
                                                    <DropdownItem>
                                                        <Edit size={15} />
                                                        <span className="align-middle ms-50">Edit</span>
                                                    </DropdownItem>
                                                    <DropdownItem onClick={() => console.log("onclick")}>
                                                        <Trash size={15} className="me-50" />
                                                        <span
                                                            className="align-middle ms-50"
                                                        >
                                                            Delete
                                                        </span>
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </div>
                                    </div>
                                </ListGroupItem>
                            )
                        })}
                    </ReactSortable>
                </CardBody>
            </Card>
            {sidebarOpen && (
                <PipelineSidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
            )}
        </>

    )
}