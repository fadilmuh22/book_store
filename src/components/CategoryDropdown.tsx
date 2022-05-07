import React, { ReactEventHandler, useEffect, useState } from "react";
import { render } from "react-dom";
import { AnchorProps, Dropdown, FormControl, Row, ToggleButton, TooltipProps } from "react-bootstrap";

import { Category } from "../reducer/BookReducer";
import { DropdownMenuProps } from "react-bootstrap/esm/DropdownMenu";
import { useSearchParams } from "react-router-dom";

type SelectCallback = (eventKey: string | null, e: React.SyntheticEvent<unknown>) => void;

interface FilterDropdownProps {
    categories: Category[];
}

interface FilterMenuProps extends DropdownMenuProps, FilterDropdownProps {
}

const FilterMenu = React.forwardRef<HTMLDivElement, FilterMenuProps>(
    ({ children, style, className, 'aria-labelledby': labeledBy, categories }, ref) => {
        const [searchParams, setSearchParams] = useSearchParams();
        const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
        const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
        const [searchValue, setSearchValue] = useState('');

        useEffect(() => {
            if (searchParams.has('bookmarked')) {
                setBookmarkedOnly(searchParams.get('bookmarked') === 'true');
            }

            if (searchParams.has('categoryId')) {
                let categoryId: string = searchParams.get('categoryId')!;
                setSelectedCategory(categories.find(c => c.id === parseInt(categoryId!))!);
            }

            if (searchParams.has('search')) {
                let searchS: string = searchParams.get('search')!;
                setSearchValue(searchS);
            }
        }, []);

        const onChangeSearch: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
            const { name, value } = event?.target;
            setSearchValue(value);
            let updatedSearchParams = new URLSearchParams(searchParams.toString());
            updatedSearchParams?.set(name, value);
            setSearchParams(updatedSearchParams.toString());
        }

        return (
            <div
                ref={ref}
                style={style}
                className={className + " px-3"}
                aria-labelledby={labeledBy}
            >
                <ul className="list-unstyled mb-2">
                    <Dropdown
                        className="dropdown-category" onSelect={(e: string | null) => {
                            let updatedSearchParams = new URLSearchParams(searchParams.toString());
                            updatedSearchParams?.set('categoryId', e!);
                            setSearchParams(updatedSearchParams.toString());
                            setSelectedCategory(categories.find(c => c.id === parseInt(e!))!);
                        }}>
                        <Dropdown.Toggle variant="primary" disabled={categories.length === 0}>
                            {selectedCategory ? selectedCategory.name : 'Category'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {categories.map(c => (
                                <Dropdown.Item key={c.id} eventKey={c.id}>{c.name}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </ul>

                <ToggleButton
                    id="toggle-bookmark"
                    type="checkbox"
                    variant="outline-primary"
                    className="w-100"
                    checked={bookmarkedOnly}
                    value="1"
                    onChange={(e) => {
                        let updatedSearchParams = new URLSearchParams(searchParams.toString());
                        updatedSearchParams.set('bookmarked', String(e.currentTarget.checked));
                        setSearchParams(updatedSearchParams.toString());
                        setBookmarkedOnly(e.currentTarget.checked);
                    }}
                >
                    Bookmarked
                </ToggleButton>

                <FormControl
                    autoFocus
                    className="my-2 w-auto"
                    placeholder="Search books..."
                    name="search"
                    onChange={(e) => {
                        onChangeSearch(e);
                    }}
                    value={searchValue}
                />

            </div>
        );
    },
);



export const FilterDropdown: React.FC<FilterDropdownProps> = ({ categories }) => {
    return (
        <Dropdown
            className="dropdown-category">
            <Dropdown.Toggle variant="primary" disabled={categories.length === 0}>
                Filter
            </Dropdown.Toggle>

            <Dropdown.Menu
                as={FilterMenu}
                categories={categories}
            >
            </Dropdown.Menu>
        </Dropdown >
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