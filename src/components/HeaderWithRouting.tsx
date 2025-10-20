import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import { brandColors, colorUtils } from "../theme";
import { Person, Notifications, Close } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAuthClick = () => {
    navigate("/auth");
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setUserMenuOpen(true);
  };

  const handleUserMenuClose = () => {
    setUserMenuOpen(false);
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    console.log('Profile clicked, navigating to /profile');
    console.log('Authentication status:', { isAuthenticated, currentUser });
    handleUserMenuClose();
    navigate('/profile');
  };

  const handleNotificationsClick = () => {
    handleUserMenuClose();
    navigate('/profile', { state: { tab: 'notifications' } });
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    await logout();
    navigate('/');
  };

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pt: 3,
        pb: 2,
        zIndex: 9999,
        borderRadius: 0,
      }}
    >
      <Toolbar
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          position: "relative",
          px: 3,
        }}
      >
        {isAuthenticated ? (
          <Box
            sx={{
              position: "absolute",
              right: 32,
              top: -8,
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              backgroundColor: brandColors.surfaces.glass,
              padding: "8px 20px",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              boxShadow: colorUtils.shadow('0, 0, 0', 0.1, 4, 2),
              "&:hover": {
                backgroundColor: brandColors.surfaces.glassHover,
                boxShadow: colorUtils.shadow('0, 0, 0', 0.15, 8, 4),
              },
            }}
            onClick={handleUserMenuClick}
          >
            <Avatar sx={{ bgcolor: brandColors.secondary, width: 24, height: 24 }}>
              <Person sx={{ fontSize: 16 }} />
            </Avatar>
            <Typography
              sx={{
                color: brandColors.secondary,
                fontWeight: 700,
                textTransform: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.95rem",
                letterSpacing: "0.3px",
                textShadow: "0 1px 1px rgba(255, 255, 255, 0.5)",
              }}
            >
              {currentUser?.full_name || currentUser?.email || 'Account'}
            </Typography>
          </Box>
        ) : (
          <Button
            onClick={handleAuthClick}
            variant="text"
            sx={{
              color: brandColors.secondary,
              fontWeight: 700,
              textTransform: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.95rem",
              letterSpacing: "0.3px",
              textShadow: "0 1px 1px rgba(255, 255, 255, 0.5)",
              position: "absolute",
              right: 32,
              top: -8,
              backgroundColor: brandColors.surfaces.glass,
              padding: "8px 20px",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              boxShadow: colorUtils.shadow('0, 0, 0', 0.1, 4, 2),
              "&:hover": {
                backgroundColor: brandColors.surfaces.glassHover,
                boxShadow: colorUtils.shadow('0, 0, 0', 0.15, 8, 4),
              },
            }}
          >
            Sign Up / Sign In
          </Button>
        )}
        <Box
          onClick={() => navigate("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            margin: "0 auto",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
            transition: "opacity 0.2s ease",
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Dreamery Logo"
            sx={{
              height: 110,
              width: "auto",
              marginRight: "-20px",
              transform: "translateY(-2px)",
              filter: "brightness(0) invert(1)",
            }}
          />
          <Typography
            variant="h4"
            sx={{
              color: brandColors.text.inverse,
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 900,
              letterSpacing: "-1px",
              fontSize: "3.2rem",
              textTransform: "uppercase",
              textShadow: "2px 2px 8px rgba(0, 0, 0, 0.4)",
              filter: "brightness(1.1)",
            }}
          >
            DREAMERY
          </Typography>
        </Box>
      </Toolbar>

      {/* User Profile Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={userMenuOpen}
        onClose={handleUserMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          mt: 1,
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleNotificationsClick}>
          <ListItemIcon>
            <Notifications fontSize="small" />
          </ListItemIcon>
          Notifications
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Close fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
