import { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import api from "../services/api";

interface InventoryItem {
  productId: string;
  productName: string;
  purchased: number;
  sold: number;
  available: number;
}

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const loadInventory = async () => {
    const res = await api.get("/inventory");
    setInventory(res.data);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Inventory Stock
      </Typography>

      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Purchased</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sold</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Available</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.productId} hover>
                <TableCell sx={{ fontWeight: 500 }}>{item.productName}</TableCell>
                <TableCell>{item.purchased}</TableCell>
                <TableCell>{item.sold}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {item.available}
                </TableCell>
                <TableCell>
                  {item.available <= 0 ? (
                    <Chip label="Out of Stock" size="small" color="error" />
                  ) : item.available <= 10 ? (
                    <Chip label="Low Stock" size="small" color="warning" />
                  ) : (
                    <Chip label="In Stock" size="small" color="success" />
                  )}
                </TableCell>
              </TableRow>
            ))}
            {inventory.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    No inventory data
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
