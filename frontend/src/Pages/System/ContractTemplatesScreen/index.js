
import { Typography } from '@mui/material'
import React from 'react'
import ContractTemplate from './ContractTemplate';
import { useContractQueries } from 'services/queries';


const ContractTemplatesScreen = () => {

  const { data: contractData, refetch } =
  useContractQueries.useGetContractTemplatesQuery({
    payload: {},
    enabled: true,
  });

  return (
    <div className='user-container'> 
    
        <Typography
        variant='h4'
        paragraph
        sx={{fontWeight: '300', color: '#333333', fontSize:'3.25rem'}}
        data-testid="comtract-template-page-header"
        >
          Contract Templates
        </Typography>
        {contractData?
        <ContractTemplate
        refetchContract = {refetch}
        contractInfoArray = {contractData?.data.results}
         />
        :'Loading..'}
    </div>
  );
};

export default ContractTemplatesScreen;