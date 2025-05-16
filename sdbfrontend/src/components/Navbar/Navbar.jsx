import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Slide,
  useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import "./Navbar.css";
import LoginModal from "../LoginModal/LoginModal";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const open = Boolean(anchorEl);
  const trigger = useScrollTrigger();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    handleMenuClose(); // Close mobile menu after clicking
  };

  return (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar position="sticky" elevation={0} className="navbar-appbar">
          <Toolbar className="navbar-toolbar">
            {/* Logo / Brand */}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              className="navbar-brand"
              onClick={() => scrollToSection("home")}
            >
              Morawakkorale Tea CO-OP
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
              <Button onClick={() => scrollToSection("about")} className="nav-button">
                About Us
              </Button>
              <Button onClick={() => scrollToSection("contact")} className="nav-button">
                Contact
              </Button>
              <Button onClick={() => setShowLogin(true)} className="login-button">
                Log In
              </Button>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>

            {/* Mobile Navigation Menu */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{ className: "mobile-menu" }}
            >
              <MenuItem onClick={() => scrollToSection("about")} className="mobile-menu-item">
                About Us
              </MenuItem>
              <MenuItem onClick={() => scrollToSection("contact")} className="mobile-menu-item">
                Contact
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setShowLogin(true);
                  handleMenuClose();
                }}
                className="mobile-menu-item"
              >
                Log In
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </Slide>

      {/* Login Modal */}
      <LoginModal open={showLogin} handleClose={() => setShowLogin(false)} />
    </>
  );
};

export default Navbar;
