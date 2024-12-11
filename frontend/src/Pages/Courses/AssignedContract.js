import React, { useEffect, useState, useMemo } from 'react';
import SimpleModal from 'Components/SimpleModal';
import { useContractQueries } from 'services/queries';
import parse from 'html-react-parser';
import Grid from '@mui/material/Grid';
import moment from 'moment-timezone';
import HorizontalDivider from 'Components/HorizontalDivider';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormInput from 'Components/FormInput';
import LightTooltip from 'StyledComponents/LightTooltip';
import Stack from '@mui/material/Stack';
import { ReactComponent as InfoIcon } from 'assets/icons/icon-info.svg';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormRadio from 'Components/FormRadio';
import useForm from 'hooks/Form';
import Button from 'Components/Button';
import { renderToString } from 'react-dom/server';
import { useInstructorMutation } from 'services/mutations';
import { toast } from 'react-toastify';
import { useCoursesQueries } from 'services/queries';
import Handlebars from 'handlebars';
import { formatDateTime } from 'utils/helper';
import { ReactComponent as CloseIcon } from 'assets/icons/icon-close.svg';
import {termListDropdown } from './AssignedInstructor'

const AssignedContract = ({
  open,
  onClose,
  appointmentInfo,
  refetchCourseDetails,
  term,
  year,
  stateListMapper,
  jobClassCodeMapper,
  offeringUnit
}) => {

  const { data: contractData, refetch, remove, error } =
    useContractQueries.useGetInstructorContract({
      payload: { id: appointmentInfo.instructor_info.id },
      enabled: true,
    });

  // const apiData =
  //    useContractQueries.useGetInstructorContract({
  //     payload: { id: appointmentInfo.instructor_info.id },
  //     enabled: true,
  //   });


  // console.log("api ",apiData)

  // let contractData=''

    
    // const { data: stateListData } = useCoursesQueries.useStateListQuery({
    //   enabled: true,
    // });
  
    // const stateList = stateListData?.data?.results?.map(item => ({
    //   value: item?.id,
    //   label: item?.name,
    // }));

  const [beErrors, setBeErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewContract, setPreviewContract] = useState();
  const [contractAppointmentData, setContractAppointmentData] = useState([]);
  const [
    rerenderBycontractAppointmentData,
    setRerenderBycontractAppointmentData,
  ] = useState(false);
  const [totalSalary, setTotalSalary] = useState(0);
  // const [stateListMapper, setStateListMapper] = useState({})

  const updateInstructorContractSFS =
    useInstructorMutation.useUpdateInstructorContractSFS();
  const updateContractStatusSFS =
    useInstructorMutation.useUpdateContractStatusSFS();

  
  const contractTemplate = contractData?.data.contract_template.content;
 
  const isRevised = contractData?.data?.is_revised_contract;
  // const isRevised = false;
  useEffect(() => {
    console.log('contract data', contractData,appointmentInfo);
  }, [contractData]);

  useEffect(() => {
    const appointments = contractData?.data?.appointments || [];
    const map = new Map();
    for(let index in appointments){
      const offering_unit_cd = appointments[index].course_section_details.offering_unit;
      if(map.has(offering_unit_cd)){
        const appointmentList = map.get(offering_unit_cd);
        appointmentList.push(appointments[index])
        map.set(offering_unit_cd,appointmentList)
      }else{
        map.set(offering_unit_cd,[appointments[index]])
      }
    }

    const sortedAppointments = [];
    map.forEach((values,key)=>{
      const schoolTotalSalary = values
      .map(data => parseInt(data.approved_salary) || 0)
      .reduce((initial,next)=> initial+next,0);      
      const list = [...values];
      list[list.length-1]['schoolTotalSalary'] = schoolTotalSalary;
      sortedAppointments.push(...list)
    })

    setContractAppointmentData(sortedAppointments);
  }, [contractData]);

  useEffect(() => {
    console.log('app info', contractAppointmentData);
  }, [contractAppointmentData]);

  useEffect(()=>{
    return () => remove(); 
  },[])


 

   const  termListMapper = termListDropdown?.reduce((acc,obj)=>{
    acc[obj.value]=obj.label;

    return  acc;
   },{})
  

  const tokensListArray = [
      {
        identifier: 'background-color: rgb(240, 251, 255)',
        substitute: '',
      },
      {
        identifier: '{current_date}',
        substitute: moment(appointmentInfo?.contract_details?.date_send_for_signature || new Date()).format('MMMM DD, YYYY'),
        // substitute: appointmentInfo?.contract_details?.date_send_for_signature,
      },
      {
        identifier: '{first_name}',
        substitute: appointmentInfo.instructor_info.first_name,
      },
      {
        identifier: '{last_name}',
        substitute: appointmentInfo.instructor_info.last_name,
      },

      {
        identifier: '{address1}',
        substitute: appointmentInfo.instructor_info.address1,
      },
      {
        identifier: '{address2}',
        substitute: appointmentInfo.instructor_info.address2 ? 
        ", "+appointmentInfo.instructor_info.address2: appointmentInfo.instructor_info.address2,
      },
      {
        identifier: '{city}',
        substitute: appointmentInfo.instructor_info.city,
      },
      {
        identifier: '{state}',
        substitute: stateListMapper[appointmentInfo.instructor_info.state],
        // substitute: jobClassCodeMapper[appointmentInfo.instructor_info.state],
        
      },
      {
        identifier: '{zip}',
        substitute: appointmentInfo.instructor_info.zip_code,
      },
      {
        identifier: '{term_desc}',
        substitute: termListMapper[term],
      },
      {
        identifier: '{offering_unit_name}',
        substitute: offeringUnit,
      },
      {
        identifier: '{semester_year}',
        substitute: year,
      },
      {
        identifier: '{dept_name_heading}',
        substitute: contractAppointmentData?.[0]?.course_section_details.subj_descr || '',
      },      
      
  ];

const appointmentRecords = {items: contractAppointmentData?.map(obj=>({...obj}))};

  const appointmentTokensList = [
    {
      identifier: '{course_start_date}',
      substitute: `course_section_details?.course_section_dates?.start_date`,
      backupSubstitute: `course_section_details?.session_date?.start_date`
    },
    {
      identifier: '{course_end_date}',
      substitute: `course_section_details?.course_section_dates?.end_date`,
      backupSubstitute: `course_section_details?.session_date?.end_date`
    },
    {
      identifier: '{credit}',
      substitute: `course_section_details?.credits`,
    },
    {
      identifier: '{index#}',
      substitute: `course_section_details?.reg_index_no`,
    },
    {
      identifier: '{special_contract_text}',
      substitute: `special_contract_text`,
    },
    {
      identifier: '{course_title}',
      // substitute: appointmentInfo.course_section_details.course_title,
      substitute: `course_section_details.course_title`,
    },
    {
      identifier: '{sub_title}',
      substitute: `course_section_details?.subtitle`,
    },
    {
      identifier: '{sch#}',
      substitute: `course_section_details.offering_unit_cd`,
    },
    {
      identifier: '{dept#}',
      substitute: `course_section_details.subj_cd`,
    },
    {
      identifier: '{course}',
      substitute: `course_section_details.course_no`,
    },
    {
      identifier: '{section}',
      substitute: `course_section_details.section_no`,
    },
    {
      identifier: '{contact_hrs}',
      substitute: `calculated_overwrite_contact_hours`,
    },
    {
      identifier: '{approved_salary}',
      substitute: `approved_salary`,
    },
    {
      identifier: '{job_class_code}',
      substitute: `instr_app_job_class_code`,
    },
    {
      identifier: '{dept_name}',
      substitute: `course_section_details.subj_descr`,
    },
    {
      identifier: '{total_salary}',
      substitute: `approved_salary`,
    },
  ];
  function removeTotalSalaryEntry(array) {
    return array.filter(item => item.identifier !== "{total_salary}");
}
 useEffect(()=>{
  let tempTotalSalary = 0;
  for(let i=0; i<appointmentRecords?.items?.length; i++){
    /*first loop will dynamically generate appointmentTokensList as per number of appointments
    
    In contract we have two types of data common data and appointment specific data.
    For example: FirstName(common data) and CourseTitle(appointmentData)

    We have a tokensListArray for replacing token with respective value,
    but for multiple appointment we have to uniquely identify appointment 
    specific token as CourseTitle1, CourseTitle2 and so on...
    So Appointment specific token is kept in appointmentTokensList as CourseTitle. The code dynamically
    appends number at the end to make it CourseTitle1 and CourseTitle2 after which it is merged 
    into tokensListArray for final value replacement.

    Complete Flow
    1. tokensListArray(containing common token)
    2. appointmentTokensList(containing appointment specific reference)
    3. iteration(to dynamically generate appointment specific tokens)
    4. merge appointmentTokensList into tokensListArray
    5. use tokensListArray to replace tokens with respective substitute.

    */

    let localAppointmentTokenList = appointmentTokensList.map(obj=>({...obj}))
    for(let j=0; j<localAppointmentTokenList.length; j++){
    
      localAppointmentTokenList[j].identifier = localAppointmentTokenList[j].identifier + i;

      let evaluatedSubstituteData = eval(`contractAppointmentData[${i}].${localAppointmentTokenList[j].substitute}`)

    if(localAppointmentTokenList[j].identifier.includes('{contact_hrs}')){
      evaluatedSubstituteData += " hrs" 
    }

    if(localAppointmentTokenList[j].identifier.includes('{dept_name}')){
      let schoolTotalSalary = appointmentRecords?.items?.[i]?.schoolTotalSalary || null;
      evaluatedSubstituteData = schoolTotalSalary ? 
      evaluatedSubstituteData + `</br></br><div style="font-family: &quot;times new roman&quot;, times, serif;"><strong style="font-family: &quot;times new roman&quot;, times, serif;">SCHOOL SALARY TOTAL:</strong> ${schoolTotalSalary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>`:
      evaluatedSubstituteData;
    }

    if(localAppointmentTokenList[j].identifier.includes("{course_start_date}") ||
    localAppointmentTokenList[j].identifier.includes("{course_end_date}")){
      evaluatedSubstituteData = evaluatedSubstituteData ? 
      moment(new Date(evaluatedSubstituteData)).format('MM/DD/YYYY') : evaluatedSubstituteData;
    }

    if(localAppointmentTokenList[j].identifier.includes("{sub_title}")){
      evaluatedSubstituteData = evaluatedSubstituteData ? 
      " : " + evaluatedSubstituteData : "";
    }
    
    if((localAppointmentTokenList[j].identifier).includes('{job_class_code}')){
      evaluatedSubstituteData = jobClassCodeMapper[evaluatedSubstituteData]
    }else if((localAppointmentTokenList[j].identifier).includes('{credit}')){
      evaluatedSubstituteData = parseInt(evaluatedSubstituteData).toString().split('').join('.');
    }else if(typeof evaluatedSubstituteData === 'undefined'){

      //backupSubstituteData is currently is used to fetch course date 
      //course date is fetched from course_section_dates if unavilable then we have to use session_date (backup)
      let backupSubstituteData = eval(`contractAppointmentData[${i}].${localAppointmentTokenList[j].backupSubstitute}`)
      if(typeof backupSubstituteData !== 'undefined')
        evaluatedSubstituteData = moment(backupSubstituteData).format('MM/DD/YYYY')
      else evaluatedSubstituteData = "--"

    }
    localAppointmentTokenList[j].substitute = evaluatedSubstituteData;

    if((localAppointmentTokenList[j].identifier).includes('{approved_salary}')){
      tempTotalSalary += parseInt(localAppointmentTokenList[j].substitute)
      const salary = parseFloat(localAppointmentTokenList[j].substitute);
      const displaySalary = isNaN(salary) ? 0 : salary;
      localAppointmentTokenList[j].substitute = displaySalary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    }

    }
    const modifiedArray = removeTotalSalaryEntry(localAppointmentTokenList);
    tokensListArray.push(...[...modifiedArray])


  }
  setTotalSalary(tempTotalSalary)
  tokensListArray.push({
    identifier: '{total_salary}',
    substitute: totalSalary,
  })
 },[appointmentRecords])


  const replaceOptions = {
    replace: domNode => {
      if (domNode.type === 'text') {
        if(domNode.data.includes("{dept_name}")){
          const dept = tokensListArray.find(data => data.identifier === domNode.data);
          const newData = domNode.data.replace(dept.identifier, `<span>${dept.substitute}</span>`);
          return parse(newData);           
        }
        tokensListArray.forEach(({ identifier, substitute }) => {
          let value = substitute == null ? '--' : substitute == 'N.a.N' ? '0' : substitute;
          if(identifier === '{address2}' && !substitute){
            value = '';
          }
          if(identifier === '{special_contract_text}0' && !substitute){
            value = ' ';
          }
          domNode.data = domNode.data.replace(
            new RegExp(identifier, 'g'),
            value
          );
        });
      }

      if (
        !isRevised &&
        domNode.attribs &&
        domNode.attribs.id === 'contract-revised-section'
      ) {
        console.log('identified');
        domNode.children = [];
      }

      if (domNode.attribs && domNode.attribs.style) {
        domNode.attribs.style = domNode.attribs.style.replace(
          /background-color:\s*rgb\(240,\s*251,\s*255\);?/gi,
          ''
        );
        // domNode.attribs.style = domNode.attribs.style.replace(
        //   /color:rgb\(18,\s*54,\s*255\);?/gi,
        //   ''
        // );//text color change not working
      }

      // if (domNode.attribs && domNode.attribs.style) {
      //   domNode.attribs.style = domNode.attribs.style.replace(
      //     /color:rgb\(18,\s*54,\s*255\);?/gi,
      //     ''
      //   );
      // }
      return domNode;
    },
  };

  const sfsLabel = () => {
    return (
      <Stack direction="row" alignItems="flex-start">
        Send for Signature &nbsp;
        <LightTooltip
          placement="left-start"
          arrow
          sx={{ '.MuiTooltip-tooltip': { maxWidth: '600px' } }}
          title={
            <Stack alignItems="flex-start">
              <Typography
                sx={{
                  fontSize: '1.125rem',
                  lineHeight: '1.125',
                  fontWeight: '600',
                  textAlign: 'left',
                }}
                component={'div'}
              >
                Verified
                <HorizontalDivider />
              </Typography>
              <div>
                {contractData?.data?.contract_hierarchy
                  ?.filter(
                    data =>
                      data.date_send_for_signature && data.send_for_signature_by
                  )
                  ?.map((data, index) => {
                    // let formated_approval_date = moment(salaryData?.approval_date).format('YYYY-MM-DD')
                    return (
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          lineHeight: '1.125',
                          color: '#666666',
                          textAlign: 'left',
                          paddingTop: '10px',
                        }}
                        paragraph
                      >
                        {/* {pastSalaryData[1].approved_salary} */}
                        {index + 1} -{' '}
                        {formatDateTime(
                          data.date_send_for_signature,
                          'MM/DD/YYYY'
                        )}{' '}
                        by {data.send_for_signature_by}
                      </Typography>
                    );
                  })}
              </div>
            </Stack>
          }
          data-testid="courses-prerequisite-tooltip"
        >
          <InfoIcon
            style={{ width: '1.5rem', height: '1.5rem', cursor: 'pointer' }}
          />
        </LightTooltip>
      </Stack>
    );
  };

  const contractStatusMapping = {
    Draft: 'Draft',
    send_for_signature: 'Send for signature',
    hcm_ready: 'HCM_READY',
    hcm_enter: 'HCM_ENTER',
  };

  const stateSchema = useMemo(() => {
    return {
      // contract_status: { value: contractData?.data.contract_template.contract_status, error: '' },
      contract_status: { value: '', error: '' },
      html_document: { value: '', error: '' },
    };
  }, [contractData]);

  const validationSchema = {
    contract_status: {
      required: true,
    },
  };

  const { state, handleOnChange, disable, setState } = useForm(
    stateSchema,
    validationSchema
  );

  useEffect(() => {
    setState(stateSchema);
  }, [setState, stateSchema]);

  //payload // contract_status:  contractStatusMapping[state?.contract_status?.value],
  const contractPreviewPayload = {
    contract_id: contractData?.data.id,
    type: 'email',
    html_document: state?.html_document.value,
    // contract_status:  contractStatusMapping[state?.contract_status?.value]
    // contract_template:
  };

  const handleStatusChange = field => e => {
    setBeErrors(prev => ({ ...prev, [field]: '' }));
    console.log('radio update', field, e.target.value);
    handleOnChange(field, e.target.value);
  };

  const handlePreviewUpdate = (field, value) => {
    setBeErrors(prev => ({ ...prev, [field]: '' }));
    handleOnChange(field, value);
  };

  const handleUpdateClick = async () => {
    setLoading(true);
    // commented till form development
    const status = state?.contract_status?.value;

    if (status === 'hcm_enter') {
      try {
        let response = await updateContractStatusSFS.mutateAsync({
          contract_id: contractPreviewPayload?.contract_id,
          status: 'HCM_ENTER',
        });
        if (response.status_code === 200) {
          toast.success('Contract status updated to HCM Enter',{
            hideProgressBar: true,
          });
        } else toast.error('Contract status updated failed.',{
          hideProgressBar: true,
        });
        // refetch();
        refetchCourseDetails();
        onClose();
      } catch (error) {
        const errors = error?.response?.data?.errors;
        setBeErrors({
          ...errors,
        });
        toast.error(
          `An error occurred while Updating, Please try again later.`,{
            hideProgressBar: true,
          }
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      let response = await updateInstructorContractSFS.mutateAsync(
        contractPreviewPayload
      );

      if (response.status_code === 200) {
        let response2 = await updateContractStatusSFS.mutateAsync({
          contract_id: contractPreviewPayload?.contract_id,
          status: 'Send for signature',
        });
        if (response2.status_code === 200) {
          toast.success('Contract status updated to Send For Signature',{
            hideProgressBar: true,
          });
        } else toast.error('Contract status updated failed.',{
          hideProgressBar: true,
        });
      } else toast.error('Contract status updated failed',{
        hideProgressBar: true,
      });
      // refetch();
      refetchCourseDetails();
      onClose();
      // setTimeout(() => {
      //   refetch();
      //   refetchCourseDetails?.();
      // }, 1000);
    } catch (error) {
      const errors = error?.response?.data?.errors;
      setBeErrors({
        ...errors,
      });
      toast.error(`An error occurred while Updating, Please try again later.`,{
        hideProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contractTemplate) {
      let addIndexTemplate = contractTemplate;
      for (let token of appointmentTokensList)
        addIndexTemplate = addIndexTemplate.replace(
          token.identifier,
          `${token.identifier}{{@index}}`
        );

      let modifiedTemplate = addIndexTemplate.replace(
        '##ADS',
        ` {{#each items}}
       `
      );
      modifiedTemplate = modifiedTemplate.replace('##ADE', `{{/each}} <strong><span style="font-family: &quot;times new roman&quot;, times, serif;">TOTAL SALARY:</strong> </span> <span style="color: black; font-family: &quot;times new roman&quot;, times, serif;">$${totalSalary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>`);

      let compiledTemplate = Handlebars.compile(modifiedTemplate);
      let contractTemplateU = compiledTemplate(appointmentRecords);
      setPreviewContract(parse(`${contractTemplateU}`, replaceOptions));
    }
  }, [contractTemplate, rerenderBycontractAppointmentData]);

  useEffect(() => {
    if (
      !(
        appointmentRecords.items == undefined ||
        appointmentRecords.items?.length == 0
      )
    ) {
      setRerenderBycontractAppointmentData(true);
    }
  }, [appointmentRecords]);

  useEffect(() => {
    handlePreviewUpdate('html_document', renderToString(previewContract));
  }, [previewContract]);

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title="AssignedInstructor"
      titleValue="XYZ"
      leftButton={{ label: 'Unassigned' }}
      rightButton={{ label: 'Update' }}
      bgColor={'#ffffff'}
    >
      <Grid style={{ position: 'absolute', right: '1%' }}>
        <CloseIcon
          onClick={onClose}
          style={{ width: '5rem', height: '5rem', cursor: 'pointer' }}
          data-testid="assign-contract-modal-close"
        />
      </Grid>

      <Grid
        sx={{
          padding: '2rem',
        }}
      >
        {/* {rerenderBycontractAppointmentData || previewContract ? */}
        {previewContract ? (
          <>
            <Grid>
              {previewContract}
              {
                //  contractData?
                // parse(`${modifiedContractTemplate}`)*/
              }
            </Grid>

            <Grid
              sx={{
                borderTop: '3px solid #c9c9c9',
                borderRadius: '5px',
                p: '2rem',
              }}
            >
              <Grid
                className="name-wrapper"
                sx={{
                  p: '2rem',
                  border: '1px solid #333333',
                  borderRadius: '10px',
                  background: '#f5f5f5',
                }}
              >
                <Typography variant="h5">
                  Contract Status &nbsp;
                  <LightTooltip
                    placement="left-start"
                    arrow
                    sx={{ '.MuiTooltip-tooltip': { maxWidth: '600px' } }}
                    title={
                      <Stack alignItems="flex-start">
                        <div>
                          <Typography
                            sx={{
                              fontSize: '1.125rem',
                              lineHeight: '1.125',
                              fontWeight: '600',
                              textAlign: 'left',
                            }}
                            component={'div'}
                          >
                            Pending:
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '1rem',
                              lineHeight: '1.125',
                              color: '#666666',
                              textAlign: 'left',
                            }}
                            paragraph
                          >
                            Instructor and salary has not been approved. Both
                            fields can be empty or maybe just the instructor has
                            been added. Will need an indicator of some sort
                            identifying those whose salary needs to be approved.
                          </Typography>
                        </div>

                        <div>
                          <Typography
                            sx={{
                              fontSize: '1.125rem',
                              lineHeight: '1.125',
                              fontWeight: '600',
                              textAlign: 'left',
                            }}
                            component={'div'}
                          >
                            Approved:
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '1rem',
                              lineHeight: '1.125',
                              color: '#666666',
                              textAlign: 'left',
                            }}
                            paragraph
                          >
                            Admin user has approved the salary. Next step after
                            ‘approved’ is sending contract via DocuSign out for
                            signature. When returned signed, date needs to be
                            recorded so that we know it is ready for next step,
                            HCM Ready
                          </Typography>
                        </div>

                        <div>
                          <Typography
                            sx={{
                              fontSize: '1.125rem',
                              lineHeight: '1.125',
                              fontWeight: '600',
                              textAlign: 'left',
                            }}
                            component={'div'}
                          >
                            Send for Signature:
                          </Typography>{' '}
                          <Typography
                            sx={{
                              fontSize: '1rem',
                              lineHeight: '1.125',
                              color: '#666666',
                              textAlign: 'left',
                            }}
                            paragraph
                          >
                            A contract form is ready for signature request.
                          </Typography>
                        </div>

                        <div>
                          <Typography
                            sx={{
                              fontSize: '1.125rem',
                              lineHeight: '1.125',
                              fontWeight: '600',
                              textAlign: 'left',
                            }}
                            component={'div'}
                          >
                            HCM Ready:
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '1rem',
                              lineHeight: '1.125',
                              color: '#666666',
                              textAlign: 'left',
                            }}
                            paragraph
                          >
                            Tells admin user that it is ready to submit to HCM
                            for payroll processing
                          </Typography>
                        </div>

                        <div>
                          <Typography
                            sx={{
                              fontSize: '1.125rem',
                              lineHeight: '1.125',
                              fontWeight: '600',
                              textAlign: 'left',
                            }}
                            component={'div'}
                          >
                            HCM Submitted:
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '1rem',
                              lineHeight: '1.125',
                              color: '#666666',
                              textAlign: 'left',
                            }}
                            component={'div'}
                          >
                            Becomes the status after ‘c’ from above. This date
                            needs to be recorded.
                          </Typography>
                        </div>
                      </Stack>
                    }
                    data-testid="courses-prerequisite-tooltip"
                  >
                    <InfoIcon
                      style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        cursor: 'pointer',
                      }}
                    />
                  </LightTooltip>
                </Typography>
                <Grid
                  container
                  justifyContent="space-between"
                  mt={2}
                  mb={3}
                  spacing={2}
                >
                  <Grid item xs={9}>
                    {/* <FormInput
                label="First Name"
                required
                placeholder="ie: John"
                // value={state?.first_name?.value}
                value="Hello"
                // error={state?.first_name?.error || beErrors?.first_name}
                // onChange={handleInputChange('first_name')}
                testId="assign-instructor-modal-first-name"
              /> */}

                    <FormControl fullWidth>
                      <RadioGroup
                        row
                        value={state.contract_status.value
                          ?.toLowerCase()
                          .split(' ')
                          .join('_')}
                        onChange={handleStatusChange('contract_status')}
                        // error={
                        //   state?.primary_instructor?.error ||
                        //   beErrors?.primary_instructor
                        // }
                        sx={{ justifyContent: 'space-around' }}
                        data-testid="assign-instructor-modal-primary-instructor"
                        required
                      >
                        <FormRadio
                          label={sfsLabel()}
                          value="send_for_signature"
                          radioColor="#dc3545"
                          testId="assign-instructor-modal-primary-instructor-yes"
                          disabled={contractData?.data.status !== 'Draft'}
                        />
                        <FormRadio
                          label="HCM Ready"
                          value="hcm_ready"
                          radioColor="#0071E3"
                          testId="assign-instructor-modal-primary-instructor-no"
                          disabled
                        />
                        <FormRadio
                          label="HCM Entered"
                          value="hcm_enter"
                          radioColor="#2B7D3B"
                          testId="assign-instructor-modal-primary-instructor-no"
                          disabled={contractData?.data?.status !== 'HCM_READY'}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid
                    container
                    mt={4}
                    spacing={2}
                    justifyContent="space-between"
                  >
                    <Grid item xs={6}></Grid>
                    <Grid item xs={3}>
                      {!loading && (
                        <Button
                          label="Cancel"
                          variant="contained"
                          className="full-width"
                          style={{ backgroundColor: '#333333' }}
                          onClick={onClose}
                          testId="assign-instructor-modal-toggle-assign"
                        />
                      )}
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        label={loading ? `Updating...` : `Update`}
                        className="full-width"
                        variant="contained"
                        style={{
                          root: {
                            backgroundColor: '#3c52b2',
                            color: '#fff',
                            '&:hover': {
                              backgroundColor: '#fff',
                              color: '#3c52b2',
                            },
                          },
                        }}
                        // disabled={disable  }
                        // && state?.contract_status?.value !== 'Draft'
                        disabled={
                          disable ||
                          state?.contract_status?.value === 'Draft' ||
                          loading
                        }
                        onClick={handleUpdateClick}
                        testId="assign-instructor-modal-update"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : (
          error?.response?.data?.message || 'Loading...'
        )}
      </Grid>
    </SimpleModal>
  );
};

export default AssignedContract;
