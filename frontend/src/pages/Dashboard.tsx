import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  CircularProgress,
  Box,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Url {
  _id: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
}

const Dashboard = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.warning("You need to be logged in.");
      navigate("/login");
      return;
    }

    const fetchUrls = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/url`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setUrls(response.data);
      } catch {
        toast.error("Failed to load URLs.");
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [token, navigate]);

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard!");
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/url/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUrls(urls.filter((url) => url._id !== id));
      toast.success("URL deleted successfully.");
    } catch {
      toast.error("Failed to delete URL.");
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={4}
      >
        <Typography variant="h4">Your Shortened URLs</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/create-url")}
        >
          New URL
        </Button>
      </Box>

      {urls.length === 0 ? (
        <Typography mt={4} align="center">
          No URLs created yet.
        </Typography>
      ) : (
        <List>
          {urls.map((url) => (
            <ListItem key={url._id} divider>
              <ListItemText
                primary={url.shortUrl}
                secondary={`Clicks: ${url.clicks}`}
              />
              <Tooltip title="Copy URL">
                <IconButton onClick={() => handleCopy(url.shortUrl)}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => handleDelete(url._id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      )}

      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        sx={{ mt: 3 }}
        onClick={logout}
      >
        Logout
      </Button>
    </Container>
  );
};

export default Dashboard;
