import React, { useState } from 'react';
import Collapse from '@mui/material/Collapse';

import { ReactComponent as ExpandIcon } from 'assets/icons/icon-arrow-circle-color.svg';
import { ReactComponent as CollapseIcon } from 'assets/icons/icon-arrow-circle-up.svg';
import StyledTableCell from 'StyledComponents/StyledTableCell';
import StyledTableRow from 'StyledComponents/StyledTableRow';
import UpdateForm from './UpdateForm';
import { toast } from 'react-toastify';
import { useEmailTemplateMutations } from 'services/mutations';

const TemplateTypeTableRow = ({
  row,
  columns,
  refetchEmailTemplateList,
  testId,
}) => {
  const [open, setOpen] = useState(false);

  const updateEmailTemplateMutation =
    useEmailTemplateMutations.useUpdateEmailTemplateMutation();

  const toggleRow = () => setOpen(!open);

  const handleToggleStatus = async () => {
    const payload = {
      is_active: !row?.is_active,
    };
    try {
      const response = await updateEmailTemplateMutation.mutateAsync({
        id: row?.id,
        ...payload,
      });
      toast.success(
        `Email Template ${row?.is_active ? 'inactive' : 'active'}  successfully`,{
          hideProgressBar: true,
        }
      );
      refetchEmailTemplateList?.();
    } catch (error) {
      const errors = error?.response?.data?.errors;

      toast.error(
        `An error occurred while Toggling Email Template. Please try again later.`,{
          hideProgressBar: true,
        }
      );
    } finally {
    }
  };

  return (
    <>
      <StyledTableRow hover open={open}>
        {columns.map(column => (
          <StyledTableCell key={column.dataKey} align="left">
            {column.renderColumn(row, {
              onToggleStatus: handleToggleStatus,
              testId,
            })}
          </StyledTableCell>
        ))}
        <StyledTableCell align="center">
          {open ? (
            <CollapseIcon
              style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
              onClick={toggleRow}
              data-testid={`${testId}-collapse-row`}
            />
          ) : (
            <ExpandIcon
              style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
              onClick={toggleRow}
              data-testid={`${testId}-expand-row`}
            />
          )}
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow
        sx={{ border: 0 }}
        data-testid={`${testId}-collapsed-row-data`}
      >
        <StyledTableCell sx={{ padding: 0 }} colSpan={columns?.length + 1}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            sx={{ background: 'white' }}
          >
            <UpdateForm
              emailTemplate={row}
              refetchEmailTemplateList={refetchEmailTemplateList}
              testId={`${testId}-form`}
            />
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};

export default TemplateTypeTableRow;
