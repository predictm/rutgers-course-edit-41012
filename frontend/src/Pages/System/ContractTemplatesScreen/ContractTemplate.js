import { Box, Grid, Typography } from '@mui/material';
import React, { useMemo, useState, useEffect } from 'react';
import StyledTabs from 'StyledComponents/StyledTabs';
import StyledTab from 'StyledComponents/StyledTab';
import HorizontalDivider from 'Components/HorizontalDivider';
import ContractTemplateEditor from './ContractTemplateEditor';
import { ReactComponent as ResetIcon } from 'assets/icons/icon-reset.svg';
import Button from 'Components/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useContractMutation } from 'services/mutations';
import { toast } from 'react-toastify';

const ContractTemplate = ({refetchContract, contractInfoArray}) => {
  const updateResetContract =
    useContractMutation?.useUpdateResetContractMutation();


  const [selectedTab, setSelectedTab] = useState(0);
  const [loading,setLoading] = useState(false)

  const contractTabArray = []

    contractInfoArray.map((contractInfo)=>{
      if(contractInfo.template_type == 'UNION_CONTRACT')
      {
        contractTabArray[0]=contractInfo
      }else if(contractInfo.template_type == 'NON_UNION_CONTRACT')
      {
        contractTabArray[1]=contractInfo
      }else if(contractInfo.template_type == 'ON_LOAD_CONTRACT')
      {
        contractTabArray[2]=contractInfo
      }
    })
   
  

  const handleTabChange = (e, tabIndex) => {
    setSelectedTab(tabIndex);
  };

  const contractTokens = [
    
    {
      token: 'current_date',
      label: 'Today date',
    },
    {
      token: 'first_name',
      label: 'Instructor: First Name',
    },
    {
      token: 'address1',
      label: 'Instructor: Address 1',
    },
    {
      token: 'last_name',
      label: 'Instructor: Last Name',
    },
    {
      token: 'address2',
      label: 'Instructor: Address 2',
    },
    
    {
      token: 'city',
      label: 'Instructor: city',
    },
    {
      token: 'term_desc',
      label: 'Term',
    },
    {
      token: 'state',
      label: 'Instructor: state',
    },
    {
      token: 'semester_year',
      label: 'Semester and Year',
    },
    {
      token: 'zip',
      label: 'Instructor: zip',
    },
    {
      token:'contact_hrs',
      label:'Contact Hours'
    },
    {
      token: 'offering_unit_name',
      label: 'Offering Unit Name',
      category: 'onLoad',
    },
    {
      token: 'special_contract_text',
      label: 'Special Contract Text',
      category: 'onLoad',
    },
    {
      token: 'course_title',
      label: 'Course Title',
    },
    // {
    //   token: 'session_dates',
    //   label: 'Session Dates',
    // },
    {
        token: 'course_start_date',
        label: 'Course Start Date',
      },
      {
        token: 'course_end_date',
        label: 'Course End Date',
      },
    {
      token: 'course#',
      label: 'Course Number',
    },
    {
      token:'credit',
      label:'Credit'
    },
    {
      token:'sub_title',
      label:'Sub Title'
    },
    {
      token: 'average_weekly_hour',
      label: 'Average Hours Per Week',
    },
    {
      token: 'approved_salary',
      label: 'Salary',
    },
    {
      token: 'job_class_code',
      label: 'Job Class',
    },
    {
      token:'dept#',
      label:'Department Number'
    },
    {
      token: 'dept_name',
      label: 'Department',
    },
    {
      token: 'dept_name_heading',
      label: 'Department',
    },
    {
      token:'index#',
      label:'Index'
    },
    {
      token:'sch#',
      label:'Sch#'
    },
    {
      token:'section#',
      label:'Section'
    },
    {
      token: 'total_salary',
      label: 'Total Salary',
    },
    // {
    //   token: 'footer_note',
    //   label: 'FooterNote',
    // },
  ];

  const handleReset =async ()=>{
    setLoading(true)
    const payload = {
      contract_id: contractTabArray[selectedTab].id
    };
    console.log(payload)
    try {
      await updateResetContract.mutateAsync(payload);
      setTimeout(() => refetchContract?.(), 500);
        toast.success(
            `Contract updated to default template.`,{
              hideProgressBar: true,
            }
        );
      
    } catch (error) {
      toast.error(
        `Contract updated failed.`,{
          hideProgressBar: true,
        }
    );
    }finally {
      setLoading(false)
    }
  }



  return (
    <div className="courses-list-form">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          padding: '0 1.5rem',
        }}
      >
        <StyledTabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{ width: 'fit-content' }}
        >
          <StyledTab label="Union" data-testid="tab-union" 
           />
          <StyledTab label="Non-union" data-testid="tab-non-union" />
          <StyledTab label="On-load" data-testid="tab-on-load"  />
        </StyledTabs>
      </Box>
      <div
        style={{ padding: '2rem' }}
        id={`contract-template-${selectedTab}-editor`}
      >
        <Typography
          variant="h6"
          paragraph
          sx={{ color: '#383C49', fontSize: '2rem', fontWeight: '400' }}
          data-testid="contract-template-section-1"
        >
          Variable Tokens
        </Typography>
        <Box
          sx={{
            padding: '1rem',
            bgcolor: '#f5f5f5',
            borderRadius: '10px',
            height: '245px',
            overflow: 'scroll',
          }}
        >
          
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {contractTokens.map((tokenData,index) => {
              return (
                  <Grid item xs={6} key={`tokenData-${index}`} data-testid={`tokenData-${index}`}>
                    <Box
                      sx={{
                        bgcolor: '#ffffff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.5rem',
                      }}
                    >
                      <Typography
                        component="div"
                        sx={{
                          fontWeight: '700',
                          color: '#707070',
                          fontSize: '1rem',
                        }}
                      >
                        &#123;{tokenData.token}&#125;
                      </Typography>
                      <Typography
                        component="div"
                        sx={{
                          color: '#707070',
                          fontSize: '1rem',
                        }}
                      >
                        {tokenData.label}
                      </Typography>
                    </Box>
                  </Grid>
              );
            })}
          </Grid>
          
        </Box>
        <Grid item xs={12}>
          <HorizontalDivider
            color="#C9C9C9"
            sx={{
              margin: '2.5rem 0',
            }}
          />
        </Grid>

        <Box sx={{display:'flex',justifyContent: 'space-between'}}>
        <Typography
          variant="h6"
          paragraph
          sx={{ color: '#383C49', fontSize: '1.5rem', fontWeight: '400' }}
          data-testid="contract-template-section-2"
        >
          Template <span style={{ color: '#d32f2f' }}>&nbsp;*</span>
        </Typography>

        {!loading?
        <Box sx={{height:'20px',width:'20px'}}><ResetIcon className="reset-icon" style={{cursor:'pointer'}} 
        onClick={handleReset} 
         /></Box>
         : null}


        </Box>
        


          <Box
            sx={{
              padding: '1.5rem 1rem',
              bgcolor: '#f5f5f5',
              borderRadius: '40px',
              
              overflow: 'scroll',
            }}
          >
            <ContractTemplateEditor refetchContract={refetchContract} contractInfo={contractTabArray[selectedTab]} />
          </Box>
        
      </div>
    </div>
  );
};

export default ContractTemplate;
