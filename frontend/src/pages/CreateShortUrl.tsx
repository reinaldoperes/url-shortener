import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateShortUrl = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [originalUrl, setOriginalUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!originalUrl.trim()) {
      toast.error("Original URL is required.");
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, any> = { originalUrl };
      if (customSlug.trim()) payload.customSlug = customSlug;
      if (expiresInDays.trim()) {
        const days = Number(expiresInDays);
        if (isNaN(days) || days <= 0) {
          toast.error("Expiration must be a positive number.");
          setLoading(false);
          return;
        }
        payload.expiresInDays = days;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/url/shorten`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 201) {
        const shortUrl = response.data.data.attributes.shortUrl;
        toast.success(`URL shortened successfully! Slug: ${shortUrl}`);
        navigate("/dashboard");
      } else {
        toast.warn("URL shortened, but unexpected status received.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to shorten URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Shorten a URL
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Original URL"
            variant="outlined"
            fullWidth
            margin="normal"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />
          <TextField
            label="Custom Slug (Optional)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value)}
          />
          <TextField
            label="Expiration (Days) (Optional)"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Shorten URL"}
          </Button>
        </form>
        <Button
          onClick={() => navigate("/dashboard")}
          sx={{ mt: 2, textTransform: "none" }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default CreateShortUrl;
