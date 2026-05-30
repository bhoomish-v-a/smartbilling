import { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
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
  const [inventory, setInventory] =
    useState<InventoryItem[]>([]);

  const loadInventory = async () => {
    const res = await api.get("/inventory");
    setInventory(res.data);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Inventory
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Product
              </TableCell>

              <TableCell>
                Purchased
              </TableCell>

              <TableCell>
                Sold
              </TableCell>

              <TableCell>
                Available
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {inventory.map((item) => (
              <TableRow
                key={item.productId}
              >
                <TableCell>
                  {item.productName}
                </TableCell>

                <TableCell>
                  {item.purchased}
                </TableCell>

                <TableCell>
                  {item.sold}
                </TableCell>

                <TableCell>
                  {item.available}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}