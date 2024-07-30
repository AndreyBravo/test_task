import React, { useState, useEffect } from 'react';

interface Cells {
  [order: string]: {
    [process: string]: boolean;
  };
}

const generateProcesses = async (): Promise<string[]> => {
  const count = Math.floor(Math.random() * (100 - 2 + 1)) + 2;
  return new Promise(resolve => {
    setTimeout(() => {
      const processes = Array.from({ length: count }, (_, i) => `Обработка${i + 1}`);
      resolve(processes);
    }, 1500);
  });
};

const generateOrders = async (processes: string[]): Promise<Cells> => {
  const count = Math.floor(Math.random() * (100 - 2 + 1)) + 2;
  return new Promise(resolve => {
    setTimeout(() => {
      const cells: Cells = {};
      for (let i = 0; i < count; i++) {
        const order = `Заказ${i + 1}`;
        cells[order] = processes.reduce((acc, process) => {
          acc[process] = Math.random() < 0.5;
          return acc;
        }, {} as { [key: string]: boolean });
      }
      resolve(cells);
    }, 1500);
  });
};

const MTable: React.FC = () => {
  const [orders, setOrders] = useState<string[]>([]);
  const [processes, setProcesses] = useState<string[]>([]);
  const [cells, setCells] = useState<Cells>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [orderToRemove, setOrderToRemove] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const newProcesses = await generateProcesses();
      const newCells = await generateOrders(newProcesses);
      setProcesses(newProcesses);
      setCells(newCells);
      setOrders(Object.keys(newCells));
      setLoading(false);
    };
    fetchData();
  }, []);

  const toggleCell = (order: string, process: string) => {
    setCells(prevCells => ({
      ...prevCells,
      [order]: {
        ...prevCells[order],
        [process]: !prevCells[order][process]
      }
    }));
  };

  const addOrder = () => {
    const newOrder = `Заказ${orders.length + 1}`;
    setOrders([...orders, newOrder]);
    setCells(prevCells => ({
      ...prevCells,
      [newOrder]: processes.reduce((acc, process) => ({ ...acc, [process]: false }), {} as { [key: string]: boolean })
    }));
  };

//   const addProcess = () => {
//     const newProcess = `Обработка${processes.length + 1}`;
//     setProcesses([...processes, newProcess]);
//     setCells(prevCells => {
//       const updatedCells = { ...prevCells };
//       orders.forEach(order => {
//         updatedCells[order][newProcess] = false;
//       });
//       return updatedCells;
//     });
//   };

  const editOrder = (order: string) => {
    // Implement edit logic here
  };

  const confirmRemoveOrder = (order: string) => {
    setOrderToRemove(order);
    setShowModal(true);
  };

  const removeOrder = () => {
    if (orderToRemove) {
      setOrders(orders.filter(order => order !== orderToRemove));
      const newCells = { ...cells };
      delete newCells[orderToRemove];
      setCells(newCells);
    }
    setShowModal(false);
    setOrderToRemove(null);
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <button onClick={addOrder}>Добавить Заказ</button>
          {/* <button onClick={addProcess}>Добавить Обработку</button> */}
          <table>
            <thead>
              <tr>
                <th></th>
                {processes.map(process => (
                  <th key={process}>{process}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order}>
                  <td>{order}</td>
                  {processes.map(process => (
                    <td
                      key={process}
                      onClick={() => toggleCell(order, process)}
                      style={{ backgroundColor: cells[order][process] ? 'green' : 'red' }}
                    ></td>
                  ))}
                  <td>
                    <button onClick={() => editOrder(order)}>Edit</button>
                    <button onClick={() => confirmRemoveOrder(order)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </>
      )}

      {showModal && (
        <div className="modal">
          <p>Вы уверены, что хотите удалить {orderToRemove}?</p>
          <button onClick={removeOrder}>Да</button>
          <button onClick={() => setShowModal(false)}>Нет</button>
        </div>
      )}
    </div>
  );
};

export default MTable;
