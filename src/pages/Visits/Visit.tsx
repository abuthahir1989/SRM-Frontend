import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useUserContext } from "../../contexts/UserContext";
import TableButtons from "../../components/TableButtons";
import axios from "axios";
import { colorSecondary, url } from "../../assets/constants";
import { handleError } from "../../assets/helperFunctions";
import PageHeading from "../../components/PageHeading";
import Grid from "../../components/Grid";
import Loading from "react-loading";
// import AddEditVisit from "./AddEditVisit";
const AddEditVisit = lazy(() => import("./AddEditVisit"));

type Props = {};

const Visit: React.FC<Props> = ({}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [data, setData] = useState([]);
  const columnHelper = createColumnHelper<any>();
  const [loading, setLoading] = useState(false);
  const { user } = useUserContext();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(0);

  const columns = [
    columnHelper.accessor("id", {
      header: "Id",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("contact", {
      header: "Contact",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("purpose", {
      header: "Purpose",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("response", {
      header: "Response",
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

  const getVisits = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`${url}visits`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setData(resp.data.visits);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVisits();
  }, []);

  return (
    <>
      <PageHeading
        title="Visit"
        firstButtonText="Add Visit"
        firstButtonIcon="plus"
        firstButtonFunction={() => setShowModal(true)}
        loading={loading}
      />
      {data.length > 0 && (
        <Grid
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          table={table}
          tableData={data}
          reportName="Contacts"
          excludeSortingColumns={["actions"]}
        />
      )}
      <Suspense
        fallback={
          <div style={{ marginInline: "auto" }}>
            <Loading color={colorSecondary} type="bars" />
          </div>
        }
      >
        <AddEditVisit
          show={showModal}
          setShow={setShowModal}
          editId={editId}
          setEditId={setEditId}
          onSave={getVisits}
        />
      </Suspense>
    </>
  );
};

export default Visit;
