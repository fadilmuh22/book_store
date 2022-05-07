import React, { useEffect, useReducer, useState } from 'react';
import { Button, Col, Container, Row, ToggleButton } from 'react-bootstrap';

import http from './utils/http-common';
import { BookReducer, Category } from './reducer/BookReducer';

import { BookCard } from './components/BookCard';
import { FilterDropdown } from './components/CategoryDropdown';
import { ShimmerCard } from './components/ShimmerCard';

import './styles/App.css';
import './styles/ShimmerCard.css';

const App: React.FC = () => {
  const [bookState, dispatch] = useReducer(BookReducer, { books: [], bookmark: [] });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [page, setPage] = useState(0);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setLoadingBooks(true);
    getCategories();
    let bookmarkLocal = localStorage.getItem('bookmark');
    if (bookmarkLocal?.length) {
      dispatch({ type: 'setBookmark', bookmark: JSON.parse(bookmarkLocal!) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getBooks(selectedCategory?.id!, page);
  }, [selectedCategory, page]);

  useEffect(() => {
    if (bookmarkedOnly) {
      dispatch({ type: 'setBooks', books: [...bookState.bookmark] })
    } else {
      getBooks(selectedCategory?.id!, page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarkedOnly]);

  const getCategories = () => {
    http
      .get('/fee-assessment-categories')
      .then(res => {
        setCategories(res.data);
        setSelectedCategory(res.data[0]);
        getBooks(selectedCategory?.id!, page);
      })
      .catch(e => {
        console.log(e);
      });
  }

  const getBooks = (categoryId: number, page: number) => {
    setLoadingBooks(true);
    http
      .get('/fee-assessment-books', { params: { categoryId, page, size: 8 } })
      .then(res => {
        dispatch({ type: 'setBooks', books: res.data })
        setTimeout(() => {
          setLoadingBooks(false);
        }, 500);
      })
      .catch(e => {
        console.log(e);
        setTimeout(() => {
          setLoadingBooks(false);
        }, 2000);
      });
  }

  return (
    <Container className="App my-4 justify-content-center">
      <div className="d-flex justify-content-between">
        {/* <CategoryDropdown
          categories={categories}
          selectedCategory={selectedCategory!}
          onSelect={(e: string) => {
            setSelectedCategory(categories.find(c => c.id === parseInt(e))!);
            setPage(0);
          }}
        /> */}
        <FilterDropdown
          categories={categories}
          selectedCategory={selectedCategory!}
          onSelect={(e: string) => {
            setSelectedCategory(categories.find(c => c.id === parseInt(e))!);
            setPage(0);
          }}
          bookmarkedOnly={bookmarkedOnly}
          setBookmarkedOnly={(b) => {
            setBookmarkedOnly(b);
          }}
          searchValue={searchValue}
          onChangeSearch={(v) => {
            setSearchValue(v);
            if (v === '') {
              getBooks(selectedCategory?.id!, page);
            } else {
              let regexBook = new RegExp(v, 'i');
              dispatch({
                type: 'setBooks', books: bookState.books.filter(bs => bs.title.search(regexBook) > -1)
              })
            }
          }}
        />
        {/* <ToggleButton
          id="toggle-bookmark"
          type="checkbox"
          variant="outline-primary"
          checked={bookmarkedOnly}
          value="1"
          onChange={(e) => {
            setBookmarkedOnly(e.currentTarget.checked);
          }}
        >
          Bookmarked
        </ToggleButton> */}
      </div>

      <div className="books-container mt-4">
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {loadingBooks
            ? [1, 2, 3, 4].map((n) => (<Col key={n}><ShimmerCard /></Col>))
            : bookState.books.map(b => {
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
        </div>
      </div>

      <div className='pagination-button-container mt-5'>
        <Button
          onClick={() => {
            setPage(page - 1);
          }}
          disabled={page === 0 || bookmarkedOnly}
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
          disabled={bookmarkedOnly}
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
