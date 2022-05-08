import React, { useEffect, useReducer, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';

import http from '../utils/http-common';
import { BookReducer, Category } from '../reducer/BookReducer';

import { BookCard } from '../components/BookCard';
import { FilterDropdown } from '../components/FilterDropdown';
import { ShimmerCard } from '../components/ShimmerCard';

import '../styles/Home.css';
import '../styles/ShimmerCard.css';

export const Home: React.FC = () => {
  const [bookState, dispatch] = useReducer(BookReducer, { books: [], bookmark: [] });
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [page, setPage] = useState(0);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    parseQueryString(searchParams);
  }, [searchParams]);

  useEffect(() => {
    getBooks(selectedCategory?.id!, page);
  }, [selectedCategory, page]);

  useEffect(() => {
    if (bookmarkedOnly) {
      dispatch({ type: 'setBooks', books: [...bookState.bookmark] })
      return;
    }

    getBooks(selectedCategory?.id!, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarkedOnly]);

  useEffect(() => {
    setLoadingBooks(true);

    getCategories().then(() => {
      let bookmarkLocal = localStorage.getItem('bookmark');
      if (bookmarkLocal?.length) {
        dispatch({ type: 'setBookmark', bookmark: JSON.parse(bookmarkLocal!) });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const parseQueryString = (qs: any) => {
    let parsedSearchParams = new URLSearchParams(searchParams.toString());

    if (parsedSearchParams.has('bookmarked')) {
      setBookmarkedOnly(parsedSearchParams.get('bookmarked') === 'true');
      if (parsedSearchParams.get('bookmarked') === 'true') {
        dispatch({ type: 'setBooks', books: [...bookState.bookmark] })
      }
    }

    if (parsedSearchParams.has('categoryId')) {
      let categoryId: string = parsedSearchParams.get('categoryId')!;
      setSelectedCategory(categories.find(c => c.id === parseInt(categoryId!))!);
    }

    if (parsedSearchParams.has('page')) {
      let page: string = parsedSearchParams.get('page')!;
      setPage(parseInt(page!)!);
    }

    if (parsedSearchParams.has('search')) {
      let searchS: string = parsedSearchParams.get('search')!;
      setSearchValue(searchS);
    }
  }

  const getCategories = async () => {
    return new Promise<void>(async (resolve, reject) => {
      try {

        const res = await http.get('/fee-assessment-categories');
        console.log(res.data);
        setCategories(res.data);
        setSelectedCategory(res.data[0]);

        console.log(res.data[0].id!, page)

        getBooks(selectedCategory?.id!, page);

        resolve();
      } catch (error) {
        console.log(error);
        reject();
      }
    });

  }

  const getBooks = async (categoryId: number, page: number) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        setLoadingBooks(true);
        setIsLastPage(false);

        const res = await http.get('/fee-assessment-books', { params: { categoryId, page, size: 8 } });

        console.log("masuk " + JSON.stringify(res.data));

        if (searchValue !== '') {
          console.log(searchValue)
          let regexBook = new RegExp(searchValue, 'i');

          dispatch({
            type: 'setBooks', books: res.data.filter((bs: { title: string; }) => bs.title.search(regexBook) > -1)
          })
        } else {
          dispatch({ type: 'setBooks', books: res.data })
        }

        setTimeout(() => {
          setLoadingBooks(false);
          parseQueryString(0);
        }, 500);

        resolve();
      } catch (error) {
        if (error.response.data === '' && page > 1) {
          setIsLastPage(true);
        }
        reject();
      }

      setTimeout(() => {
        setLoadingBooks(false);
        parseQueryString(0);
      }, 500);

      resolve();

    });

  }

  return (
    <Container className="Home my-4 justify-content-center">
      <div className="d-flex justify-content-between">
        <FilterDropdown
          categories={categories}
        />
      </div>

      <div className="books-container mt-4">
        <Row xs={1} md={4} className="g-4">

          {
            bookmarkedOnly
              && bookState.books.length === 0
              ? (
                <div className='mx-auto'>
                  <h2 className='text-center'>
                    Tidak ada buku {searchValue !== '' ? (<>dengan kata kunci <b>{searchValue}</b>
                    </>
                    ) : ''}  yang sudah di bookmark
                  </h2>
                </div>
              )
              : <></>
          }
          {
            !bookmarkedOnly
              && searchValue !== ''
              && bookState.books.length === 0
              ? (
                <div className='mx-auto'>
                  <h2 className='text-center'>Tidak ada buku dengan kata kunci <b>{searchValue}</b>  yang ditemukan</h2>
                </div>
              )
              : <></>
          }


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
        </Row>

        {
          isLastPage
            ? (
              <div className='mx-auto mt-5'>
                <h5 className='text-center'>Telah Mencapai Page Terakhir</h5>
              </div>
            )
            : <></>
        }

      </div>

      <div className='pagination-button-container mt-5'>
        <Button
          onClick={() => {
            setPage(page - 1);

            let updatedSearchParams = new URLSearchParams(searchParams.toString());
            updatedSearchParams?.set('page', (page - 1).toString());
            setSearchParams(updatedSearchParams.toString());
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

            let updatedSearchParams = new URLSearchParams(searchParams.toString());
            updatedSearchParams?.set('page', (page + 1).toString());
            setSearchParams(updatedSearchParams.toString());
          }}
          disabled={bookmarkedOnly || isLastPage}
          className="pagination-button">
          Next
          <span className="material-symbols-outlined">
            chevron_right
          </span>
        </Button>
      </div>

    </Container >
  );
}
