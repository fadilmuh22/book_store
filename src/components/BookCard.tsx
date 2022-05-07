import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Book } from "../reducer/BookReducer";

export const BookCard: React.FC<{ book: Book, bookmarked: Boolean, onBookmark: (ob: Book) => void }> = ({ book, bookmarked, onBookmark }) => {
    return (
        <Card>
            <Link to={"/" + book.id} state={{ ...book }}>
                <Card.Img className="mh-50 card-img" variant="top" src={book.cover_url} />
            </Link>
            <Card.Body>
                <Link to={"/" + book.id} state={{ ...book }}>
                    <Card.Title className="card-title">{book.title}</Card.Title>
                </Link>
                <Card.Text className="card-description">
                    {book.description}
                </Card.Text>
                <div className="d-flex flex-row justify-content-between">
                    <Link to={"/" + book.id} state={{ ...book }}>
                        <Button variant="primary">Read More</Button>
                    </Link>
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