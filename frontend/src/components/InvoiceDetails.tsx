import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";

export default function InvoiceDetails({
  open,
  onClose,
  invoice,
}: any) {
  if (!invoice) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Invoice Details
      </DialogTitle>

      <DialogContent>
        <Typography>
          Customer:
          {invoice.customerName}
        </Typography>

        <Typography>
          Invoice:
          {invoice.invoiceNumber}
        </Typography>

        <Typography>
          Amount:
          ₹{invoice.totalAmount}
        </Typography>

        <hr />

        {invoice.items?.map(
          (item: any) => (
            <Typography
              key={item.id}
            >
              {
                item.product
                  ?.name
              }
              {" - "}
              Qty:
              {item.quantity}
            </Typography>
          ),
        )}
      </DialogContent>
    </Dialog>
  );
}