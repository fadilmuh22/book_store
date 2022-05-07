import React, { useEffect, useReducer, useState } from 'react';
import { Button, Col, Container, Row, ToggleButton } from 'react-bootstrap';

import http from './utils/http-common';
import { BookReducer, Category } from './reducer/BookReducer';

import { BookCard } from './components/BookCard';
import { CategoryDropdown } from './components/CategoryDropdown';

import './styles/App.css';
import './styles/ShimmerCard.css';

const App: React.FC = () => {
  const [bookState, dispatch] = useReducer(BookReducer, { books: [], bookmark: [] });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [page, setPage] = useState(0);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  useEffect(() => {
    getCategories();
    let bookmarkLocal = localStorage.getItem('bookmark');
    if (bookmarkLocal?.length) {
      dispatch({ type: 'setBookmark', bookmark: JSON.parse(bookmarkLocal!) });
    }
  }, []);

  useEffect(() => {
    console.log(selectedCategory?.id!);
    getBooks(selectedCategory?.id!, page);
  }, [selectedCategory, page]);

  useEffect(() => {
    if (bookmarkedOnly) {
      dispatch({ type: 'setBooks', books: [...bookState.bookmark] })
    } else {
      getBooks(selectedCategory?.id!, page);
    }
  }, [bookmarkedOnly]);

  const getCategories = () => {
    try {
      http
        .get('/fee-assessment-categories')
        .then(res => {
          setCategories(res.data);
          setSelectedCategory(res.data[0]);
          getBooks(selectedCategory?.id!, page);
        })
        .catch(e => { console.log(e) });
    } catch (error) {
      console.log(error)
    }
  }

  const getBooks = (categoryId: number, page: number) => {
    try {
      http
        .get('/fee-assessment-books', { params: { categoryId, page, size: 8 } })
        .then(res => {
          console.log({ categoryId, page, size: 8 });
          console.log(res.data);
          dispatch({ type: 'setBooks', books: res.data })
        })
        .catch(e => { console.log(e) });
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container className="App my-4 justify-content-center">
      <div className="d-flex justify-content-between">

        <CategoryDropdown
          categories={categories}
          selectedCategory={selectedCategory!}
          onSelect={(e: string) => {
            setSelectedCategory(categories.find(c => c.id === parseInt(e))!);
            setPage(0);
          }}
        />
        <ToggleButton
          id="toggle-bookmark"
          style={{ marginRight: '1rem' }}
          type="checkbox"
          variant="outline-primary"
          checked={bookmarkedOnly}
          value="1"
          onChange={(e) => {
            setBookmarkedOnly(e.currentTarget.checked);
          }}
        >
          Bookmarked
        </ToggleButton>
      </div>

      <div className="books-container mt-4">
        <Row xs={1} md={4} className="g-4">
          {bookState.books.map(b => {
            let bookmarked = bookState.bookmark.findIndex(bm => bm.id === b.id) !== -1
            return (
              <Col key={b.id}>
                <BookCard book={b} bookmarked={bookmarked} onBookmark={(ob) => {
                  let bookmark = [...bookState.bookmark];
                  if (bookmarked) {
                    bookmark = bookmark.filter(bm => bm.id !== ob.id);
                  } else {
                    bookmark.push(ob);
                  }

                  dispatch({ type: 'setBookmark', bookmark: bookmark });
                  localStorage.setItem('bookmark', JSON.stringify(bookmark))
                }} />
              </Col>
            )
          })}
        </Row>
      </div>

      <div className='pagination-button-container mt-5'>
        <Button
          onClick={() => {
            setPage(page - 1);
          }}
          disabled={page === 0}
          className="pagination-button prev">
          <span className="material-symbols-outlined">
            chevron_left
          </span>
          Previous
        </Button>
        <Button
          onClick={() => {
            setPage(page + 1);
          }}
          className="pagination-button">
          Next
          <span className="material-symbols-outlined">
            chevron_right
          </span>
        </Button>
      </div>

    </Container>
  );
}

export default App;
