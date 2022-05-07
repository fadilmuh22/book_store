import { Dropdown } from "react-bootstrap";
import { Category } from "../reducer/BookReducer";

export const CategoryDropdown: React.FC<{ categories: Category[], selectedCategory?: Category, onSelect: any }> = ({ categories, selectedCategory, onSelect }) => {
    return (
        <Dropdown onSelect={onSelect}>
            <Dropdown.Toggle variant="primary" disabled={categories.length === 0}>
                {selectedCategory ? selectedCategory.name : 'Category'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {categories.map(c => (
                    <Dropdown.Item key={c.id} eventKey={c.id}>{c.name}</Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}