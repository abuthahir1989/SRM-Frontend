import React, { lazy, Suspense, useEffect, useState } from "react";
import PageHeading from "../../components/PageHeading";
import Loading from "react-loading";
import { colorSecondary, url } from "../../assets/constants";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { useUserContext } from "../../contexts/UserContext";
import { handleError } from "../../assets/helperFunctions";
import TableButtons from "../../components/TableButtons";
import Grid from "../../components/Grid";
const AddEditModal = lazy(() => import("./AddEditOrder"));

type Props = {};

const Order: React.FC<Props> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [data, setData] = useState([]);
  const columnHelper = createColumnHelper<any>();
  const { user } = useUserContext();

  const columns = [
    columnHelper.accessor("id", {
      header: "Order No.",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => {     
        return new Date(info.getValue()).toLocaleDateString();
      },
    }),
    columnHelper.accessor("contact", {
      header: "Contact",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("remarks", {
      header: "Remarks",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("quantity", {
      header: "Quantity",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("user", {
      header: "Created By",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("actions", {
      header: "Actions",
      cell: (info) => {
        return (
          <TableButtons
            edit
            editFunction={() => {
              setEditId(info.row.original.id);
              setShowModal(true);
            }}
          />
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
  });

  const getOrders = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`${url}orders`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const { orders } = resp.data;
      setData(orders);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      <PageHeading
        title="Orders"
        firstButtonText="Add Order"
        firstButtonFunction={() => setShowModal(true)}
        firstButtonIcon="plus"
        loading={loading}
      />
      {data.length > 0 && (
        <Grid
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          table={table}
          tableData={data}
          reportName="Orders"
          excludeSortingColumns={["actions"]}
        />
      )}
      <Suspense
        fallback={
          <div style={{ width: "100%", height: "100%", marginInline: "auto" }}>
            <Loading color={colorSecondary} type="bars" />
          </div>
        }
      >
        <AddEditModal
          show={showModal}
          setShow={setShowModal}
          editId={editId}
          setEditId={setEditId}
          onSave={getOrders}
        />
      </Suspense>
    </>
  );
};

export default Order;
