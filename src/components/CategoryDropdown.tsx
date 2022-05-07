import React, { useState } from "react";
import { render } from "react-dom";
import { AnchorProps, Dropdown, FormControl, Row, ToggleButton, TooltipProps } from "react-bootstrap";

import { Category } from "../reducer/BookReducer";
import { DropdownMenuProps } from "react-bootstrap/esm/DropdownMenu";

interface FilterMenuProps extends DropdownMenuProps {
    bookmarkedOnly?: boolean;
    setBookmarkedOnly: (value: boolean) => void;
    searchValue: string;
    onChangeSearch: (value: string) => void;
}

const FilterMenu = React.forwardRef<HTMLDivElement, FilterMenuProps>(
    ({ children, style, className, 'aria-labelledby': labeledBy, bookmarkedOnly, setBookmarkedOnly, searchValue, onChangeSearch }, ref) => {

        return (
            <div
                ref={ref}
                style={style}
                className={className + " px-3"}
                aria-labelledby={labeledBy}
            >
                <ul className="list-unstyled mb-2">
                    {children}
                </ul>

                <ToggleButton
                    id="toggle-bookmark"
                    type="checkbox"
                    variant="outline-primary"
                    className="w-100"
                    checked={bookmarkedOnly}
                    value="1"
                    onChange={(e) => {
                        setBookmarkedOnly(e.currentTarget.checked);
                    }}
                >
                    Bookmarked
                </ToggleButton>

                <FormControl
                    autoFocus
                    className="my-2 w-auto"
                    placeholder="Search books..."
                    onChange={(e) => onChangeSearch(e.target.value)}
                    value={searchValue}
                />

            </div>
        );
    },
);

interface FilterDropdownProps {
    categories: Category[];
    selectedCategory?: Category;
    onSelect: any;
    bookmarkedOnly?: boolean;
    setBookmarkedOnly: (value: boolean) => void;
    searchValue: string;
    onChangeSearch: (value: string) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ categories, selectedCategory, onSelect, bookmarkedOnly, setBookmarkedOnly, searchValue, onChangeSearch }) => {
    return (
        <Dropdown
            className="dropdown-category" onSelect={onSelect}>
            <Dropdown.Toggle variant="primary" disabled={categories.length === 0}>
                Filter
            </Dropdown.Toggle>

            <Dropdown.Menu
                as={FilterMenu}
                bookmarkedOnly={bookmarkedOnly}
                setBookmarkedOnly={setBookmarkedOnly}
                onChangeSearch={onChangeSearch}
                searchValue={searchValue} >
                <Dropdown
                    className="dropdown-category" onSelect={onSelect}>
                    <Dropdown.Toggle variant="primary" disabled={categories.length === 0}>
                        {selectedCategory ? selectedCategory.name : 'Category'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {categories.map(c => (
                            <Dropdown.Item key={c.id} eventKey={c.id}>{c.name}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Dropdown.Menu>
        </Dropdown>
    );
}

// export const CategoryDropdown: React.FC<{ categories: Category[], selectedCategory?: Category, onSelect: any }> = ({ categories, selectedCategory, onSelect }) => {
//     return (
//         <Dropdown
//             className="dropdown-category" onSelect={onSelect}>
//             <Dropdown.Toggle variant="primary" disabled={categories.length === 0}>
//                 {selectedCategory ? selectedCategory.name : 'Category'}
//             </Dropdown.Toggle>

//             <Dropdown.Menu>
//                 {categories.map(c => (
//                     <Dropdown.Item key={c.id} eventKey={c.id}>{c.name}</Dropdown.Item>
//                 ))}
//             </Dropdown.Menu>
//         </Dropdown>
//     );
// }