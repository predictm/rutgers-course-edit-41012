import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { ReactComponent as CloseIcon } from 'assets/icons/icon-close.svg';
import { ReactComponent as EditIcon } from 'assets/icons/icon-edit.svg';
import SimpleModal from 'Components/SimpleModal';
import FormInput from 'Components/FormInput';
import Button from 'Components/Button';
import { ConvertToNumber, formatCredit } from 'utils/helper';
import { calculateBreakEvenStudents, calculateBreakEvenValue } from 'utils/common';

const BeWidgetModal = ({
  open,
  onClose,
  inStateTuition,
  credits,
  setBreakEvenDetail,
  studentsCount,
}) => {
  const [editFringe, setEditFringe] = useState(false);
  const [formState, setFormState] = useState({
    fringe: 1.0765,
    inStateTuition: ConvertToNumber(inStateTuition),
    credits: ConvertToNumber(formatCredit(credits)),
    studentsCount: ConvertToNumber(studentsCount),
  });
  const [breakEven, setBreakEven] = useState('');

  const handleInputChange = field => e => {
    setFormState({
      ...formState,
      [field]: ConvertToNumber(e?.target?.value),
    });
  };

  const calculateBreakEven = () => {
    const calculatedBreakEven = calculateBreakEvenValue(formState);
    const calculateBreakEvenStudent = calculateBreakEvenStudents({...formState,breakEven:calculatedBreakEven})
    let level = 'N/A';
    let minNoOfStudent = 'N/A';
    if(calculateBreakEvenStudent === formState.studentsCount){
      level='Even';
    }else if(calculateBreakEvenStudent < formState.studentsCount){
      level='Above';
    }else if(calculateBreakEvenStudent > formState.studentsCount){
      level ='Below'
      minNoOfStudent =  calculateBreakEvenStudent - formState.studentsCount;
    }
    setBreakEven(calculatedBreakEven);
    setBreakEvenDetail({
      level,
      minNoOfStudent
    })
  };

  const handleEditClick = () => {
    setEditFringe(!editFringe);
  };

  return (
    <SimpleModal open={open} onClose={onClose}>
      <Grid
        sx={{
          backgroundColor: '#F5F5F5',
          borderRadius: '2rem',
          padding: '2rem',
        }}
      >
        <Grid
          container
          item
          xs="12"
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderBottom: '2px solid #C9C9C9' }}
        >
          <Grid item>
            <Typography
              variant="h2"
              sx={{
                color: '#383C49',
                fontSize: '2rem',
                fontWeight: '400',
              }}
            >
              Break-even Widget
            </Typography>
          </Grid>
          <Grid item>
            <CloseIcon
              onClick={onClose}
              style={{ width: '5rem', height: '5rem', cursor: 'pointer' }}
              data-testid="be-widget-modal-close"
            />
          </Grid>
        </Grid>
        <Grid
          item
          xs="12"
          justifyContent="space-between"
          alignItems="center"
          sx={{ margin: '2rem 0' }}
        >
          <Typography
            variant="subtitle"
            sx={{
              color: '#383C49',
              fontSize: '1rem',
              fontWeight: '400',
            }}
          >
            Formula: (#-of-Students x Credits x In-State Tuition) - (Salary x
            Fringe)
          </Typography>
        </Grid>
        <Grid
          xs="12"
          item
          container
          spacing={2}
          sx={{ marginBottom: '1.5rem' }}
        >
          <Grid xs="4" item>
            <FormInput
              placeholder="##"
              label="# of Students"
              value={ConvertToNumber(formState.studentsCount)}
              onChange={handleInputChange('studentsCount')}
              testId="be-widget-modal-students-count"
            />
          </Grid>
          <Grid xs="4" item>
            <FormInput
              placeholder="#"
              label="Credits"
              value={ConvertToNumber(formState.credits)}
              onChange={handleInputChange('credits')}
              testId="be-widget-modal-credits"
            />
          </Grid>
          <Grid xs="4" item>
            <FormInput
              placeholder="#"
              label="In State Tuition"
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              value={ConvertToNumber(formState.inStateTuition)}
              onChange={handleInputChange('inStateTuition')}
              testId="be-widget-modal-in-state-tuition"
            />
          </Grid>
        </Grid>
        <Grid
          xs="12"
          item
          container
          spacing={2}
          sx={{ marginBottom: '1.5rem' }}
        >
          <Grid xs="6" item>
            <FormInput
              placeholder=""
              label="Salary"
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              value={ConvertToNumber(formState.salary)}
              onChange={handleInputChange('salary')}
              testId="be-widget-modal-salary"
            />
          </Grid>
          <Grid xs="6" item>
            <FormInput
              placeholder="#"
              label="Fringe"
              defaultValue="1.0765"
              endAdornment={
                <InputAdornment
                  position="end"
                  sx={{ background: editFringe ? '#FFFFFF' : '#f5f5f5' }}
                >
                  {editFringe ? (
                    <CloseIcon
                      style={{
                        height: '2rem',
                        width: '2rem',
                        cursor: 'pointer',
                      }}
                      onClick={handleEditClick}
                      data-testid="be-widget-modal-fringe-clear-icon"
                    />
                  ) : (
                    <EditIcon
                      style={{
                        height: '2rem',
                        width: '2rem',
                        cursor: 'pointer',
                      }}
                      onClick={handleEditClick}
                      data-testid="be-widget-modal-fringe-edit-icon"
                    />
                  )}
                </InputAdornment>
              }
              value={ConvertToNumber(formState.fringe)}
              onChange={handleInputChange('fringe')}
              disabled={!editFringe}
              testId="be-widget-modal-fringe"
            />
          </Grid>
        </Grid>
        <Grid xs="12" item sx={{ marginBottom: '1.5rem' }}>
          <Typography
            variant="subtitle"
            component="span"
            sx={{
              color: '#383C49',
              fontSize: '1rem',
              fontWeight: '400',
            }}
          >
            Break-even:&nbsp;
          </Typography>
          <Typography
            variant="subtitle"
            component="span"
            sx={{
              color: '#383C49',
              fontSize: '2rem',
              fontWeight: '400',
            }}
            testId="be-widget-modal-break-even-value"
          >
            $:{breakEven || '- -'}
          </Typography>
        </Grid>
        <Grid xs="12" item sx={{ marginBottom: '1.5rem' }}>
          <Button
            className="black-btn full-width"
            label="Calculate"
            onClick={calculateBreakEven}
            testId="be-widget-modal-calculate-btn"
          />
        </Grid>
      </Grid>
    </SimpleModal>
  );
};

export default BeWidgetModal;
