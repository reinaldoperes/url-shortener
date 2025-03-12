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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { updateSlug } from "../api/urls";

interface Url {
  _id: string;
  shortUrl: string;
  originalUrl: string;
  slug: string;
  clicks: number;
}

const Dashboard = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [newSlug, setNewSlug] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUrlToDelete, setSelectedUrlToDelete] = useState<string | null>(
    null,
  );

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

  const handleOpenDeleteDialog = (id: string) => {
    setSelectedUrlToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUrlToDelete(null);
  };

  const handleDelete = async () => {
    if (!selectedUrlToDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/url/${selectedUrlToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUrls(urls.filter((url) => url._id !== selectedUrlToDelete));
      toast.success("URL deleted successfully.");
    } catch {
      toast.error("Failed to delete URL.");
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleEditClick = (slug: string) => {
    setEditingSlug(slug);
    setNewSlug(slug);
  };

  const handleCancelEdit = () => {
    setEditingSlug(null);
  };

  const handleSaveClick = async (urlId: string) => {
    if (!newSlug.trim()) {
      toast.error("Slug cannot be empty.");
      return;
    }

    if (editingSlug === newSlug) {
      toast.info("No changes detected.");
      setEditingSlug(null);
      return;
    }

    try {
      await updateSlug(urlId, newSlug);
      setUrls(
        urls.map((url) =>
          url._id === urlId
            ? {
                ...url,
                slug: newSlug,
                shortUrl: `${import.meta.env.VITE_API_URL}/${newSlug}`,
              }
            : url,
        ),
      );
      toast.success("Slug updated successfully.");
      setEditingSlug(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update slug.");
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
                primary={
                  editingSlug === url.slug ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSaveClick(url._id)
                      }
                    />
                  ) : (
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {url.shortUrl}
                    </a>
                  )
                }
                secondary={`Clicks: ${url.clicks}`}
              />
              <Tooltip title="Copy URL">
                <IconButton onClick={() => handleCopy(url.shortUrl)}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              {editingSlug === url.slug ? (
                <>
                  <Tooltip title="Save">
                    <IconButton onClick={() => handleSaveClick(url._id)}>
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cancel">
                    <IconButton onClick={handleCancelEdit}>
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleEditClick(url.slug)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Delete">
                <IconButton onClick={() => handleOpenDeleteDialog(url._id)}>
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

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this URL? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
