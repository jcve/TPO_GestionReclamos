import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';

const useStyles = makeStyles(theme => ({
    table: {
        marginTop: theme.spacing(1),
        '& thead th': {
            fontWeight: '600',
            color: '#3445db',
            backgroundColor: '#ddf0fd',
        },
        '& body tbody td': {
            fontWeight: '300',
        },
        '& tbody tr:hover': {
            backgroundColor: '#fefbed',
            cursor: 'pointer',
        },
    }
}));
export default function useTable(reclamos, cabeceras, filterFunct) {
    const pages = [5, 10, 15, 30];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
    const [order, setOrder] = useState();
    const [orderBy, setOrderBy] = useState();

    const classNewStyle = useStyles();
    const TblContainer = props => (
        <Table className={classNewStyle.table}>  {props.children}  </Table>
    )
    const TblHeader = props => {
        const handleSortRequest = cellId => {
            const isAsc = orderBy === cellId && order === "asc";
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(cellId);
        }

        return (
            <TableHead>
                <TableRow>
                    {
                        cabeceras.map(itemCabecera => (
                            <TableCell key={itemCabecera.id}
                                sortDirection={orderBy === itemCabecera.id ? order : false}>
                                {itemCabecera.disableSorting ? itemCabecera.label :
                                    <TableSortLabel
                                        active={orderBy === itemCabecera.id}
                                        direction={orderBy === itemCabecera.id ? order : 'asc'}
                                        onClick={() => { handleSortRequest(itemCabecera.id) }}>
                                        {itemCabecera.label}
                                    </TableSortLabel>
                                }
                            </TableCell>)
                        )
                    }
                </TableRow>
            </TableHead>
        )

    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    }
    const TblPagination = () => (
        <TablePagination
            component="div"
            page={page}
            rowsPerPageOptions={pages}
            rowsPerPage={rowsPerPage}
            count={reclamos.length}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            labelRowsPerPage={"Reclamos por página:"}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    )
    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1]-b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }
    function getComparator(order, orderBy) {
        return order === 'desc' ? (a, b) => descending(a, b, orderBy) : (a, b) => -descending(a, b, orderBy);
    }
    function descending(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;

        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }
    const reclamosFiltrados = () => {
        return stableSort(filterFunct.fn(reclamos), getComparator(order, orderBy)).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    }
    return {
        TblContainer,
        TblHeader,
        TblPagination,
        reclamosFiltrados

    }
}