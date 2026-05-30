import { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import api from "../services/api";

export default function Settings() {
  const [form, setForm] = useState({
    name: "",
    gstNumber: "",
    phone: "",
    address: "",
  });
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/company").then((res) => {
      if (res.data) {
        setForm({
          name: res.data.name || "",
          gstNumber: res.data.gstNumber || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
        });
        setCompanyId(res.data.id);
      }
    });
  }, []);

  const save = async () => {
    setSaved(false);
    setError("");
    try {
      if (companyId) {
        await api.put(`/company/${companyId}`, form);
      } else {
        await api.post("/company", form);
      }
      setSaved(true);
    } catch {
      setError("Failed to save settings");
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Company Settings
      </Typography>

      <Paper elevation={0} sx={{ p: 3, maxWidth: 600, border: "1px solid", borderColor: "divider" }}>
        {saved && <Alert severity="success" sx={{ mb: 2 }}>Settings saved successfully</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2.5}>
          <TextField
            label="Company Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="GST Number"
            value={form.gstNumber}
            onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
            fullWidth
          />
          <TextField
            label="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            fullWidth
          />
          <TextField
            label="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            multiline
            rows={3}
            fullWidth
          />
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={save}
            sx={{ alignSelf: "flex-start" }}
          >
            Save Settings
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
