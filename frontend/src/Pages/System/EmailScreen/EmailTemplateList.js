import React, { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { useEmailScreenQueries } from 'services/queries';

import SearchButton from 'StyledComponents/SearchButton';
import SearchSelect from 'StyledComponents/SearchSelect';
import StyledTableCell from 'StyledComponents/StyledTableCell';
import StyledTableRow from 'StyledComponents/StyledTableRow';
import SwitchInput from 'Components/SwitchInput';
import TemplateTypeTableRow from './TemplateTypeTableRow';
import useForm from 'hooks/Form';

const columns = [
  {
    width: '35%',
    label: 'Type',
    dataKey: 'type',
    renderColumn: (rowData, rowProps) => {
      return (
        <>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.25rem',
              color: '#333333',
              fontWeight: '400',
              margin: '0',
            }}
            data-testid={`${rowProps?.testId}-email-type`}
          >
            {rowData?.email_type}
          </Typography>
        </>
      );
    },
  },
  {
    width: '35%',
    label: 'Subject',
    dataKey: 'subject',
    renderColumn: (rowData, rowProps) => {
      return (
        <>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.25rem',
              color: '#333333',
              fontWeight: '400',
              margin: '0',
            }}
            data-testid={`${rowProps?.testId}-subject`}
          >
            {rowData?.subject}
          </Typography>
        </>
      );
    },
  },
  {
    width: '20%',
    label: 'Status',
    dataKey: 'is_active',
    renderColumn: (rowData, rowProps) => {
      return (
        <div style={{ width: '100%' }}>
          <SwitchInput
            label={rowData?.is_active ? 'Active' : 'Inactive'}
            checked={rowData?.is_active}
            controlSx={{ marginRight: 0, color: '#666666' }}
            onChange={rowProps?.onToggleStatus}
            testId={`${rowProps?.testId}-toggle-active`}
          />
        </div>
      );
    },
  },
];

const EmailTemplateList = () => {
  const [rows, setRows] = useState([]);
  const { data: emailTemplateList, refetch: refetchEmailTemplateList } =
    useEmailScreenQueries.useGetEmailTemplateListQuery({ enabled: true });

  useEffect(() => {
    setRows(emailTemplateList?.data?.results);
  }, [emailTemplateList]);

  const typeList = rows?.map(row => ({
    value: row?.email_type,
    label: row?.email_type,
  }));

  const handleDropdownChange = field => e => {
    handleOnChange(field, e?.target?.value);
  };

  const stateSchema = useMemo(() => {
    return {
      type: {
        value: '',
        error: '',
      },
    };
  }, []);

  const validationStateSchema = {
    type: {
      required: false,
    },
  };

  const { state, handleOnChange, setState } = useForm(
    stateSchema,
    validationStateSchema
  );

  useEffect(() => {
    setState(stateSchema);
  }, [setState, stateSchema]);

  const fixedHeaderContent = () => {
    return (
      <StyledTableRow>
        {columns.map(column => {
          return (
            <StyledTableCell
              key={column.dataKey}
              variant="head"
              align="left"
              sx={{
                width: column.width,
                backgroundColor: 'background.paper',
              }}
            >
              {column.label}
            </StyledTableCell>
          );
        })}
        <StyledTableCell
          variant="head"
          align="center"
          sx={{
            backgroundColor: 'background.paper',
          }}
        >
          Action
        </StyledTableCell>
      </StyledTableRow>
    );
  };

  const handleSearch = () => {
    const filteredData = rows.filter(row => {
      return row?.email_type
        ?.toLowerCase()
        .includes(state?.type?.value.toLowerCase());
    });
    setRows(filteredData);
  };

  return (
    <Box sx={{ padding: '2rem 0' }}>
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '2rem',
          padding: '2rem 0',
          position: 'relative',
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          columns={18}
          sx={{
            borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
            padding: '0 2rem 2rem',
          }}
        >
          <Grid item xs={16}>
            <SearchSelect
              label="Type"
              options={typeList}
              placeholder="--Select --"
              value={state?.type?.value || ''}
              onChange={handleDropdownChange('type')}
              testId="email-template-type"
            />
          </Grid>

          <Grid item xs="auto">
            <SearchButton
              startIcon={<SearchOutlinedIcon />}
              className="black-btn"
              sx={{
                '&.black-btn:hover': {
                  backgroundColor: '#0071E3',
                  border: 'none',
                },
              }}
              onClick={handleSearch}
              testId="email-template-search-btn"
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            backgroundColor: '#f5f5f5',
            borderRadius: '1rem',
            padding: '2rem 1rem',
            margin: '2rem 2rem 0',
            position: 'relative',
          }}
        >
          <TableContainer sx={{ width: '100%' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>{fixedHeaderContent()}</TableHead>
              <TableBody>
                {rows &&
                  rows?.map((row, index) => (
                    <TemplateTypeTableRow
                      key={row?.id}
                      columns={columns}
                      row={row}
                      refetchEmailTemplateList={refetchEmailTemplateList}
                      testId={`email-template-type-row-${index}`}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailTemplateList;
