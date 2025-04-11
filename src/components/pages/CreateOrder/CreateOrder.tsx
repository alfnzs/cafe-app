import { FormEvent, useEffect, useState } from 'react';
import styles from './CreateOrder.module.css';
import { createOrder, getMenu } from '../../../services/order.service';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { CartItem, MenuItem } from '../../../types/order';
import { filters, tables } from './CreateOrder.constants';

const CreateOrder = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [carts, setCarts] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage] = useState(6); // Items per page

  // Fetch menu based on the category filter or search params
  useEffect(() => {
    const fetchMenu = async () => {
      const result = await getMenu(searchParams.get('category') as string);
      setMenu(result.data);
    };
    fetchMenu();
  }, [searchParams.get('category')]);

  // Handle adding items to cart (increment or decrement)
  const handleAddToCart = (type: string, id: string, name: string) => {
    const itemIsInCart = carts.find((item: CartItem) => item.id === id);
    if (type === 'increment') {
      if (itemIsInCart) {
        setCarts(
          carts.map((item: CartItem) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        );
      } else {
        setCarts([...carts, { id, name, quantity: 1 }]);
      }
    } else {
      if (itemIsInCart && itemIsInCart.quantity <= 1) {
        setCarts(carts.filter((item: CartItem) => item.id !== id));
      } else {
        setCarts(
          carts.map((item: CartItem) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
          ),
        );
      }
    }
  };

  // Handle order submission
  const handleOrder = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const payload = {
      customerName: form.customerName.value,
      tableNumber: form.tableNumber.value,
      cart: carts.map((item: CartItem) => ({
        menuItemId: item.id,
        quantity: item.quantity,
        notes: '',
      })),
    };
    await createOrder(payload);
    window.location.href = '/orders';
  };

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter menu based on search term
  const filteredMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMenu.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.create}>
      <div className={styles.menu}>
        <h1>Explore Our Best Menu</h1>

        {/* Search Input */}
        <div className={styles.search}>
          <Input
            type="text"
            id="search-input"
            name="search"
            label=""
            placeholder="Search for items"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className={styles.filter}>
          {filters.map((filter) => (
            <Button
              type="button"
              color={
                (!searchParams.get('category') && filter === 'All') ||
                filter === searchParams.get('category')
                  ? 'primary'
                  : 'secondary'
              }
              onClick={() =>
                setSearchParams(filter === 'All' ? {} : { category: filter })
              }
              key={filter}
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className={styles.list}>
          {currentItems.length > 0 ? (
            currentItems.map((item: MenuItem) => (
              <div className={styles.item} key={item.id}>
                <img
                  src={item.image_url}
                  alt={item.name}
                  className={styles.image}
                />
                <h2>{item.name}</h2>
                <div className={styles.bottom}>
                  <p className={styles.price}>${item.price}</p>
                  <Button
                    type="button"
                    onClick={() =>
                      handleAddToCart('increment', item.id, item.name)
                    }
                  >
                    Order
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No items found</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className={styles.pagination}>
          <Button
            color="secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {'<'}
          </Button>

          {/* Page numbers */}
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index + 1}
              color={currentPage === index + 1 ? 'primary' : 'secondary'}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Button>
          ))}

          <Button
            color="secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {'>'}
          </Button>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleOrder}>
        <div>
          <div className={styles.header}>
            <h2 className={styles.title}>Customer Information</h2>
            <Link to="/orders">
              <Button color="secondary">Cancel</Button>
            </Link>
          </div>
          <div className={styles.input}>
            <Input
              id="name"
              label="Name"
              name="customerName"
              placeholder="Insert Name"
              required
            />
            <Select
              name="tableNumber"
              id="table"
              label="Table Number"
              options={tables}
            />
          </div>
        </div>
        <div>
          <div className={styles.header}>
            <h2 className={styles.title}>Current Order</h2>
          </div>
          {carts.length > 0 ? (
            <div className={styles.cart}>
              {carts.map((item: CartItem) => (
                <div className={styles.cartItem} key={item.id}>
                  <h4 className={styles.name}>{item.name}</h4>
                  <div className={styles.quantity}>
                    <Button
                      type="button"
                      onClick={() =>
                        handleAddToCart('decrement', item.id, item.name)
                      }
                      color="secondary"
                    >
                      -
                    </Button>
                    <div className={styles.number}>{item.quantity}</div>
                    <Button
                      type="button"
                      onClick={() =>
                        handleAddToCart('increment', item.id, item.name)
                      }
                      color="secondary"
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="submit">Order</Button>
            </div>
          ) : (
            <div className={styles.cart}>
              <h4>Cart is empty</h4>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;
