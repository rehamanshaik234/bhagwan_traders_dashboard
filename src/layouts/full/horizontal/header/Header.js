import * as React from 'react';
import { IconButton, Box, AppBar, useMediaQuery, Toolbar, styled, Stack, FormControl, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileSidebar, toggleHorizontal, setDarkMode, toggleSidebar } from 'src/store/customizer/CustomizerSlice';
import { IconMenu2 } from '@tabler/icons';
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import Notifications from 'src/layouts/full/vertical/header/Notifications';
import Cart from 'src/layouts/full/vertical/header/Cart';
import Profile from 'src/layouts/full/vertical/header/Profile';
import Search from 'src/layouts/full/vertical/header/Search';
import Language from 'src/layouts/full/vertical/header/Language';
import Navigation from 'src/layouts/full/vertical/header/Navigation';
import Logo from 'src/layouts/full/shared/logo/Logo';

const Header = () => {
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  // drawer
  const customizer = useSelector((state) => state.customizer);
  const dispatch = useDispatch();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',

    [theme.breakpoints.up('lg')]: {
      minHeight: customizer.TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({theme}) => ({ margin: '0 auto', width: '100%', color: `${theme.palette.text.secondary} !important`, }));

  return (
    <AppBarStyled position="sticky" color="default" elevation={8}>
      <ToolbarStyled
        sx={{
          maxWidth: customizer.isLayout === 'boxed' ? 'lg' : '100%!important',
        }}
      >
        <Box sx={{ width: lgDown ? '45px' : 'auto', overflow: 'hidden' }}>
          <Logo />
        </Box>
        {/* ------------------------------------------- */}
        {/* Toggle Button Sidebar */}
        {/* ------------------------------------------- */}
        {lgDown ? (
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={() => dispatch(toggleMobileSidebar())}
          >
            <IconMenu2 />
          </IconButton>
        ) : (
          ''
        )}
        {/* ------------------------------------------- */}
        {/* Search Dropdown */}
        {/* ------------------------------------------- */}
        {/* <Search /> */}
        {/* {lgUp ? (
          <>
            <Navigation />
          </>
        ) : null} */}
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
                justifyContent: 'flex-end',
                gap: 1,
                padding: 0,
              },
            }}
          >
            <MenuItem disabled value="">
              Select Layout
            </MenuItem>
            <MenuItem value="vertical">
              {/* <ViewComfyTwoTone fontSize="small" /> */}
              Vertical
            </MenuItem>
            <MenuItem value="horizontal">
              {/* <PaddingTwoTone fontSize="small" /> */}
              Horizontal
            </MenuItem>
          </Select>
        </FormControl>
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
