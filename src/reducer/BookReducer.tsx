export interface Category {
    id: number;
    name: string;
}

export interface Book {
    id: number;
    title: string;
    category_id: number;
    authors: string[];
    cover_url: string;
    description: string;
    sections: Section[];
    audio_length: number;
}

export interface Section {
    title: string;
    content: string;
}

export type BookActions =
    | { type: 'setBooks', books: Book[] }
    | { type: 'addAll', books: Book[] }
    | { type: 'setBookmark', bookmark: Book[] }
    | { type: 'add', book: Book }
    | { type: 'remove', book: Book };

export type BookState = {
    books: Book[]
    bookmark: Book[]
};

export const BookReducer = (state: BookState, action: BookActions): BookState => {
    switch (action.type) {
        case 'setBooks':
            return { ...state, books: action.books };
        case 'addAll':
            return { ...state, books: action.books };
        case 'setBookmark':
            return { ...state, bookmark: action.bookmark };
        case 'add':
            return { ...state, bookmark: [...state.bookmark, action.book] };
        case 'remove':
            return { ...state, bookmark: state.bookmark.filter(sb => sb.id !== action.book.id) };
        default:
            throw new Error();
    }
}

