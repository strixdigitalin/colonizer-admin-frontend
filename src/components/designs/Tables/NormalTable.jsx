import { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button, ListItemIcon, MenuItem } from '@mui/material';
import { checkDateType, checkHTMLType, checkImageType } from '../../../utils/Global/main';
import { ExportToCsv } from 'export-to-csv';
import { FileDownload } from '@mui/icons-material';

const NormalTable = ({ data, tableStructure, isLoading, options=[] }) => {

    const columns = useMemo(() => tableStructure.map((element) =>
        checkHTMLType(element.accessKey) ?
            {
                header: element.header,
                accessorKey: element.accessKey,
                Cell: ({ renderedCellValue }) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        {
                            renderedCellValue ?
                                <div dangerouslySetInnerHTML={{ __html: renderedCellValue }}></div>
                                :
                                'N/A'
                        }
                    </Box>
                )
            }
            :
            checkDateType(element.accessKey) ?
                {
                    header: element.header,
                    accessorKey: element.accessKey,
                    Cell: ({ renderedCellValue }) => (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
                            {
                                renderedCellValue ?
                                    new Date(renderedCellValue).toDateString()
                                    :
                                    'N/A'
                            }
                        </Box>
                    )
                }
                :
                !checkImageType(element.accessKey) ?
                    {
                        header: element.header,
                        accessorKey: element.accessKey,
                        Cell: ({ renderedCellValue }) => (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <div className='max-w-xs'>
                                    {
                                        renderedCellValue ?
                                            renderedCellValue
                                            :
                                            'N/A'
                                    }
                                </div>
                            </Box>
                        )
                    }
                    :
                    {
                        header: element.header,
                        accessorKey: element.accessKey,
                        Cell: ({ renderedCellValue }) => (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                }}
                            >
                                {
                                    renderedCellValue ?
                                        <img src={renderedCellValue} alt='banner' className='w-32 h-20 rounded-lg object-cover' />
                                        :
                                        <div className='w-32 h-20 rounded-lg bg-gray-400 flex items-center justify-center text-sm'>No Image</div>
                                }
                            </Box>
                        )
                    }
    ), [tableStructure]);

    const csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: columns.map((c) => c.header),
    };

    const csvExporter = new ExportToCsv(csvOptions);

    const handleExportRows = (rows) => {
        csvExporter.generateCsv(rows.map((row) => row.original));
    };

    const handleExportData = () => {
        csvExporter.generateCsv(data);
    };

    return (
        <div className=' rounded-lg'>
            <MaterialReactTable
                columns={columns}
                data={data}
                enableColumnOrdering
                enableGlobalFilter={true}
                enableRowActions={options.length>0 ? true : false}
                state={{
                    isLoading
                }}
                // renderTopToolbarCustomActions={({ table }) => (
                //     <Box
                //         sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                //     >
                //         <Button
                //             disabled={table.getPrePaginationRowModel().rows.length === 0}
                //             onClick={() =>
                //                 handleExportRows(table.getPrePaginationRowModel().rows)
                //             }
                //             startIcon={<FileDownload />}
                //             variant="contained"
                //         >
                //             Export All
                //         </Button>
                //         <Button
                //             disabled={table.getRowModel().rows.length === 0}
                //             onClick={() => handleExportRows(table.getRowModel().rows)}
                //             startIcon={<FileDownload />}
                //             variant="contained"
                //         >
                //             Export Page
                //         </Button>
                //     </Box>
                // )}
                renderRowActionMenuItems={({ closeMenu, row }) =>
                    options?.map((item, index) =>
                        <MenuItem
                            key={index}
                            onClick={() => {
                                item.handleClick(row?.original)
                                closeMenu();
                            }}
                            sx={{ m: 0 }}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            {item.name}
                        </MenuItem>
                    )
                }
            />
        </div>
    )
}

export default NormalTable