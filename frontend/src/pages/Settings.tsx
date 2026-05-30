import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function Settings() {
  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Company Settings
      </Typography>

      <Paper
        sx={{
          p: 3,
          maxWidth: 600,
        }}
      >
        <Stack spacing={2}>
          <TextField
            label="Company Name"
          />

          <TextField
            label="GST Number"
          />

          <TextField
            label="Phone Number"
          />

          <TextField
            label="Address"
            multiline
            rows={3}
          />

          <Button
            variant="contained"
          >
            Save Settings
          </Button>
        </Stack>
      </Paper>
    </>
  );
}