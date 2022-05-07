import { Card, Button } from "react-bootstrap";
import { Book } from "../reducer/BookReducer";

export const BookCard: React.FC<{ book: Book, bookmarked: Boolean, onBookmark: (ob: Book) => void }> = ({ book, bookmarked, onBookmark }) => {
    return (
        <Card>
            <Card.Img className="mh-50" variant="top" src={book.cover_url} />
            <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Text className="card-description">
                    {book.description}
                </Card.Text>
                <div className="d-flex flex-row justify-content-between">
                    <Button variant="primary">Read More</Button>
                    <Button
                        onClick={() => {
                            onBookmark(book);
                        }}
                        variant="light">
                        <span className={"material-symbols-outlined " + (bookmarked ? 'gfont-fill' : '')}>
                            bookmark
                        </span>
                    </Button>
                </div>
            </Card.Body>
        </Card >
    );
}