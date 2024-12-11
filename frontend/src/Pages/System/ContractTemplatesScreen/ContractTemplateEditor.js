import React,{ useMemo, useState, useEffect,useRef } from 'react'
import { Box, Grid, Typography } from '@mui/material';
import RichTextEditor from 'Components/RichTextEditor';
import useForm from 'hooks/Form';
import { useUnionContractMutation } from 'services/mutations';
import {
    convertDraftToHtml,
    convertHtmlToDraft,
    convertHtmlFromRaw,
  } from 'utils/common';
import Button from 'Components/Button';
import { toast } from 'react-toastify';

import JoditEditor from 'jodit-react';



const ContractTemplateEditor = ({refetchContract, contractInfo}) => {

    const [loading,setLoading] = useState(false)
    const updateUnionContract =
    useUnionContractMutation?.useUpdateUnionContractMutation();
    //react-wysiwyg lib 
    const [beErrors, setBeErrors] = useState({});
    
      const stateSchema = useMemo(
        () => {
          return {
            [contractInfo.template_type]: {
              value: convertHtmlToDraft(`${contractInfo.content}`) || '',
              error: '',
            }
          };
        },
        [contractInfo]
      );

      const validationStateSchema = {
        [contractInfo.template_type]: {
          required: true,
        }
      };


      const { state, handleOnChange, disable, setState } = useForm(
        stateSchema,
        validationStateSchema
      );


 
      useEffect(() => {
        setLoading(true)
        setState(stateSchema);
      }, [stateSchema, setState,contractInfo]);

      useEffect(()=>{
        setLoading(false)
      },[state])

    //changes for jodit
    // const stateSchema = useMemo(
    //     () => {
    //       return {
    //         [contractInfo.template_type]: {
    //           value: contractInfo.content || '',
    //           error: '',
    //         }
    //       };
    //     },
    //     [contractInfo]
    //   );
    
    //   const validationStateSchema = {
    //     [contractInfo.template_type]: {
    //       required: true,
    //     }
    //   };
    
    
    //   const { state, handleOnChange, disable, setState } = useForm(
    //     stateSchema,
    //     validationStateSchema
    //   );
    
    //   useEffect(() => {
    //     setLoading(true)
    //     setState(stateSchema);
    //   }, [stateSchema, setState,contractInfo]);
    
    //   useEffect(()=>{
    //     setLoading(false)
    //   },[state])
      //changes for jodit ends


   

      const handleRichTextChange = value => {
        setBeErrors({
          ...beErrors,
          union: '',
        });
    
        if (!state?.union?.value && !value.getCurrentContent().hasText()) {
          return;
        }
    
        handleOnChange(contractInfo.template_type, value.getCurrentContent().hasText() ? value : '');
      };


//     const editorRef = useRef(null); //tbr
//     const log = () => {
//     if (editorRef.current) {
//       console.log(editorRef.current.getContent());
//     }
//   };

  //react-wysiwyg ends

 
  // const revisedWatermark = `<p style="display: none;">##WSS</p><div id="contract-revised-section"><table style="border-collapse:collapse;width: 100%;"><tbody><tr><td style="width: 71.972%; border-color: rgb(255, 255, 255);"><br></td><td style="width: 27.9279%; border-color: rgb(255, 255, 255);"><img src="data:image/png;base64,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" width="200px" style="width: 200px; height: 70px; display: block; margin-left: auto; margin-right: auto;"><br></td></tr></tbody></table></div><p style="display: none;">##WSE</p>`
  const revisedWatermark = `<div style="display:flex;justify-content:flex-end;">
  <div style="font-size:24.884px;background-color:rgb(226, 227, 229);color:rgb(108, 117, 125);border-radius:6px;padding:8px;font-weight:bold;display:inline-block;width:120px;text-align:center;">
  Revised
  </div>`;



//jodit
    const editor = useRef(null);
	const [content, setContent] = useState(contractInfo.content);
    const editorJRef = React.createRef()
    const [disableUpdate, setDisableUpdate] = useState(true)

    

    const facilityMergeFields = [
      "",
        "appointmentSection",
        "address1",
        "address2",
        "approved_salary",
        "city",
        "contact_hrs",
        "course#",
        "course_end_date",
        "course_start_date",
        "course_title",
        "credit",
        "current_date",
        "dept#",
        "dept_name",
        "first_name",
        "index#",
        "last_name",
        "job_class_code",
        "offering_unit_name",
        "semester_year",
        "sch#",
        "section#",
        "special_contract_text",
        "state",
        "sub_title",
        "term_desc",
        "total_salary",
        "zip"

      ];

      const facilityMergeFields2 = [
        {fieldTitle: 'Hello1'},
        {fieldTitle: 'world1'},
        {fieldTitle: 'globe1'}
      ]

      
   
    //   const placeholderDropdown={
    //     text: 'Placeholder2',
    //     list: facilityMergeFields2.reduce((options,{fieldTitle})=>{
    //         options[fieldTitle] = {
    //             title : fieldTitle,
    //             onclick: handleOptionsClick()
    //         };
            
    //         return options
    //     }),
    // }

    
      const createOptionGroupElement = (mergeFields, optionGrouplabel, parentElement) => {
        // let optionGroupElement = document.createElement("optgroup");
        // optionGroupElement.setAttribute("label", optionGrouplabel);
        for (let index = 0; index < mergeFields.length; index++) {
          let optionElement = document.createElement("option");
          optionElement.setAttribute("class", "merge-field-select-option");
          optionElement.setAttribute("value", mergeFields[index]);
          optionElement.text = mergeFields[index];
          parentElement.appendChild(optionElement);
        }
        return parentElement;
      }

     

      const buttons = [
        "undo",
        "redo",
        "|",
        "bold",
        "strikethrough",
        "underline",
        "italic",
        "|",
        {
            name: "insertMergeField",
            tooltip: "Insert Merge Field",
            text:"Placeholder",
          //   iconURL: "images/merge.png",
            popup: (editor, current, self, close) => {
              // const editorJ = editorJRef.current.editor
              function onSelected(e) {
                let mergeField = e.target.value;
                let appointmentArray = [""]
                if (mergeField) {
                  console.log(mergeField);
                  console.log("editor", editor);
                  // let cursorPosition = editor.selection.getCursor()
                  // editor.selection.insertHTML(`{${mergeField}}`,false,cursorPosition)
                  if(mergeField == "appointmentSection")
                  editor.selection.insertHTML(`<div id="appointmentSection" style="color:black";background-color:"#fffd8d"> Edit Appointment Info</div>`)
                  else
                  editor.selection.insertHTML(`<span style="color:black;background-color:#f0fbff">{${mergeField}}</span>`)
  
  
                  // editor.selection.insertNode(
                  //   editor.create.inside.fromHTML("<span>{{" + ${mergeField} + "}}</span>")
                  // );
                }
              }
              let divElement = editor.create.div("merge-field-popup"); 
        
              let labelElement = document.createElement("label");//
              labelElement.setAttribute("class", "merge-field-label");///
              labelElement.text = 'Merge field: ';///
              divElement.appendChild(labelElement);//
        
              let selectElement = document.createElement("select");
              selectElement.setAttribute("class", "merge-field-select");
              // selectElement.appendChild(createOptionGroupElement(facilityMergeFields, "Placeholder"));
              createOptionGroupElement(facilityMergeFields, "Placeholder",selectElement)
              selectElement.onchange = onSelected;
              divElement.appendChild(selectElement);
        
              console.log(divElement);
              return divElement;
            }
          },"|",
        "superscript",
        "subscript",
        "|",
        "align",
        "|",
        "ul",
        "ol",
        "outdent",
        "indent",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "link",
        "table",
        "|",
        "hr",
        "eraser",
        "copyformat",
        "|",
        "fullsize",
        "selectall",
        "print",
        "|",
        "source",
        "|",
        {
          name: "insertMergeField",
          tooltip: "Insert Merge Field",
          text:"Revised",
          // exec: insertRevisedDiv(editor)
          exec: (editor)=>{
            
            editor.selection.insertHTML(revisedWatermark)
          }
        },"|"
      ];
  
    const editorConfig = {
        readonly: false, // all options from <https://xdsoft.net/jodit/doc/>
        uploader: {
            insertImageAsBase64URI: true
        },
        buttons: buttons,
        height:'500px',
        // extraButtons: [placeholderDropdown]

    };

    const handleClearEditor = ()=>{
        setContent('');
    }

    useEffect(()=>{
       setContent(contractInfo.content)
    },[contractInfo])




    

    
    const handleEditorSubmit = async (setDefault = false) => {
        setLoading(true);
        const payload = {
          id: [contractInfo.id],
          template_type: contractInfo.template_type,
          content: content,
          default_content: setDefault ? content : contractInfo.default_content,
        };
        
        try {
          
          const formAction = payload?.id ? updateUnionContract : '';
          await formAction.mutateAsync(payload);
          setTimeout(() => refetchContract?.(), 500);
            toast.success(
                `Contract updated successfully.`,{
                  hideProgressBar: true,
                }
            );
          
        } catch (error) {
          console.log(error);
        }finally {
          setLoading(false);
        }
      };

      useEffect(()=>{
        if(content == '') setDisableUpdate(true)
        else setDisableUpdate(false)
      },[content])

      

   

  return (
    <div key={contractInfo.id}>
        {loading?
        'Loading..':
        <>
            {/* <Grid item xs={12}>
              <RichTextEditor
                key={`Rich-text-editor-contract-templates`}
                className="rich-text-editor"
                onChange={handleRichTextChange}
                placeholder="Description"
                defaultEditorState={state?.[contractInfo.template_type]?.value}
                error={state?.[contractInfo.template_type]?.error || beErrors?.[contractInfo.template_type]}
                wrapperId={`contract-${contractInfo.id}`}
                editorClassName={'contract-rte'}
                required
                mention={contractMention}
              />
            </Grid>
            <Grid container pt={3}>
              <Grid item xs={12}>
                <Button
                  label='Update'
                  className="full-width"
                  disabled={disable}
                  loading={loading}
                  onClick={handleSubmit}
                  testId={`union-submit`}
                />
              </Grid>
            </Grid> */}
            <Grid item xs={12}>
            <JoditEditor
                config={editorConfig}
                tabIndex={1} // tabIndex of textarea
                onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={newContent => {}}
                value={content}
                
            />
            </Grid>

            <Grid container pt={3} spacing={2}>
                <Grid item xs={4} >
                <Button
                  label='Clear'
                  className="full-width"
                  loading={loading}
                  onClick={handleClearEditor}
                  testId={`union-clear`}
                  style={{
                    backgroundColor: "#333333",
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  label='Update'
                  className="full-width"
                  disabled={disableUpdate}
                  loading={loading}
                  onClick={() => handleEditorSubmit(false)}
                  testId={`union-submit`}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  label='Update & Set Default'
                  className="full-width"
                  disabled={disableUpdate}
                  loading={loading}
                  onClick={() => handleEditorSubmit(true)}
                  testId={`union-set-default`}
                  style={{
                    backgroundColor:'rgb(166, 41, 255)'
                  }}
                />
              </Grid>
            </Grid>
        </>
        }
    </div>
  )
}

export default ContractTemplateEditor