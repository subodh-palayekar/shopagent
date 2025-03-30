import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import Link from 'next/link';

type OrderDetails = {
  orderNumber: string;
  orderDate: string;
  deliveryDate: string;
};

export const OrderConfirmation = ({
  orderDetails,
}: {
  orderDetails: OrderDetails;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center  justify-center py-5 text-center w-full"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
        className="mb-6 "
      >
        <CheckCircle className="h-20 w-20  text-green-500" strokeWidth={1.5} />
      </motion.div>

      <h1 className="text-3xl font-bold mb-4  bg-clip-text ">
        Your Order is Placed!
      </h1>

      {/* <p className="text-slate-600 mb-8 max-w-md">
        Thank you for your purchase. We've received your order and will process
        it right away. You will receive a confirmation email shortly.
      </p> */}

      <div className="w-full max-w-sm p-3  rounded-lg mb-8">
        <h3 className="font-medium  mb-3">Order Details</h3>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-bold">Order Number</span>
          <span className="font-medium">{orderDetails.orderNumber}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-bold">Date</span>
          <span className="font-medium">{orderDetails.orderDate}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-bold">Estimated Delivery</span>
          <span className="font-medium">{orderDetails.deliveryDate}</span>
        </div>
        <Link href={'/chat'}>
          <Button className="w-full mt-2">Return to store</Button>
        </Link>
      </div>
    </motion.div>
  );
};
