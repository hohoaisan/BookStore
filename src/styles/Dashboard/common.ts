import { useTheme, fade, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      marginBottom: theme.spacing(2),
    },
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
      flexDirection: 'column',
    },
    breadcrumb: {
      marginTop: 10,
      marginBottom: 10,
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.black, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.black, 0.25),
      },
      marginRight: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginRight: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      top: 0,
      right: 0,
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
    },
    inputInput: {
      padding: theme.spacing(1, 0, 1, 1),
      paddingRight: `calc(1em + ${theme.spacing(4)}px)`,
      width: '100%',
    },
  }),
);

export default useStyles
