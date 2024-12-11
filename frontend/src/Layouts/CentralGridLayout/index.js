import styles from './index.module.scss'
import { Grid } from '@mui/material'

const CentralGridLayout = (props) => {
    return ( 
        <Grid container xs={10} sm={10} md={6} lg={6} className={styles.container}>
            {props.children}
        </Grid>
     );
}
 
export default CentralGridLayout;