import { useEffect, useState } from 'react';
import styles from './Orders.module.css';
import { Link } from 'react-router-dom';
import { deleteOrder, getOrders, updateOrder } from '../../../services/order.service';
import Button from '../../ui/Button';

type OrderStatus = 'PROCESSING' | 'COMPLETED' | string;

interface Order {
  id: string;
  customer_name: string;
  table_number: string | number;
  total: number;
  status: OrderStatus;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [refetchOrder, setRefetchOrder] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    if (refetchOrder) {
      const fetchOrders = async () => {
        const result = await getOrders();
        setOrders(result.data);
      };
      fetchOrders();
      setRefetchOrder(false);
    }
  }, [refetchOrder]);

  const handleCompleteOrder = async (id: string) => {
    await updateOrder(id, { status: 'COMPLETED' }).then(() => {
      setRefetchOrder(true);
    });
  };

  const handleDeleteOrder = async (id: string) => {
    await deleteOrder(id).then(() => {
      setRefetchOrder(true);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    window.location.href = '/login';
  };

  const getStatusBadgeClass = (status: OrderStatus): string => {
    switch (status) {
      case 'PROCESSING':
        return 'badgeProcessing';
      case 'COMPLETED':
        return 'badgeCompleted';
      default:
        return 'badgeDefault';
    }
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle previous and next page buttons
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getPaginationNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
  
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
  
    return pages;
  };  

  return (
    <main className={styles.ordersContainer}>
      <section className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Order List</h1>
          <p className={styles.subtitle}>Manage your restaurant orders</p>
        </div>
        <div className={styles.buttonGroup}>
          <Link to="/create">
            <Button color="primary">Create Order</Button>
          </Link>
          <Button color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </section>

      <section className={styles.tableContainer}>
        {currentOrders.length > 0 ? (
          <div className={styles.tableResponsive}>
            <table className={styles.ordersTable}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Customer Name</th>
                  <th>Table</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order: Order, index: number) => (
                  <tr key={order.id}>
                    <td>{index + 1 + indexOfFirstOrder}</td>
                    <td className={styles.customerName}>{order.customer_name}</td>
                    <td>Table #{order.table_number}</td>
                    <td className={styles.orderTotal}>${order.total}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[getStatusBadgeClass(order.status)]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className={styles.actionButtons}>
                      <Link to={`/orders/${order.id}`}>
                        <Button color="secondary">Detail</Button>
                      </Link>
                      {order.status === 'PROCESSING' && (
                        <Button
                          onClick={() => handleCompleteOrder(order.id)}
                          color="success"
                        >
                          Complete
                        </Button>
                      )}
                      {order.status === 'COMPLETED' && (
                        <Button
                          onClick={() => handleDeleteOrder(order.id)}
                          color="danger"
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.noOrders}>
            <p>No orders found. Create a new order to get started.</p>
          </div>
        )}

        {/* Pagination Controls with Ellipsis */}
        <div className={styles.pagination}>
          <Button
            color="secondary"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            {'<'}
          </Button>

          {getPaginationNumbers().map((number, index) =>
            number === '...' ? (
              <span key={index} className={styles.ellipsis}>...</span>
            ) : (
              <Button
                key={number}
                color={currentPage === number ? 'primary' : 'secondary'}
                onClick={() => paginate(number as number)}
              >
                {number}
              </Button>
            )
          )}

          <Button
            color="secondary"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            {'>'}
          </Button>
        </div>

      </section>
    </main>
  );
};

export default Orders;
