
import { Grid } from '@mui/material'
import styles from './index.module.scss'

const CentralContentPageLayout = (props) => {
    return ( 
        <div>
            <Grid container 
            direction="row"
            justifyContent="center"
            alignItems="center"
            className={styles.main}
            >
                {props.children}
            </Grid>
        </div>
     );
}
 
export default CentralContentPageLayout;