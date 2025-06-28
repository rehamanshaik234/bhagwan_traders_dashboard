import React from 'react';
import { IconButton, Box, AppBar, useMediaQuery, Toolbar, styled, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, toggleMobileSidebar, setTheme,
  setDir,
  setDarkMode,
  toggleLayout,
  toggleHorizontal,
  setBorderRadius,
  setCardShadow, } from 'src/store/customizer/CustomizerSlice';
import { IconMenu2 } from '@tabler/icons';
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import { Switch, FormControlLabel } from '@mui/material';
import { ViewComfyTwoTone, PaddingTwoTone, BorderOuter } from '@mui/icons-material';

// components
import Notifications from './Notifications';
import Profile from './Profile';
import Cart from './Cart';
import Search from './Search';
import Language from './Language';
import Navigation from './Navigation';
import MobileRightSidebar from './MobileRightSidebar';
import { Menu, Button } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'; 

const Header = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));
    const StyledBox = styled(Box)(({ theme }) => ({
      boxShadow: theme.shadows[8],
      padding: '20px',
      cursor: 'pointer',
      justifyContent: 'center',
      display: 'flex',
      transition: '0.1s ease-in',
      border: '1px solid rgba(145, 158, 171, 0.12)',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    }));

    const [layoutAnchorEl, setLayoutAnchorEl] = React.useState(null);

    const handleLayoutClick = (event) => {
      setLayoutAnchorEl(event.currentTarget);
    };

    const handleLayoutClose = () => {
      setLayoutAnchorEl(null);
    };

    const isLayoutMenuOpen = Boolean(layoutAnchorEl);

  // drawer
  const customizer = useSelector((state) => state.customizer);
  const dispatch = useDispatch();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: customizer.TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({theme}) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        {/* ------------------------------------------- */}
        {/* Toggle Button Sidebar */}
        {/* ------------------------------------------- */}
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={lgUp ? () => dispatch(toggleSidebar()) : () => dispatch(toggleMobileSidebar())}
        >
          <IconMenu2 size="20" />
        </IconButton>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            displayEmpty
            value={customizer.isHorizontal ? 'horizontal' : 'vertical'}
            onChange={(e) => dispatch(toggleHorizontal(e.target.value === 'horizontal'))}
                variant="standard"
    disableUnderline
    sx={{
      fontSize: 14,
      px: 1,
      py: 0.5,
      background: 'transparent',
      boxShadow: 'none',
      border: 'none',
      '& fieldset': {
        border: 'none',
      },
      '& .MuiSelect-select': {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: 0,
      },
    }}
          >
            <MenuItem disabled value="">
              Select Layout
            </MenuItem>
            <MenuItem value="vertical">
              <ViewComfyTwoTone fontSize="small" />
              Vertical
            </MenuItem>
            <MenuItem value="horizontal">
              <PaddingTwoTone fontSize="small" />
              Horizontal
            </MenuItem>
          </Select>
        </FormControl>





        {/* ------------------------------------------- */}
        {/* Search Dropdown */}
        {/* ------------------------------------------- */}
        {/* <Search /> */}
        {/* {lgUp ? (
          <>
            <Navigation />
          </>
        ) : null} */}

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">

          {/* <Language /> */}
          {/* ------------------------------------------- */}
          {/* Ecommerce Dropdown */}
          {/* ------------------------------------------- */}
          {/* <Cart /> */}
          {/* ------------------------------------------- */}
          {/* End Ecommerce Dropdown */}
          {/* ------------------------------------------- */}
          {/* <Notifications /> */}
           {/* ------------------------------------------- */}
          {/* Toggle Right Sidebar for mobile */}
          {/* ------------------------------------------- */}
          {/* {lgDown ? <MobileRightSidebar /> : null} */}

<Box display="flex" alignItems="center">
  <FormControlLabel
    control={
      <Switch
        size="small"
        checked={customizer.activeMode === 'dark'}
        onChange={() =>
          dispatch(setDarkMode(customizer.activeMode === 'dark' ? 'light' : 'dark'))
        }
        color="default"
      />
    }
    label={
      <Box display="flex" alignItems="center" spacing={1}>
        {customizer.activeMode === 'dark' ? (
          <DarkModeTwoToneIcon color="primary" fontSize="small" />
        ) : (
          <WbSunnyTwoToneIcon color="primary" fontSize="small" />
        )}
      </Box>
    }
    labelPlacement="start"
    sx={{
      m: 0,
      pl: 1,
      '& .MuiFormControlLabel-label': {
        display: 'flex',
        alignItems: 'center',
      },
    }}
  />
</Box>


          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  toggleSidebar: PropTypes.func,
};

export default Header;
