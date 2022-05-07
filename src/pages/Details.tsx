import React, { useEffect } from "react";
import { Accordion, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { Book } from "../reducer/BookReducer";

export const Details: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state === null) {
            navigate('/');
        }
    }, []);

    return (
        <Container className="Details my-4 justify-content-center">
            {
                location.state === null
                    ? <div className='mx-auto'>
                        <h2 className='text-center'>
                            Tidak ada data
                        </h2>
                    </div>
                    : <div className="shadow p-3 mb-5 bg-body rounded rounded-3">
                        <Row xs={1} md={2} className="g-4">
                            <div className="p-5 d-none d-md-block">
                                <img src={(location.state as Book).cover_url} alt={(location.state as Book).id + "_cover"} />
                            </div>
                            <div className="p-3 p-md-5">
                                <h2 className="fw-bold fs-1 mb-3">{(location.state as Book).title}</h2>
                                <p className="fs-6 mb-1" style={{ textAlign: 'justify' }}>{(location.state as Book).description}</p>
                                <p className="fs-6" style={{ color: "#777" }}>{(location.state as Book).authors.join(', ')}</p>

                                <Accordion>
                                    {(location.state as Book).sections.map((bs, idx) => (
                                        <Accordion.Item eventKey={idx.toString()}>
                                            <Accordion.Header>{bs.title}</Accordion.Header>
                                            <Accordion.Body style={{ textAlign: 'justify' }}>
                                                {bs.content}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </div>
                        </Row>
                    </div>
            }

        </Container>
    );
}