import Payment from '@/component/Payment/Payment'
import React from 'react'

export const metadata = {
  title: "Payments – View Your Earnings and Payout History | Bio Link",
  description: "Access your payment history, upcoming payouts, and total earnings as a creator on Bio Link. Track your financial growth in one place.",
};

const page = () => {
  return (
    <div>
      <Payment/>
    </div>
  )
}

export default page
